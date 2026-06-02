// Client-side wrapper for the wizard LLM proxy.
//
// Goal: keep the MasaTasteWizard component code clean. The component just
// calls `recommend(...)` and gets back a validated WizardPick or null. On
// null, it falls back to the local scoring engine — exactly the same UX
// the user would have seen before this feature shipped.
//
// We never throw, never toast, never block the UI. The 5s client timeout
// matches the server timeout. If the LLM is slow, the spinner keeps
// spinning (the UI's existing 1.2s timer wins) and the local fallback
// kicks in when the server returns its 200-empty.
//
// This is also the place where the LLM's matchReasons are merged with the
// local scoring metadata so the UI can keep using its existing rationale
// chip renderer. The server-validated pick is authoritative; the local
// metadata is purely cosmetic.

import type { Locale, QrMenuCategory, QrMenuItem } from "../masaTypes";
import type { ScoredItem, WizardAnswers } from "./types";
import { getItemTags } from "./menuTags";
import type { LlmResponse } from "./recommendSchema";

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
}

const DEFAULT_TIMEOUT_MS = 5000;

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

// Build a ScoredItem from a server-validated pick. We synthesise a
// rationaleKey from the LLM's matchReasons (the UI's explainMatch will
// translate the matchReasons into chips). score is hard-coded to 100
// because the LLM picks are pre-validated; the UI uses matchReasons
// instead of score to display rationale. The `item` field is overwritten
// by `reattach()` after we look up the real QrMenuItem.
function pickToScored(pick: { id: string; matchReasons: string[] }): ScoredItem {
  return {
    item: null as never, // overwritten by the caller via re-attach
    score: 100,
    rationaleKey: "r_signature",
    matchReasons: pick.matchReasons,
  };
}

function reattach<T extends { item: QrMenuItem & { categoryId: string } | null }>(
  scored: T,
  item: QrMenuItem & { categoryId: string },
): T {
  return { ...scored, item };
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
    if (!data.ok || !data.response || !data.response.main) return null;

    // Hydrate ids → real QrMenuItem rows. Drop anything we can't find.
    const mainItem = findItem(data.response.main.id, categories);
    if (!mainItem) return null;
    const altItems: ScoredItem[] = [];
    for (const alt of data.response.alternatives) {
      const it = findItem(alt.id, categories);
      if (!it) continue;
      altItems.push(reattach(pickToScored(alt), it));
    }

    const side = data.response.combo.side
      ? (() => {
          const it = findItem(data.response.combo.side!.id, categories);
          return it ? { item: it, reasonKey: data.response.combo.side!.reasonKey } : null;
        })()
      : null;
    const drink = data.response.combo.drink
      ? (() => {
          const it = findItem(data.response.combo.drink!.id, categories);
          return it ? { item: it, reasonKey: data.response.combo.drink!.reasonKey } : null;
        })()
      : null;

    return {
      source: "groq",
      main: reattach(pickToScored(data.response.main), mainItem),
      alternatives: altItems,
      combo: { side, drink },
      rationaleText: data.response.rationale,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Re-export for callers that want to assert tags presence.
export { getItemTags };
