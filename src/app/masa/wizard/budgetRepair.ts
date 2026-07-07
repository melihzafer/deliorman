// Deterministic budget repair — runs AFTER the LLM response is schema-
// validated. This is the code-owned final word on price: the LLM's picks
// are a suggestion, this function decides what the diner actually sees.
//
// Priority order (very hungry / normal food modes):
//   1. keep primary
//   2. drop side
//   3. drop alcoholic drink
//   4. replace primary with the best cheaper candidate
//   5. food-only, or no safe combo at all
//
// drink_only mode never invents a main course — it only tries a cheaper
// drink, then gives up.

import type { CandidateItem } from "./candidates";
import type { BudgetStatus, CustomerMode } from "./types";

export interface RepairInput {
  primaryItemId: string | null;
  drinkItemId: string | null;
  sideItemId: string | null;
  candidates: CandidateItem[];
  budgetEur: number | null;
  customerMode: CustomerMode;
}

export interface RepairResult {
  primaryItemId: string | null;
  drinkItemId: string | null;
  sideItemId: string | null;
  totalEstimatedPrice: number | null;
  budgetStatus: BudgetStatus;
}

function bestCandidate(
  candidates: CandidateItem[],
  predicate: (c: CandidateItem) => boolean,
): CandidateItem | null {
  let best: CandidateItem | null = null;
  for (const c of candidates) {
    if (!predicate(c)) continue;
    if (!best || c.valueScore > best.valueScore) best = c;
  }
  return best;
}

export function repairBudget(input: RepairInput): RepairResult {
  const { candidates, budgetEur, customerMode } = input;
  const byId = new Map(candidates.map((c) => [c.id, c]));
  const neverForcePrimary = customerMode === "drink_only";

  let primaryId = input.primaryItemId && byId.has(input.primaryItemId) ? input.primaryItemId : null;
  let drinkId = input.drinkItemId && byId.has(input.drinkItemId) ? input.drinkItemId : null;
  let sideId = input.sideItemId && byId.has(input.sideItemId) ? input.sideItemId : null;

  // Fill a missing primary/drink from the local shortlist so a partial or
  // empty LLM pick never surfaces as "no result" when a valid candidate
  // exists. drink_only mode intentionally never forces a main course.
  if (!primaryId && !neverForcePrimary) {
    primaryId = bestCandidate(candidates, (c) => c.course !== "drink")?.id ?? null;
  }
  if (!drinkId && neverForcePrimary && !primaryId) {
    drinkId = bestCandidate(candidates, (c) => c.course === "drink")?.id ?? null;
  }

  const priceOf = (id: string | null): number => (id ? byId.get(id)?.price ?? 0 : 0);
  const total = () => priceOf(primaryId) + priceOf(drinkId) + priceOf(sideId);
  const statusFor = (): BudgetStatus => {
    if (!primaryId && !drinkId) return "over_budget_no_safe_combo";
    if (neverForcePrimary && !primaryId) return "drink_only_within_budget";
    if (primaryId && !drinkId && !sideId && !neverForcePrimary) {
      // Only call it "food only" when a drink/side was actually dropped.
      return input.drinkItemId || input.sideItemId ? "food_only_within_budget" : "within_budget";
    }
    return "within_budget";
  };

  if (budgetEur == null) {
    const t = total();
    return {
      primaryItemId: primaryId,
      drinkItemId: drinkId,
      sideItemId: sideId,
      totalEstimatedPrice: primaryId || drinkId ? t : null,
      budgetStatus: statusFor(),
    };
  }

  if (total() <= budgetEur) {
    return {
      primaryItemId: primaryId,
      drinkItemId: drinkId,
      sideItemId: sideId,
      totalEstimatedPrice: primaryId || drinkId ? total() : null,
      budgetStatus: statusFor(),
    };
  }

  // Over budget — drop in priority order: side first, then (for
  // food-anchored modes only) the drink itself, before falling back to a
  // cheaper replacement. drink_only mode never drops its own drink down to
  // nothing — it goes straight to "find a cheaper drink" instead, since
  // dropping the only thing the diner asked for isn't a repair.
  if (sideId) {
    sideId = null;
    if (total() <= budgetEur) {
      return {
        primaryItemId: primaryId,
        drinkItemId: drinkId,
        sideItemId: sideId,
        totalEstimatedPrice: total(),
        budgetStatus: neverForcePrimary ? "drink_only_within_budget" : "food_only_within_budget",
      };
    }
  }
  if (!neverForcePrimary && drinkId) {
    drinkId = null;
    if (total() <= budgetEur) {
      return { primaryItemId: primaryId, drinkItemId: drinkId, sideItemId: sideId, totalEstimatedPrice: total(), budgetStatus: "food_only_within_budget" };
    }
  }

  // Still over — the primary itself (or the lone drink) doesn't fit.
  // Replace it with the best affordable candidate of the same kind.
  if (!neverForcePrimary) {
    const cheaper = bestCandidate(
      candidates,
      (c) => c.course !== "drink" && c.price != null && c.price <= budgetEur,
    );
    if (cheaper) {
      return {
        primaryItemId: cheaper.id,
        drinkItemId: null,
        sideItemId: null,
        totalEstimatedPrice: cheaper.price,
        budgetStatus: "food_only_within_budget",
      };
    }
  } else {
    const cheaperDrink = bestCandidate(
      candidates,
      (c) => c.course === "drink" && c.price != null && c.price <= budgetEur,
    );
    if (cheaperDrink) {
      return {
        primaryItemId: null,
        drinkItemId: cheaperDrink.id,
        sideItemId: null,
        totalEstimatedPrice: cheaperDrink.price,
        budgetStatus: "drink_only_within_budget",
      };
    }
  }

  return {
    primaryItemId: null,
    drinkItemId: null,
    sideItemId: null,
    totalEstimatedPrice: null,
    budgetStatus: "over_budget_no_safe_combo",
  };
}
