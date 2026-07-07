import { repairBudget } from "../../../src/app/masa/wizard/budgetRepair";
import type { CandidateItem } from "../../../src/app/masa/wizard/candidates";

function candidate(over: Partial<CandidateItem> = {}): CandidateItem {
  return {
    id: "item",
    name: { bg: "", tr: "", en: "" },
    categoryId: "grill",
    price: 5,
    currency: "BGN",
    course: "main",
    portion: "meal",
    tags: { protein: [], flavor: [], texture: [], vibe: [] },
    valueScore: 0.5,
    isAlcoholic: false,
    ...over,
  };
}

const CANDIDATES: CandidateItem[] = [
  candidate({ id: "kebabche", price: 1.95, course: "main", valueScore: 0.85 }),
  candidate({ id: "mixed-grill", price: 34.22, course: "main", valueScore: 0.6 }),
  candidate({ id: "shopska", price: 7.82, course: "starter", valueScore: 0.4 }),
  candidate({ id: "carlsberg", price: 3.91, course: "drink", valueScore: 0.5, isAlcoholic: true }),
  candidate({ id: "carlsberg-0-0", price: 4.3, course: "drink", valueScore: 0.45, isAlcoholic: false }),
];

describe("repairBudget", () => {
  it("keeps the combo as-is when it fits the budget", () => {
    const r = repairBudget({
      primaryItemId: "kebabche",
      drinkItemId: "carlsberg-0-0",
      sideItemId: "shopska",
      candidates: CANDIDATES,
      budgetBgn: 20,
      customerMode: "hungry_normal",
    });
    expect(r.primaryItemId).toBe("kebabche");
    expect(r.drinkItemId).toBe("carlsberg-0-0");
    expect(r.sideItemId).toBe("shopska");
    expect(r.budgetStatus).toBe("within_budget");
    expect(r.totalEstimatedPrice).toBeCloseTo(1.95 + 4.3 + 7.82, 2);
  });

  it("drops the side before the drink when over budget", () => {
    const r = repairBudget({
      primaryItemId: "kebabche",
      drinkItemId: "carlsberg-0-0",
      sideItemId: "shopska",
      candidates: CANDIDATES,
      budgetBgn: 8, // 1.95 + 4.3 + 7.82 = 14.07, over; drop side -> 6.25, fits
      customerMode: "hungry_normal",
    });
    expect(r.primaryItemId).toBe("kebabche");
    expect(r.sideItemId).toBeNull();
    expect(r.drinkItemId).toBe("carlsberg-0-0");
    expect(r.budgetStatus).toBe("food_only_within_budget");
  });

  it("drops an alcoholic drink before falling back to a cheaper primary", () => {
    const r = repairBudget({
      primaryItemId: "kebabche",
      drinkItemId: "carlsberg", // alcoholic
      sideItemId: null,
      candidates: CANDIDATES,
      budgetBgn: 2, // 1.95 + 3.91 = 5.86, over; drop drink -> 1.95, fits
      customerMode: "beer_with_food",
    });
    expect(r.primaryItemId).toBe("kebabche");
    expect(r.drinkItemId).toBeNull();
    expect(r.budgetStatus).toBe("food_only_within_budget");
  });

  it("never exceeds the budget: replaces an over-budget primary with the best affordable candidate", () => {
    const r = repairBudget({
      primaryItemId: "mixed-grill", // 34.22 BGN
      drinkItemId: null,
      sideItemId: null,
      candidates: CANDIDATES,
      budgetBgn: 5,
      customerMode: "very_hungry_low_budget",
    });
    expect(r.primaryItemId).toBe("kebabche"); // cheapest/highest-value affordable main
    expect(r.totalEstimatedPrice).toBeLessThanOrEqual(5);
    expect(r.budgetStatus).toBe("food_only_within_budget");
  });

  it("returns over_budget_no_safe_combo when nothing affordable exists", () => {
    const tinyBudget = candidate({ id: "only-item", price: 100, course: "main" });
    const r = repairBudget({
      primaryItemId: "only-item",
      drinkItemId: null,
      sideItemId: null,
      candidates: [tinyBudget],
      budgetBgn: 5,
      customerMode: "hungry_normal",
    });
    expect(r.primaryItemId).toBeNull();
    expect(r.drinkItemId).toBeNull();
    expect(r.budgetStatus).toBe("over_budget_no_safe_combo");
    expect(r.totalEstimatedPrice).toBeNull();
  });

  it("fills a missing primary from the local shortlist (never surfaces null when a valid candidate exists)", () => {
    const r = repairBudget({
      primaryItemId: null,
      drinkItemId: null,
      sideItemId: null,
      candidates: CANDIDATES,
      budgetBgn: null,
      customerMode: "hungry_normal",
    });
    expect(r.primaryItemId).not.toBeNull();
    expect(r.budgetStatus).not.toBe("over_budget_no_safe_combo");
  });

  it("drink_only mode never forces a primary food item", () => {
    const r = repairBudget({
      primaryItemId: null,
      drinkItemId: "carlsberg-0-0",
      sideItemId: null,
      candidates: CANDIDATES,
      budgetBgn: null,
      customerMode: "drink_only",
    });
    expect(r.primaryItemId).toBeNull();
    expect(r.drinkItemId).toBe("carlsberg-0-0");
    expect(r.budgetStatus).toBe("drink_only_within_budget");
  });

  it("drink_only mode tries a cheaper drink instead of forcing food when over budget", () => {
    const r = repairBudget({
      primaryItemId: null,
      drinkItemId: "carlsberg-0-0", // 4.3 BGN — over a 4.0 budget
      sideItemId: null,
      candidates: CANDIDATES,
      budgetBgn: 4.0, // carlsberg-0-0 doesn't fit; carlsberg (3.91) does
      customerMode: "drink_only",
    });
    expect(r.drinkItemId).toBe("carlsberg");
    expect(r.primaryItemId).toBeNull();
    expect(r.budgetStatus).toBe("drink_only_within_budget");
  });

  it("ignores a hallucinated id that isn't in the candidate list", () => {
    const r = repairBudget({
      primaryItemId: "totally-fake-id",
      drinkItemId: null,
      sideItemId: null,
      candidates: CANDIDATES,
      budgetBgn: null,
      customerMode: "hungry_normal",
    });
    // Falls back to the best real candidate instead of trusting the fake id.
    expect(r.primaryItemId).not.toBe("totally-fake-id");
    expect(r.primaryItemId).not.toBeNull();
  });
});
