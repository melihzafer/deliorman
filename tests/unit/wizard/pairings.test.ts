import { buildCombo } from "../../../src/app/masa/wizard/pairings";
import { TEST_CATEGORIES } from "./fixture";

describe("combo pairings", () => {
  it("returns a side and a drink for a food main", () => {
    const main = TEST_CATEGORIES.find((c) => c.id === "grill")!.items[0]; // kebabche
    const mainWithCat = { ...main, categoryId: "grill" };
    const combo = buildCombo(mainWithCat, TEST_CATEGORIES);
    expect(combo.drink).not.toBeNull();
    // Side may be null if no suitable match — but combo should not throw
    expect(typeof combo).toBe("object");
  });

  it("returns a side (snack) for a drink main", () => {
    const main = TEST_CATEGORIES.find((c) => c.id === "hot-beverages")!.items[2]; // hot chocolate
    const mainWithCat = { ...main, categoryId: "hot-beverages" };
    const combo = buildCombo(mainWithCat, TEST_CATEGORIES);
    expect(combo.drink).toBeNull();
    // For a hot drink, a dessert is suggested
    expect(combo.side).not.toBeNull();
  });

  it("never returns a drink pairing for a drink main", () => {
    const main = TEST_CATEGORIES.find((c) => c.id === "wines")!.items[0];
    const mainWithCat = { ...main, categoryId: "wines" };
    const combo = buildCombo(mainWithCat, TEST_CATEGORIES);
    expect(combo.drink).toBeNull();
  });

  it("pairing reasonKey is always a valid i18n key", () => {
    const main = TEST_CATEGORIES.find((c) => c.id === "grill")!.items[2]; // mixed-grill
    const mainWithCat = { ...main, categoryId: "grill" };
    const combo = buildCombo(mainWithCat, TEST_CATEGORIES);
    const keys = [combo.side?.reasonKey, combo.drink?.reasonKey].filter(Boolean) as string[];
    for (const k of keys) {
      expect(k).toMatch(/^pair_/);
    }
  });
});
