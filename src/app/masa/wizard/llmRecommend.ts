// Client-side wrapper for the wizard LLM proxy.
//
// Goal: keep the MasaTasteWizard component code clean and completely
// unaware of the server's LLM response shape. The component just calls
// `recommend(...)` and gets back the same WizardPickFromLlm shape it always
// has — main/alternatives/combo/rationaleText. On null, it falls back to
// the local scoring engine, exactly as before.
//
// The server now returns a richer, budget-aware shape (primaryItemId /
// drinkItemId / sideItemId / budgetStatus / customerMessage / reasonKeys —
// see recommendSchema.ts). This module is where that shape is translated
// back into the UI's existing types, so MasaTasteWizard.tsx needs no
// changes at all.
//
// We never throw, never toast, never block the UI. The 5s client timeout
// matches the server timeout. If the LLM is slow, the spinner keeps
// spinning (the UI's existing 1.2s timer wins) and the local fallback
// kicks in when the server returns its 200-empty.

import type { Locale, QrMenuCategory, QrMenuItem } from "../masaTypes";
import type { ScoredItem, WizardAnswers } from "./types";
import { getItemTags } from "./menuTags";
import type { BudgetStatus } from "./types";
import type { LlmResponse, ReasonKey } from "./recommendSchema";

export interface RecommendInput {
  mode: "buttons" | "freetext";
  answers: WizardAnswers;
  freetext?: string;
  budgetBgn?: number | null;
  locale: Locale;
  sessionToken: string;
  /** AbortController for in-flight cancellation (e.g. user closes modal) */
  signal?: AbortSignal;
  /** Override the default 5s client timeout (ms) */
  timeoutMs?: number;
}

export interface WizardPickFromLlm {
  source: "groq" | "local";
  main: ScoredItem;
  alternatives: ScoredItem[];
  combo: {
    side: { item: QrMenuItem & { categoryId: string }; reasonKey: string } | null;
    drink: { item: QrMenuItem & { categoryId: string }; reasonKey: string } | null;
  };
  rationaleText: string;
  /** Extra budget-aware metadata from the server; optional, UI may ignore it. */
  budgetStatus?: BudgetStatus;
  totalEstimatedPrice?: number | null;
  confidence?: number;
}

const DEFAULT_TIMEOUT_MS = 5000;

// reasonKeys (new server vocabulary) -> existing pair_* translation keys
// used by the combo UI (`t(locale, result.combo.side.reasonKey)`). This
// keeps every combo label backed by a real, already-translated string in
// masaTranslations.ts without adding new i18n keys.
const REASON_KEY_TO_PAIR_KEY: Record<ReasonKey, string> = {
  beer_pairing: "pair_drink_match",
  filling: "pair_side_default",
  budget_fit: "pair_side_default",
  light: "pair_light",
  sweet: "pair_dessert",
  grilled: "pair_fries",
  classic: "pair_bread",
  adventurous: "pair_snack",
  family_safe: "pair_side_default",
  good_value: "pair_side_default",
  fresh: "pair_fresh_side",
  spicy: "pair_snack",
};

function comboReasonKey(reasonKeys: ReasonKey[]): string {
  for (const k of reasonKeys) {
    const mapped = REASON_KEY_TO_PAIR_KEY[k];
    if (mapped) return mapped;
  }
  return "pair_default";
}

// Helper — find the real QrMenuItem (with categoryId) for a given id.
function findItem(
  id: string,
  categories: QrMenuCategory[],
): (QrMenuItem & { categoryId: string }) | null {
  for (const cat of categories) {
    for (const item of cat.items) {
      if (item.id === id) return { ...item, categoryId: cat.id };
    }
  }
  return null;
}

function toScoredItem(item: QrMenuItem & { categoryId: string }): ScoredItem {
  return {
    item,
    score: 100,
    rationaleKey: "r_signature",
    matchReasons: [],
  };
}

/**
 * Calls the wizard LLM proxy. Returns null on any failure — the caller
 * falls back to local scoring. Never throws.
 */
export async function recommend(
  input: RecommendInput,
  categories: QrMenuCategory[],
): Promise<WizardPickFromLlm | null> {
  if (!input.sessionToken) return null;
  const ctrl = new AbortController();
  const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  // If the caller passed their own signal, forward its abort.
  if (input.signal) {
    if (input.signal.aborted) ctrl.abort();
    input.signal.addEventListener("abort", () => ctrl.abort(), { once: true });
  }

  try {
    const res = await fetch("/api/wizard/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: input.mode,
        answers: input.answers,
        freetext: input.freetext ?? "",
        budgetBgn: input.budgetBgn ?? null,
        locale: input.locale,
        sessionToken: input.sessionToken,
      }),
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      ok: boolean;
      source: "groq" | "empty";
      response: LlmResponse | null;
    };
    if (!data.ok || !data.response) return null;
    const r = data.response;

    // The server's budgetRepair step guarantees at least a primary or a
    // drink when ok=true. If neither hydrates to a real menu item, bail —
    // the caller falls back to local scoring.
    const mainId = r.primaryItemId ?? r.drinkItemId;
    if (!mainId) return null;
    const mainItem = findItem(mainId, categories);
    if (!mainItem) return null;

    const altItems: ScoredItem[] = [];
    for (const id of r.alternativeItemIds) {
      const it = findItem(id, categories);
      if (it) altItems.push(toScoredItem(it));
    }

    // When primaryItemId won (food-anchored combo), drinkItemId is the
    // paired drink; when drinkItemId became the main (drink_only mode),
    // sideItemId is the paired snack and there's no separate "drink" slot.
    const drinkIsMain = !r.primaryItemId && !!r.drinkItemId;
    const reasonKey = comboReasonKey(r.reasonKeys);

    const sideItem = r.sideItemId ? findItem(r.sideItemId, categories) : null;
    const pairedDrinkItem = !drinkIsMain && r.drinkItemId ? findItem(r.drinkItemId, categories) : null;

    return {
      source: "groq",
      main: toScoredItem(mainItem),
      alternatives: altItems,
      combo: {
        side: sideItem ? { item: sideItem, reasonKey } : null,
        drink: pairedDrinkItem ? { item: pairedDrinkItem, reasonKey } : null,
      },
      rationaleText: r.customerMessage,
      budgetStatus: r.budgetStatus,
      totalEstimatedPrice: r.totalEstimatedPrice,
      confidence: r.confidence,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Re-export for callers that want to assert tags presence.
export { getItemTags };
