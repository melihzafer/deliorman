import { explainMatch } from "../../../src/app/masa/wizard/rationale";
import { scoreItems } from "../../../src/app/masa/wizard/scoring";
import { TEST_CATEGORIES } from "./fixture";
import type { ScoredItem } from "../../../src/app/masa/wizard/types";

describe("rationale generator", () => {
  it("produces a non-empty sentence in Bulgarian", () => {
    const scored = scoreItems(TEST_CATEGORIES, { mood: "adventurous", anchor: "food" }, "bg");
    const top = scored[0] as ScoredItem;
    const r = explainMatch(top, { mood: "adventurous", anchor: "food" }, "bg");
    expect(r.sentence.length).toBeGreaterThan(0);
    expect(r.reasons.length).toBeGreaterThan(0);
  });

  it("produces a non-empty sentence in English", () => {
    const scored = scoreItems(TEST_CATEGORIES, { mood: "comfort", anchor: "food" }, "en");
    const top = scored[0] as ScoredItem;
    const r = explainMatch(top, { mood: "comfort", anchor: "food" }, "en");
    expect(r.sentence.length).toBeGreaterThan(0);
  });

  it("produces a non-empty sentence in Turkish", () => {
    const scored = scoreItems(TEST_CATEGORIES, { mood: "indulgent", anchor: "drink" }, "tr");
    const top = scored[0] as ScoredItem;
    const r = explainMatch(top, { mood: "indulgent", anchor: "drink" }, "tr");
    expect(r.sentence.length).toBeGreaterThan(0);
  });

  it("reasons are all chip-style short strings", () => {
    const scored = scoreItems(TEST_CATEGORIES, { mood: "healthy", anchor: "food" }, "en");
    const top = scored[0] as ScoredItem;
    const r = explainMatch(top, { mood: "healthy", anchor: "food" }, "en");
    for (const c of r.reasons) {
      expect(c.length).toBeLessThan(20);
    }
  });
});
