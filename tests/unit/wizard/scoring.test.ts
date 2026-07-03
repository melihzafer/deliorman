import { scoreItems, pickRecommendation, getSurprisePick } from "../../../src/app/masa/wizard/scoring";
import { TEST_CATEGORIES } from "./fixture";

describe("scoring", () => {
  it("returns top of pool with confidence when no answers", () => {
    const scored = scoreItems(TEST_CATEGORIES, {}, "bg");
    expect(scored.length).toBeGreaterThan(0);
    expect(scored[0].score).toBeGreaterThanOrEqual(scored[1]?.score ?? -Infinity);
  });

  it("hard-filters by anchor: drink", () => {
    const scored = scoreItems(TEST_CATEGORIES, { anchor: "drink" }, "bg");
    const ids = scored.map((s) => s.item.categoryId);
    // Every returned item must be a drink category
    for (const id of ids) {
      expect(["hot-beverages", "beer-cider-other-drinks", "rakia", "wines"]).toContain(id);
    }
  });

  it("hard-filters by anchor: food", () => {
    const scored = scoreItems(TEST_CATEGORIES, { anchor: "food" }, "bg");
    const ids = scored.map((s) => s.item.categoryId);
    for (const id of ids) {
      expect(["grill", "pizzas", "salads", "nuts-desserts"]).toContain(id);
    }
  });

  it("mood=adventurous ranks spicy/grilled items higher", () => {
    const spicy = scoreItems(TEST_CATEGORIES, { mood: "adventurous" }, "bg");
    const top = spicy[0]?.item;
    // We tagged kebabche as spicy+smoky+adventurous, so it should top
    expect(top?.id).toBe("kebabche");
  });

  it("protein=vegetarian filters out meat items", () => {
    const scored = scoreItems(TEST_CATEGORIES, { foodProtein: "vegetarian", anchor: "food" }, "bg");
    for (const s of scored) {
      const tags = require("../../../src/app/masa/wizard/menuTags").getItemTags(s.item.id);
      expect(["meat", "poultry", "fish", "seafood"]).not.toContain(tags.protein);
    }
  });

  it("pickRecommendation returns main + alternatives + confidence", () => {
    const pick = pickRecommendation(TEST_CATEGORIES, { mood: "comfort", anchor: "food" }, "bg");
    expect(pick).not.toBeNull();
    expect(pick!.main).toBeDefined();
    expect(Array.isArray(pick!.alternatives)).toBe(true);
    expect(["high", "medium", "low"]).toContain(pick!.confidence);
  });

  it("getSurprisePick returns a valid item", () => {
    const surprise = getSurprisePick(TEST_CATEGORIES);
    expect(surprise).not.toBeNull();
    expect(surprise!.item.id).toBeTruthy();
  });

  it("hunger=feast prefers portion=feast items", () => {
    const scored = scoreItems(TEST_CATEGORIES, { anchor: "food", hunger: "feast" }, "bg");
    // mixed-grill is portion=feast
    expect(scored[0]?.item.id).toBe("mixed-grill");
  });

  it("boosts items by title keyword match", () => {
    const scoredEn = scoreItems(TEST_CATEGORIES, {}, "en", "chocolate");
    expect(scoredEn[0]?.item.id).toBe("hot-chocolate");

    const scoredBg = scoreItems(TEST_CATEGORIES, {}, "bg", "шоколад");
    expect(scoredBg[0]?.item.id).toBe("hot-chocolate");
  });

  it("boosts items by category title match", () => {
    const scored = scoreItems(TEST_CATEGORIES, {}, "en", "salads");
    const ids = scored.map((s) => s.item.id);
    expect(ids).toContain("shopska");
    expect(ids).toContain("caesar");
  });
});
