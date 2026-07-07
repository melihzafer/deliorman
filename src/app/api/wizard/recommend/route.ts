import { NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import path from "node:path";

import { buildPrompt, type PromptMode } from "../../../masa/wizard/llmPrompt";
import { parseLlmJson, validateLlmResponse, type ReasonKey } from "../../../masa/wizard/recommendSchema";
import { classifyCustomerMode } from "../../../masa/wizard/customerMode";
import { buildCandidateShortlist } from "../../../masa/wizard/candidates";
import { repairBudget } from "../../../masa/wizard/budgetRepair";
import type { Locale, QrMenuData } from "../../../masa/masaTypes";
import type { BudgetStatus, WizardAnswers } from "../../../masa/wizard/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RecommendBody {
  mode?: unknown;
  answers?: unknown;
  freetext?: unknown;
  budgetEur?: unknown;
  locale?: unknown;
  sessionToken?: unknown;
  requestId?: unknown;
}

interface RecommendDebug {
  requestId?: string | null;
  groqCalled: boolean;
  groqMs: number | null;
  validationPassed: boolean;
  fallbackReason: string | null;
  errors?: string[];
}

interface RecommendResponse {
  ok: boolean;
  source: "llm" | "local_fallback";
  response: null | {
    language: Locale;
    primaryItemId: string | null;
    drinkItemId: string | null;
    sideItemId: string | null;
    alternativeItemIds: string[];
    budgetStatus: BudgetStatus;
    totalEstimatedPrice: number | null;
    confidence: number;
    reasonKeys: ReasonKey[];
    customerMessage: string;
  };
  debug?: RecommendDebug;
  errors?: string[];
}

const VALID_LOCALES: ReadonlySet<Locale> = new Set(["bg", "tr", "en"]);
const VALID_MODES: ReadonlySet<PromptMode> = new Set(["buttons", "freetext"]);
const WIZARD_DEBUG = process.env.NODE_ENV !== "production";

function apiDebug(stage: string, details?: Record<string, unknown>) {
  if (!WIZARD_DEBUG) return;
  if (details) console.log(`[wizard-api] ${stage}`, details);
  else console.log(`[wizard-api] ${stage}`);
}

function createDebug(requestId?: string | null): RecommendDebug {
  return {
    requestId: requestId ?? null,
    groqCalled: false,
    groqMs: null,
    validationPassed: false,
    fallbackReason: null,
  };
}

function fallbackResponse(
  debug: RecommendDebug,
  reason: string,
  errors: string[] = [reason],
): NextResponse<RecommendResponse> {
  debug.fallbackReason = reason;
  debug.errors = errors;
  apiDebug("fallback:returned", {
    requestId: debug.requestId,
    reason,
    errors,
    groqCalled: debug.groqCalled,
    groqMs: debug.groqMs,
    validationPassed: debug.validationPassed,
  });
  return NextResponse.json({
    ok: false,
    source: "local_fallback",
    response: null,
    errors,
    ...(WIZARD_DEBUG ? { debug } : {}),
  });
}

// ---------------------------------------------------------------------------
// Menu loader — read once per request, parsed synchronously.
// In dev (Next.js HMR) we re-read on every request, which is fine — the file
// is small (~80KB).
// ---------------------------------------------------------------------------

let cachedMenu: QrMenuData | null = null;

function loadMenu(): QrMenuData | null {
  if (cachedMenu) return cachedMenu;
  try {
    const file = path.join(process.cwd(), "public", "data", "menu.json");
    const raw = readFileSync(file, "utf8");
    cachedMenu = JSON.parse(raw) as QrMenuData;
    return cachedMenu;
  } catch (err) {
    console.error("[wizard/recommend] menu load failed:", err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Per-IP rate limit — in-memory sliding window.
// Survives within a single server instance only. Vercel production runs
// multiple instances; the budget is still bounded by the per-IP cap on each.
// ---------------------------------------------------------------------------

interface RateBucket {
  hits: number[];
}

const rateLimitMap: Map<string, RateBucket> = (() => {
  const g = globalThis as unknown as { __deliormanWizardRate?: Map<string, RateBucket> };
  if (!g.__deliormanWizardRate) g.__deliormanWizardRate = new Map();
  return g.__deliormanWizardRate;
})();

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function rateLimitOk(ip: string): boolean {
  const windowSec = Number.parseInt(process.env.WIZARD_LLM_RATE_WINDOW_SECONDS ?? "60", 10);
  const max = Number.parseInt(process.env.WIZARD_LLM_RATE_MAX ?? "10", 10);
  const now = Date.now();
  const cutoff = now - windowSec * 1000;
  const bucket = rateLimitMap.get(ip) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => t > cutoff);
  if (bucket.hits.length >= max) {
    rateLimitMap.set(ip, bucket);
    return false;
  }
  bucket.hits.push(now);
  rateLimitMap.set(ip, bucket);
  return true;
}

// ---------------------------------------------------------------------------
// Session gate — soft auth. The wizard UI only renders when there's a valid
// QR menu session, so the token should be there. We just verify the format
// and leave full session validation to the upstream /masa page.
// ---------------------------------------------------------------------------

function isPlausibleSessionToken(token: string): boolean {
  if (!token || token.length < 8 || token.length > 200) return false;
  // Current /masa direct-menu mode disables sheet-backed sessions and uses
  // this sentinel. It still means the wizard rendered from an active menu.
  if (token === "session-disabled") return true;
  // Accept UUID (guest), vip-* (VIP), dev-local-* (local dev).
  if (/^(vip-|dev-local-)/.test(token)) return true;
  if (/^[0-9a-f-]{32,}$/i.test(token)) return true; // rough uuid-ish
  return false;
}

// ---------------------------------------------------------------------------
// Groq call
// ---------------------------------------------------------------------------

const GROQ_BASE = "https://api.groq.com/openai/v1";

interface GroqChoice {
  message?: { content?: string };
}
interface GroqResponse {
  choices?: GroqChoice[];
  error?: { message?: string };
}

// One-shot log when the key is missing, so devs know the LLM path is
// disabled. Logged at module load, not on every request.
let _keyWarned = false;
function warnMissingKeyOnce() {
  if (_keyWarned) return;
  _keyWarned = true;
  console.warn("[wizard-api] groq:error", { reason: "missing_api_key" });
}

function formatBudgetForMessage(budgetEur: number | null, locale: Locale): string {
  if (budgetEur == null) return "";
  const rounded = Math.round(budgetEur * 100) / 100;
  if (locale === "tr") return `${rounded}€`;
  if (locale === "bg") return `${rounded} €`;
  return `€${rounded}`;
}

function mentionsAlcohol(text: string): boolean {
  const s = text.toLowerCase();
  return /\bbeer\b|\bwine\b|\balcohol\b|pilsner|bira|şarap|alkol|бира|вино|алкохол/.test(s);
}

function isGenericCustomerMessage(text: string): boolean {
  const s = text.toLowerCase();
  return !s.trim() ||
    /based on your preferences/.test(s) ||
    /you should try/.test(s) ||
    /try (our|the) delicious/.test(s) ||
    /try our/.test(s) ||
    /great value/.test(s) ||
    /for the price/.test(s) ||
    /satisfied with this/.test(s) ||
    /you.?ll be satisfied/.test(s) ||
    /great choice/.test(s) ||
    /good choice/.test(s) ||
    /great option/.test(s) ||
    /nice option/.test(s) ||
    /perfect pick/.test(s);
}

function mentionsBudgetText(text: string): boolean {
  const s = text.toLowerCase();
  return /budget|under|within|€|euro|eur|bütçe|лимит|бюджет/.test(s);
}

function repairedCustomerMessage(input: {
  originalMessage: string;
  locale: Locale;
  freetext: string;
  customerMode: string;
  budgetEur: number | null;
  originalDrinkItemId: string | null;
  repairedDrinkItemId: string | null;
  budgetStatus: BudgetStatus;
}): string {
  const wantsAlcohol = input.customerMode === "beer_with_food" || mentionsAlcohol(input.freetext) || mentionsAlcohol(input.originalMessage);
  const drinkDropped = !!input.originalDrinkItemId && input.originalDrinkItemId !== input.repairedDrinkItemId;
  const messageClaimsDrink = !input.repairedDrinkItemId && mentionsAlcohol(input.originalMessage);
  const generic = isGenericCustomerMessage(input.originalMessage);
  const budget = formatBudgetForMessage(input.budgetEur, input.locale);
  const shouldMentionBudget = input.budgetEur != null &&
    (input.customerMode === "very_hungry_low_budget" ||
      input.customerMode === "hungry_normal" ||
      input.budgetStatus === "within_budget" ||
      input.budgetStatus === "food_only_within_budget");
  const missesBudget = shouldMentionBudget && !mentionsBudgetText(input.originalMessage);

  if (wantsAlcohol && !input.repairedDrinkItemId && (drinkDropped || messageClaimsDrink || input.budgetStatus === "food_only_within_budget")) {
    if (input.locale === "tr") {
      return budget
        ? `Çok aç olduğun için önce doyurucu yemeği seçtim. Bira ${budget} bütçeyi zorladığı için yemeği bütçede tuttum.`
        : "Çok aç olduğun için önce doyurucu yemeği seçtim. Birayı ancak bütçe kalırsa eklemek daha mantıklı.";
    }
    if (input.locale === "bg") {
      return budget
        ? `Избрах първо засищаща храна. Бирата би натиснала бюджета ${budget}, затова оставих избора в лимита.`
        : "Избрах първо засищаща храна. Добави бира само ако остане бюджет.";
    }
    return budget
      ? `Food first: this keeps you full and stays under your ${budget} budget. I skipped beer because it would crowd the budget.`
      : "Food first: this keeps you full. Add beer only if the budget still allows it.";
  }

  if (generic || missesBudget) {
    if (input.locale === "tr") {
      return budget
        ? `Çok aç olduğun için doyurucu ve ${budget} bütçeye uyan seçimi öne aldım.`
        : "Çok aç olduğun için doyurucu seçimi öne aldım.";
    }
    if (input.locale === "bg") {
      return budget
        ? `Избрах го, защото засища и остава в бюджета ${budget}.`
        : "Избрах го, защото засища и е практичен избор.";
    }
    return budget
      ? `Filling enough for your hunger and kept under your ${budget} budget.`
      : "Filling enough for your hunger without overcomplicating the pick.";
  }

  return input.originalMessage;
}

interface GroqCallResult {
  content: string | null;
  ms: number | null;
  error: string | null;
}

async function callGroqWithRetry(
  system: string,
  user: string,
  timeoutMs: number,
  debug: RecommendDebug,
): Promise<GroqCallResult> {
  // One shot. Retries add latency that hurts the wizard UX more than they
  // help; the client has a 6s timeout and will fall back to local scoring
  // if we time out.
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
  if (!apiKey) {
    warnMissingKeyOnce();
    return { content: null, ms: null, error: "missing_api_key" };
  }

  const ctrl = new AbortController();
  const started = Date.now();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    debug.groqCalled = true;
    apiDebug("groq:start", { requestId: debug.requestId, model, timeoutMs });
    const res = await fetch(`${GROQ_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
        // Low randomness on purpose: this is decision logic (budget, item
        // ids), not creative writing. A chatty/creative model here means
        // hallucinated ids and blown budgets that the validator has to catch.
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 450,
      }),
      signal: ctrl.signal,
    });

    debug.groqMs = Date.now() - started;
    if (!res.ok) {
      apiDebug("groq:error", { requestId: debug.requestId, status: res.status, ms: debug.groqMs });
      return { content: null, ms: debug.groqMs, error: `groq_http_${res.status}` };
    }
    const data = (await res.json()) as GroqResponse;
    if (data.error?.message) {
      apiDebug("groq:error", { requestId: debug.requestId, reason: "groq_payload_error", message: data.error.message, ms: debug.groqMs });
      return { content: null, ms: debug.groqMs, error: "groq_payload_error" };
    }
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      apiDebug("groq:error", { requestId: debug.requestId, reason: "missing_content", ms: debug.groqMs });
      return { content: null, ms: debug.groqMs, error: "missing_content" };
    }
    apiDebug("groq:success", { requestId: debug.requestId, ms: debug.groqMs, chars: content.length });
    return { content, ms: debug.groqMs, error: null };
  } catch (err) {
    debug.groqMs = Date.now() - started;
    if ((err as Error)?.name === "AbortError") {
      apiDebug("groq:error", { requestId: debug.requestId, reason: "timeout", timeoutMs, ms: debug.groqMs });
      return { content: null, ms: debug.groqMs, error: "timeout" };
    } else {
      apiDebug("groq:error", { requestId: debug.requestId, reason: "network_error", message: (err as Error)?.message, ms: debug.groqMs });
      return { content: null, ms: debug.groqMs, error: "network_error" };
    }
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request: Request): Promise<NextResponse<RecommendResponse>> {
  // 1. Parse body
  let body: RecommendBody;
  try {
    body = (await request.json()) as RecommendBody;
  } catch {
    const debug = createDebug(null);
    apiDebug("request:received", { requestId: null, error: "bad_json" });
    return fallbackResponse(debug, "bad_json", ["bad json"]);
  }
  const requestId = typeof body.requestId === "string" ? body.requestId.slice(0, 80) : null;
  const debug = createDebug(requestId);
  apiDebug("request:received", {
    requestId,
    mode: typeof body.mode === "string" ? body.mode : "unknown",
    locale: typeof body.locale === "string" ? body.locale : "unknown",
    textLen: typeof body.freetext === "string" ? body.freetext.length : 0,
    textPreview: WIZARD_DEBUG && typeof body.freetext === "string" ? body.freetext.slice(0, 80) : undefined,
    hasSessionToken: typeof body.sessionToken === "string" && body.sessionToken.trim().length > 0,
  });

  // 2. Soft auth — reject if no plausible session token
  const sessionToken = typeof body.sessionToken === "string" ? body.sessionToken.trim() : "";
  if (!isPlausibleSessionToken(sessionToken)) {
    return fallbackResponse(debug, "no_session", ["no session"]);
  }

  // 3. Rate limit
  if (!rateLimitOk(clientIp(request))) {
    return fallbackResponse(debug, "rate_limited", ["rate-limited"]);
  }

  // 4. Validate inputs
  const locale = typeof body.locale === "string" && VALID_LOCALES.has(body.locale as Locale)
    ? (body.locale as Locale)
    : "bg";
  const mode = typeof body.mode === "string" && VALID_MODES.has(body.mode as PromptMode)
    ? (body.mode as PromptMode)
    : "buttons";
  const answers = isWizardAnswers(body.answers) ? body.answers : {};
  const freetext = typeof body.freetext === "string" ? body.freetext : "";
  const budgetEur = typeof body.budgetEur === "number" && Number.isFinite(body.budgetEur) && body.budgetEur > 0
    ? body.budgetEur
    : null;

  // 5. Load menu
  const menu = loadMenu();
  if (!menu) {
    return fallbackResponse(debug, "menu_load_failed", ["menu"]);
  }

  // 6. Classify customer mode and build the deterministic candidate
  // shortlist. This is the code-owned filtering/scoring step: the LLM never
  // sees the full ~184-item menu, only the top 8-15 valid candidates.
  const customerMode = classifyCustomerMode({ answers, freetext, budgetEur });
  const candidates = buildCandidateShortlist({
    categories: menu.categories,
    answers,
    customerMode,
    budgetEur,
    freetext,
    locale,
  });
  if (candidates.length === 0) {
    return fallbackResponse(debug, "no_candidates", ["no-candidates"]);
  }

  // 7. Build prompt (rerank_and_explain mode — the LLM reranks/explains the
  // shortlist; explain_only, where the local top pick is trusted outright
  // and the LLM only writes the customerMessage, is a future extension of
  // this same pipeline).
  const prompt = buildPrompt({ locale, mode, answers, freetext, budgetEur, customerMode, candidates });

  // 8. Call Groq
  const timeoutMs = Number.parseInt(process.env.GROQ_TIMEOUT_MS ?? "5500", 10);
  const groq = await callGroqWithRetry(prompt.system, prompt.user, timeoutMs, debug);
  if (!groq.content) {
    return fallbackResponse(debug, groq.error ?? "groq_failed", [groq.error ?? "groq"]);
  }

  // 9. Parse + validate (structure/id/vocabulary only — no budget logic)
  const parsed = parseLlmJson(groq.content);
  const validated = validateLlmResponse(parsed, menu.categories, locale);
  if (!validated.ok || !validated.response) {
    debug.validationPassed = false;
    apiDebug("validation:failed", { requestId, errors: validated.errors });
    return fallbackResponse(debug, "validation_failed", validated.errors);
  }
  debug.validationPassed = true;
  apiDebug("validation:success", {
    requestId,
    primaryItemId: validated.response.primaryItemId,
    drinkItemId: validated.response.drinkItemId,
    sideItemId: validated.response.sideItemId,
    confidence: validated.response.confidence,
  });

  // 10. Deterministic budget repair — the code, not the LLM, owns the final
  // selected combination and whether it fits the diner's budget.
  const repaired = repairBudget({
    primaryItemId: validated.response.primaryItemId,
    drinkItemId: validated.response.drinkItemId,
    sideItemId: validated.response.sideItemId,
    candidates,
    budgetEur,
    customerMode,
  });

  if (!repaired.primaryItemId && !repaired.drinkItemId) {
    // No safe combo at all — never surface a broken/empty pick to the UI,
    // fall all the way back to the local deterministic engine.
    return fallbackResponse(debug, "no_safe_combo", ["no-safe-combo"]);
  }

  const reasonKeys = repaired.drinkItemId
    ? validated.response.reasonKeys
    : validated.response.reasonKeys.filter((key) => key !== "beer_pairing");
  const customerMessage = repairedCustomerMessage({
    originalMessage: validated.response.customerMessage,
    locale,
    freetext,
    customerMode,
    budgetEur,
    originalDrinkItemId: validated.response.drinkItemId,
    repairedDrinkItemId: repaired.drinkItemId,
    budgetStatus: repaired.budgetStatus,
  });

  return NextResponse.json({
    ok: true,
    source: "llm",
    response: {
      language: validated.response.language,
      primaryItemId: repaired.primaryItemId,
      drinkItemId: repaired.drinkItemId,
      sideItemId: repaired.sideItemId,
      alternativeItemIds: validated.response.alternativeItemIds,
      budgetStatus: repaired.budgetStatus,
      totalEstimatedPrice: repaired.totalEstimatedPrice,
      confidence: validated.response.confidence,
      reasonKeys,
      customerMessage,
    },
    ...(WIZARD_DEBUG ? { debug } : {}),
  });
}

function isWizardAnswers(v: unknown): v is WizardAnswers {
  if (typeof v !== "object" || v === null || Array.isArray(v)) return false;
  // Minimal shape check — anything more is wasted CPU; the prompt restricts
  // the LLM and the validator drops the rest.
  return true;
}
