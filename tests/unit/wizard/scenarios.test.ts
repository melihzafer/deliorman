// End-to-end deterministic pipeline tests for the required multilingual
// test-case list from the Taste Wizard upgrade spec. Exercises the full
// chain a real request goes through — free text -> lexicon -> budget parse
// -> customerMode -> candidate shortlist -> budget repair — WITHOUT calling
// Groq (primary/drink/side start null, simulating "the LLM returned
// nothing/low-confidence", which forces the deterministic fallback-fill
// path in budgetRepair.ts). This is exactly the safety net a real Groq
// outage or a bad model response falls back to.

import { parseWithLexicon } from "../../../src/app/masa/wizard/intentLexicon";
import { budgetInBGN } from "../../../src/app/masa/wizard/budgetParse";
import { classifyCustomerMode } from "../../../src/app/masa/wizard/customerMode";
import { buildCandidateShortlist } from "../../../src/app/masa/wizard/candidates";
import { repairBudget } from "../../../src/app/masa/wizard/budgetRepair";
import { getItemTags } from "../../../src/app/masa/wizard/menuTags";
import { REAL_MENU_CATEGORIES } from "./realFixture";

const ALL_IDS = new Set(REAL_MENU_CATEGORIES.flatMap((c) => c.items.map((i) => i.id)));

function runPipeline(freetext: string, locale: "bg" | "tr" | "en" = "bg") {
  const lex = parseWithLexicon(freetext);
  const budgetBgn = budgetInBGN(freetext);
  const customerMode = classifyCustomerMode({ answers: lex.answers, freetext, budgetBgn });
  const candidates = buildCandidateShortlist({
    categories: REAL_MENU_CATEGORIES,
    answers: lex.answers,
    customerMode,
    budgetBgn,
    freetext,
    locale,
  });
  const repaired = repairBudget({
    primaryItemId: null,
    drinkItemId: null,
    sideItemId: null,
    candidates,
    budgetBgn,
    customerMode,
  });
  return { lex, budgetBgn, customerMode, candidates, repaired };
}

function idsAreReal(...ids: (string | null)[]) {
  for (const id of ids) {
    if (id) expect(ALL_IDS.has(id)).toBe(true);
  }
}

describe("required scenario: 10 euro var çok açım bira istiyorum", () => {
  it("never exceeds budget and prioritizes a filling food item", () => {
    const { customerMode, repaired, budgetBgn } = runPipeline("10 euro var çok açım bira istiyorum", "tr");
    expect(customerMode).toBe("very_hungry_low_budget");
    expect(budgetBgn).not.toBeNull();
    idsAreReal(repaired.primaryItemId, repaired.drinkItemId, repaired.sideItemId);
    expect(repaired.primaryItemId).not.toBeNull();
    if (repaired.totalEstimatedPrice != null) {
      expect(repaired.totalEstimatedPrice).toBeLessThanOrEqual(budgetBgn!);
    }
  });
});

describe("required scenario: Cebimde 10 euro var, çok açım ve canım bira istiyor", () => {
  it("never exceeds budget and prioritizes food over beer", () => {
    const { customerMode, repaired, budgetBgn, candidates } = runPipeline(
      "Cebimde 10 euro var, çok açım ve canım bira istiyor.",
      "tr",
    );
    expect(customerMode).toBe("very_hungry_low_budget");
    idsAreReal(repaired.primaryItemId, repaired.drinkItemId, repaired.sideItemId);
    expect(repaired.primaryItemId).not.toBeNull();
    const primaryTags = getItemTags(repaired.primaryItemId!);
    expect(primaryTags.course).not.toBe("dessert");
    expect(primaryTags.course).not.toBe("drink");
    if (repaired.totalEstimatedPrice != null) {
      expect(repaired.totalEstimatedPrice).toBeLessThanOrEqual(budgetBgn!);
    }
    expect(candidates.every((c) => ALL_IDS.has(c.id))).toBe(true);
  });
});

describe("required scenario: 30 leva imam, gladan sam, bira mi se pie", () => {
  it("extracts a 30 BGN budget and never exceeds it", () => {
    const { budgetBgn, repaired } = runPipeline("30 leva imam, gladan sam, bira mi se pie", "bg");
    expect(budgetBgn).toBe(30);
    if (repaired.totalEstimatedPrice != null) {
      expect(repaired.totalEstimatedPrice).toBeLessThanOrEqual(30);
    }
  });
});

describe("required scenario: имам 15 лв и съм много гладен", () => {
  it("classifies very_hungry_low_budget with a 15 BGN cap and stays within it", () => {
    const { customerMode, budgetBgn, repaired } = runPipeline("имам 15 лв и съм много гладен", "bg");
    expect(customerMode).toBe("very_hungry_low_budget");
    expect(budgetBgn).toBe(15);
    expect(repaired.primaryItemId).not.toBeNull();
    if (repaired.totalEstimatedPrice != null) {
      expect(repaired.totalEstimatedPrice).toBeLessThanOrEqual(15);
    }
  });
});

describe("required scenario: I have 10 euro, starving, want beer", () => {
  it("prioritizes filling food within the converted EUR budget", () => {
    const { customerMode, budgetBgn, repaired } = runPipeline("I have 10 euro, starving, want beer", "en");
    expect(customerMode).toBe("very_hungry_low_budget");
    expect(budgetBgn).toBeCloseTo(19.5583, 2);
    expect(repaired.primaryItemId).not.toBeNull();
    if (repaired.totalEstimatedPrice != null) {
      expect(repaired.totalEstimatedPrice).toBeLessThanOrEqual(budgetBgn!);
    }
  });
});

describe("required scenario: sadece tatlı bir şey istiyorum", () => {
  it("only recommends a dessert item, never grill/meat/beer", () => {
    const { customerMode, repaired, candidates } = runPipeline("sadece tatlı bir şey istiyorum", "tr");
    expect(customerMode).toBe("sweet_only");
    expect(candidates.every((c) => c.course === "dessert" || (c.course === "drink" && c.tags.flavor.includes("sweet")))).toBe(true);
    expect(repaired.primaryItemId).not.toBeNull();
    expect(getItemTags(repaired.primaryItemId!).course).toBe("dessert");
  });
});

describe("required scenario: vegan var mı", () => {
  it("never hallucinates an id even for an out-of-scope question", () => {
    const { candidates, repaired } = runPipeline("vegan var mı", "tr");
    idsAreReal(repaired.primaryItemId, repaired.drinkItemId, repaired.sideItemId);
    expect(candidates.every((c) => ALL_IDS.has(c.id))).toBe(true);
  });
});

describe("required scenario: çocuklarla geldik alkol olmasın", () => {
  it("never includes an alcoholic item anywhere in the result", () => {
    const { customerMode, candidates, repaired } = runPipeline("çocuklarla geldik alkol olmasın", "tr");
    expect(customerMode).toBe("family_safe");
    expect(candidates.every((c) => !c.isAlcoholic)).toBe(true);
    for (const id of [repaired.primaryItemId, repaired.drinkItemId, repaired.sideItemId]) {
      if (id) expect(getItemTags(id).state).not.toBe("alcoholic");
    }
  });
});

describe("required scenario: çok param yok ama doyurucu olsun", () => {
  it("recommends a filling food item without a hard budget cap", () => {
    const { repaired } = runPipeline("çok param yok ama doyurucu olsun", "tr");
    expect(repaired.primaryItemId).not.toBeNull();
    expect(getItemTags(repaired.primaryItemId!).course).not.toBe("drink");
  });
});

describe("required scenario: hafif bir şey istiyorum midem ağır", () => {
  it("classifies light_fresh", () => {
    const { customerMode } = runPipeline("hafif bir şey istiyorum midem ağır", "tr");
    expect(customerMode).toBe("light_fresh");
  });
});

describe("required scenario: acı ve farklı bir şey öner", () => {
  it("classifies adventurous", () => {
    const { customerMode } = runPipeline("acı ve farklı bir şey öner", "tr");
    expect(customerMode).toBe("adventurous");
  });
});

describe("required scenario: само бира", () => {
  it("never forces a main course, only recommends a drink", () => {
    const { customerMode, repaired } = runPipeline("само бира", "bg");
    expect(customerMode).toBe("drink_only");
    expect(repaired.primaryItemId).toBeNull();
    expect(repaired.drinkItemId).not.toBeNull();
  });
});

describe("required scenario: I want something cheap and filling", () => {
  it("recommends a real, filling, non-dessert item", () => {
    const { repaired } = runPipeline("I want something cheap and filling", "en");
    expect(repaired.primaryItemId).not.toBeNull();
    const tags = getItemTags(repaired.primaryItemId!);
    expect(tags.course).not.toBe("dessert");
    expect(tags.course).not.toBe("drink");
  });
});
