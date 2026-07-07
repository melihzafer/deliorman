// Hand-rolled schema validator for the LLM's JSON output.
//
// llama-3.1-8b-instant with response_format=json_object is good, but not
// perfect. It can:
//   - Return a string for a number field
//   - Return a hallucinated item id
//   - Wrap the response in markdown fences (rare with json_object mode, but
//     worth defending against)
//   - Forget an array
//   - Invent a reasonKey that doesn't exist
//
// We never trust the LLM for prices, budget, or item existence. Every id is
// checked against the real menu, every reasonKey is checked against the
// allowed vocabulary, every numeric field is coerced and bounded. This
// validator only shapes and sanity-checks the response — it does NOT decide
// the final budget-safe combination. That is budgetRepair.ts's job, called
// by the route handler after validation succeeds.

import type { Locale, QrMenuCategory } from "../masaTypes";
import type { BudgetStatus } from "./types";

// ---------------------------------------------------------------------------
// Output types — what the LLM is asked to produce.
// ---------------------------------------------------------------------------

export type ReasonKey =
  | "filling"
  | "budget_fit"
  | "beer_pairing"
  | "light"
  | "sweet"
  | "grilled"
  | "classic"
  | "adventurous"
  | "family_safe"
  | "good_value"
  | "fresh"
  | "spicy";

export interface LlmResponse {
  language: Locale;
  primaryItemId: string | null;
  drinkItemId: string | null;
  sideItemId: string | null;
  alternativeItemIds: string[];
  budgetStatus: BudgetStatus;
  totalEstimatedPrice: number | null;
  confidence: number; // 0..100
  reasonKeys: ReasonKey[];
  customerMessage: string;
}

// ---------------------------------------------------------------------------
// Allowed vocabularies
// ---------------------------------------------------------------------------

export const ALLOWED_REASON_KEYS: ReadonlySet<string> = new Set<ReasonKey>([
  "filling",
  "budget_fit",
  "beer_pairing",
  "light",
  "sweet",
  "grilled",
  "classic",
  "adventurous",
  "family_safe",
  "good_value",
  "fresh",
  "spicy",
]);

export const ALLOWED_BUDGET_STATUS: ReadonlySet<string> = new Set<BudgetStatus>([
  "within_budget",
  "food_only_within_budget",
  "drink_only_within_budget",
  "over_budget_no_safe_combo",
]);

const VALID_LOCALES: ReadonlySet<string> = new Set(["bg", "tr", "en"]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface MenuIndex {
  ids: Set<string>;
  idToPrice: Map<string, number | null>;
}

function buildMenuIndex(categories: QrMenuCategory[]): MenuIndex {
  const ids = new Set<string>();
  const idToPrice = new Map<string, number | null>();
  for (const cat of categories) {
    for (const item of cat.items) {
      ids.add(item.id);
      idToPrice.set(item.id, item.price);
    }
  }
  return { ids, idToPrice };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function asString(v: unknown): string | null {
  return typeof v === "string" ? v.trim() : null;
}

function asId(v: unknown, idx: MenuIndex): string | null {
  const id = asString(v);
  if (!id || !idx.ids.has(id)) return null;
  return id;
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string").map((s) => s.trim());
}

function clampConfidence(v: unknown): number {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number.parseFloat(v) : NaN;
  if (!Number.isFinite(n)) return 50;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function coercePrice(v: unknown): number | null {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number.parseFloat(v) : NaN;
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function parseLlmJson(text: string): unknown {
  // Strip a single outer ```json ... ``` fence if present.
  const trimmed = text.trim();
  const fence = trimmed.match(/^```(?:json)?\s*([\s\S]+?)\s*```$/i);
  const body = fence ? fence[1] : trimmed;
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

export interface ValidateOptions {
  maxMessageChars?: number;
}

export interface ValidateResult {
  ok: boolean;
  response: LlmResponse | null;
  errors: string[];
}

export function validateLlmResponse(
  raw: unknown,
  categories: QrMenuCategory[],
  locale: Locale,
  options: ValidateOptions = {},
): ValidateResult {
  const errors: string[] = [];
  if (!isRecord(raw)) {
    return { ok: false, response: null, errors: ["top-level is not an object"] };
  }
  const idx = buildMenuIndex(categories);
  const maxMessage = options.maxMessageChars ?? 280;

  const language = asString(raw.language);
  const safeLocale: Locale = language && VALID_LOCALES.has(language) ? (language as Locale) : locale;

  const primaryItemId = asId(raw.primaryItemId, idx);
  if (raw.primaryItemId != null && !primaryItemId) errors.push("primaryItemId rejected (unknown id)");

  const drinkItemId = asId(raw.drinkItemId, idx);
  if (raw.drinkItemId != null && !drinkItemId) errors.push("drinkItemId rejected (unknown id)");

  const sideItemId = asId(raw.sideItemId, idx);
  if (raw.sideItemId != null && !sideItemId) errors.push("sideItemId rejected (unknown id)");

  const altsRaw = asStringArray(raw.alternativeItemIds);
  const alternativeItemIds: string[] = [];
  const seen = new Set<string>([primaryItemId, drinkItemId, sideItemId].filter(Boolean) as string[]);
  for (const a of altsRaw) {
    if (!idx.ids.has(a) || seen.has(a)) continue;
    seen.add(a);
    alternativeItemIds.push(a);
    if (alternativeItemIds.length >= 3) break;
  }

  const budgetStatusRaw = asString(raw.budgetStatus);
  const budgetStatus: BudgetStatus =
    budgetStatusRaw && ALLOWED_BUDGET_STATUS.has(budgetStatusRaw)
      ? (budgetStatusRaw as BudgetStatus)
      : "within_budget";

  const totalEstimatedPrice = raw.totalEstimatedPrice == null ? null : coercePrice(raw.totalEstimatedPrice);
  const confidence = clampConfidence(raw.confidence);

  const reasonKeysRaw = asStringArray(raw.reasonKeys);
  const reasonKeys = reasonKeysRaw.filter((k): k is ReasonKey => ALLOWED_REASON_KEYS.has(k)).slice(0, 4);

  let customerMessage = asString(raw.customerMessage) ?? "";
  if (customerMessage.length > maxMessage) {
    customerMessage = customerMessage.slice(0, maxMessage).trimEnd() + "…";
  }

  const response: LlmResponse = {
    language: safeLocale,
    primaryItemId,
    drinkItemId,
    sideItemId,
    alternativeItemIds,
    budgetStatus,
    totalEstimatedPrice,
    confidence,
    reasonKeys,
    customerMessage,
  };

  // Structural ok — a well-formed object we can hand to budgetRepair. A
  // missing/hallucinated primaryItemId is NOT a hard failure here: the
  // repair step fills it from the local candidate shortlist. It's only a
  // hard failure when literally nothing usable came back at all.
  const ok = primaryItemId != null || drinkItemId != null || sideItemId != null || alternativeItemIds.length > 0;
  if (!ok) errors.push("no valid item ids in response");
  return { ok, response, errors };
}
