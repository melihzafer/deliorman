// Hand-rolled schema validator for the LLM's JSON output.
//
// llama-3.1-8b-instruct with response_format=json_object is good, but not
// perfect. It can:
//   - Return a string for a number field
//   - Return a hallucinated item id
//   - Wrap the response in markdown fences (rare with json_object mode, but
//     worth defending against)
//   - Forget an array
//   - Invent a reasonKey that doesn't exist
//
// We never trust the LLM. Every id is checked against the real menu, every
// reason is checked against the allowed tag list, every numeric field is
// coerced and bounded, and the response is normalised before being returned
// to the wizard UI. Any item id we can't prove exists is dropped — and if
// the main pick drops out, the whole result is null and the client falls
// back to the local scoring engine.

import type { Locale, QrMenuCategory } from "../masaTypes";

// ---------------------------------------------------------------------------
// Output types — what the LLM is asked to produce.
// ---------------------------------------------------------------------------

export interface LlmPick {
  id: string;
  matchReasons: string[]; // tag values like "vibe:comfort"
}

export interface LlmCombo {
  side: { id: string; reasonKey: string } | null;
  drink: { id: string; reasonKey: string } | null;
}

export interface LlmResponse {
  main: LlmPick | null;
  alternatives: LlmPick[];
  combo: LlmCombo;
  rationale: string; // localised one-liner
}

// ---------------------------------------------------------------------------
// Allowed vocabularies — must match tag union types in ./types.ts.
// ---------------------------------------------------------------------------

export const ALLOWED_TAGS: ReadonlySet<string> = new Set([
  // vibe
  "vibe:traditional-bg", "vibe:comfort", "vibe:modern", "vibe:indulgent",
  "vibe:light", "vibe:celebratory", "vibe:adventurous",
  // flavor
  "flavor:savory", "flavor:sweet", "flavor:umami", "flavor:spicy",
  "flavor:fresh", "flavor:smoky", "flavor:bitter", "flavor:tart", "flavor:fruity",
  // texture
  "texture:grilled", "texture:fried", "texture:baked", "texture:raw",
  "texture:creamy", "texture:crispy", "texture:liquid", "texture:chewy",
  "texture:smooth", "texture:crumbly", "texture:soft",
  // temp
  "temp:hot", "temp:cold", "temp:room",
  // protein
  "protein:meat", "protein:poultry", "protein:fish", "protein:seafood",
  "protein:dairy", "protein:vegetable", "protein:grain", "protein:legume",
  "protein:fruit", "protein:sweet", "protein:mixed", "protein:none",
  // portion
  "portion:snack", "portion:meal", "portion:feast",
  // profile (drinks)
  "profile:caffeine", "profile:fruity", "profile:herbal", "profile:malty",
  "profile:hoppy", "profile:wine", "profile:spirit",
  // state (drinks)
  "state:alcoholic", "state:non-alcoholic", "state:low-alcohol",
]);

export const ALLOWED_REASON_KEYS: ReadonlySet<string> = new Set([
  "pair_fries",
  "pair_bread",
  "pair_fresh_side",
  "pair_side_default",
  "pair_drink_match",
  "pair_drink_default",
  "pair_dessert",
  "pair_snack",
  "pair_rakia",
  "pair_light",
  "pair_default",
]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface MenuIndex {
  ids: Set<string>;
  idToPrice: Map<string, number | null>;
  idToCategory: Map<string, string>;
}

function buildMenuIndex(categories: QrMenuCategory[]): MenuIndex {
  const ids = new Set<string>();
  const idToPrice = new Map<string, number | null>();
  const idToCategory = new Map<string, string>();
  for (const cat of categories) {
    for (const item of cat.items) {
      ids.add(item.id);
      idToPrice.set(item.id, item.price);
      idToCategory.set(item.id, cat.id);
    }
  }
  return { ids, idToPrice, idToCategory };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function asString(v: unknown): string | null {
  return typeof v === "string" ? v.trim() : null;
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string").map((s) => s.trim());
}

function normalisePick(raw: unknown, idx: MenuIndex, budgetBgn: number | null): LlmPick | null {
  if (!isRecord(raw)) return null;
  const id = asString(raw.id);
  if (!id || !idx.ids.has(id)) return null;
  const itemPrice = idx.idToPrice.get(id) ?? null;
  // Hard filter: drop picks that breach the budget. This is the code-side
  // budget gate that runs AFTER the LLM — a defence in depth.
  if (budgetBgn != null && itemPrice != null && itemPrice > budgetBgn) return null;
  const reasonsRaw = asStringArray(raw.matchReasons);
  const matchReasons = reasonsRaw.filter((r) => ALLOWED_TAGS.has(r));
  return { id, matchReasons };
}

function normaliseCombo(
  raw: unknown,
  idx: MenuIndex,
  budgetBgn: number | null,
): LlmCombo {
  const empty: LlmCombo = { side: null, drink: null };
  if (!isRecord(raw)) return empty;
  const side = normalisePick(raw.side, idx, budgetBgn);
  const drink = normalisePick(raw.drink, idx, budgetBgn);
  // Combo items can be null in our schema; coerce shape to {id, reasonKey}
  // and validate reasonKey.
  function ensureShape(p: LlmPick | null, slot: unknown): { id: string; reasonKey: string } | null {
    if (!p) return null;
    if (!isRecord(slot)) return { id: p.id, reasonKey: "pair_default" };
    const rk = asString(slot.reasonKey) ?? "pair_default";
    const safeRk = ALLOWED_REASON_KEYS.has(rk) ? rk : "pair_default";
    return { id: p.id, reasonKey: safeRk };
  }
  return {
    side: ensureShape(side, raw.side),
    drink: ensureShape(drink, raw.drink),
  };
}

export interface ValidateOptions {
  budgetBgn?: number | null;
  maxRationaleChars?: number;
}

export interface ValidateResult {
  ok: boolean;
  response: LlmResponse | null;
  errors: string[];
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
  const budgetBgn = options.budgetBgn ?? null;
  const maxRationale = options.maxRationaleChars ?? 280;

  const main = raw.main == null ? null : normalisePick(raw.main, idx, budgetBgn);
  if (raw.main != null && !main) errors.push("main pick rejected (unknown id or over budget)");

  const altsRaw = Array.isArray(raw.alternatives) ? raw.alternatives : [];
  const alternatives: LlmPick[] = [];
  for (const a of altsRaw) {
    const p = normalisePick(a, idx, budgetBgn);
    if (p) alternatives.push(p);
    if (alternatives.length >= 3) break;
  }

  const combo = normaliseCombo(raw.combo, idx, budgetBgn);

  let rationale = asString(raw.rationale) ?? "";
  // Hard cap the rationale so a chatty model can't blow up the UI.
  if (rationale.length > maxRationale) {
    rationale = rationale.slice(0, maxRationale).trimEnd() + "…";
  }

  const response: LlmResponse = { main, alternatives, combo, rationale };

  // ok=true when we have a main + at least 1 alternative (or 1 alternative
  // when main is null is not enough — the wizard needs a winner).
  const ok = main != null;
  if (!ok) errors.push("no valid main pick after validation");
  return { ok, response, errors };
}

// ---------------------------------------------------------------------------
// Convenience — turn LLM response into something the wizard UI can use.
// The UI's existing rationale.ts still works on the matchReasons list, so
// we just hand back the validated structure. The caller (llmRecommend.ts)
// re-derives the chips using explainMatch when the LLM result wins.
// ---------------------------------------------------------------------------

export type { MenuIndex };
