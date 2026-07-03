import { NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import path from "node:path";

import { buildPrompt, type PromptMode } from "../../../masa/wizard/llmPrompt";
import { parseLlmJson, validateLlmResponse } from "../../../masa/wizard/recommendSchema";
import type { Locale, QrMenuData } from "../../../masa/masaTypes";
import type { WizardAnswers } from "../../../masa/wizard/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RecommendBody {
  mode?: unknown;
  answers?: unknown;
  freetext?: unknown;
  budgetBgn?: unknown;
  locale?: unknown;
  sessionToken?: unknown;
}

interface RecommendResponse {
  ok: boolean;
  source: "groq" | "empty";
  response: null | {
    main: { id: string; matchReasons: string[] } | null;
    alternatives: { id: string; matchReasons: string[] }[];
    combo: {
      side: { id: string; reasonKey: string } | null;
      drink: { id: string; reasonKey: string } | null;
    };
    rationale: string;
  };
  errors?: string[];
}

const VALID_LOCALES: ReadonlySet<Locale> = new Set(["bg", "tr", "en"]);
const VALID_MODES: ReadonlySet<PromptMode> = new Set(["buttons", "freetext"]);

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
  console.warn("[wizard/recommend] GROQ_API_KEY is not set — LLM path is disabled, wizard will fall back to local scoring");
}

async function callGroq(system: string, user: string, signal: AbortSignal): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
  if (!apiKey) {
    warnMissingKeyOnce();
    return null;
  }

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
      temperature: 0.3,
      max_tokens: 600,
    }),
    signal,
  });

  if (!res.ok) {
    console.error(`[wizard/recommend] groq ${res.status}`);
    return null;
  }
  const data = (await res.json()) as GroqResponse;
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string") return null;
  return content;
}

async function callGroqWithRetry(system: string, user: string, timeoutMs: number): Promise<string | null> {
  // One shot. Retries add latency that hurts the wizard UX more than they
  // help; the client has a 5s timeout and will fall back to local scoring
  // if we time out.
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await callGroq(system, user, ctrl.signal);
  } catch (err) {
    if ((err as Error)?.name === "AbortError") {
      console.warn("[wizard/recommend] groq timeout");
    } else {
      console.error("[wizard/recommend] groq network error:", err);
    }
    return null;
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
    return NextResponse.json({ ok: false, source: "empty", response: null, errors: ["bad json"] }, { status: 200 });
  }

  // 2. Soft auth — reject if no plausible session token
  const sessionToken = typeof body.sessionToken === "string" ? body.sessionToken.trim() : "";
  if (!isPlausibleSessionToken(sessionToken)) {
    return NextResponse.json({ ok: false, source: "empty", response: null, errors: ["no session"] }, { status: 200 });
  }

  // 3. Rate limit
  if (!rateLimitOk(clientIp(request))) {
    return NextResponse.json({ ok: false, source: "empty", response: null, errors: ["rate-limited"] }, { status: 200 });
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
  const budgetBgn = typeof body.budgetBgn === "number" && Number.isFinite(body.budgetBgn) && body.budgetBgn > 0
    ? body.budgetBgn
    : null;

  // 5. Load menu
  const menu = loadMenu();
  if (!menu) {
    return NextResponse.json({ ok: false, source: "empty", response: null, errors: ["menu"] }, { status: 200 });
  }

  // 6. Build prompt
  const prompt = buildPrompt({ locale, mode, answers, freetext, budgetBgn, menu: menu.categories });

  // 7. Call Groq
  const timeoutMs = Number.parseInt(process.env.GROQ_TIMEOUT_MS ?? "5000", 10);
  const content = await callGroqWithRetry(prompt.system, prompt.user, timeoutMs);
  if (!content) {
    return NextResponse.json({ ok: false, source: "empty", response: null, errors: ["groq"] }, { status: 200 });
  }

  // 8. Parse + validate
  const parsed = parseLlmJson(content);
  const validated = validateLlmResponse(parsed, menu.categories, locale, { budgetBgn });
  if (!validated.ok || !validated.response) {
    return NextResponse.json({
      ok: false,
      source: "empty",
      response: null,
      errors: validated.errors,
    }, { status: 200 });
  }

  return NextResponse.json({
    ok: true,
    source: "groq",
    response: validated.response,
  });
}

function isWizardAnswers(v: unknown): v is WizardAnswers {
  if (typeof v !== "object" || v === null || Array.isArray(v)) return false;
  // Minimal shape check — anything more is wasted CPU; the prompt restricts
  // the LLM and the validator drops the rest.
  return true;
}
