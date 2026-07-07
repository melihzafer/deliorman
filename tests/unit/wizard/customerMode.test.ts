import { classifyCustomerMode } from "../../../src/app/masa/wizard/customerMode";

describe("classifyCustomerMode", () => {
  it("classifies a very hungry diner with a low budget", () => {
    const mode = classifyCustomerMode({
      answers: { anchor: "food" },
      freetext: "Cebimde 10 euro var, çok açım ve canım bira istiyor.",
      budgetEur: 10,
    });
    expect(mode).toBe("very_hungry_low_budget");
  });

  it("classifies beer + food when hunger isn't extreme and budget is roomy", () => {
    const mode = classifyCustomerMode({
      answers: { anchor: "food", alcohol: "alcoholic" },
      freetext: "I want beer but I also need something cheap to eat",
      budgetEur: null,
    });
    expect(mode).toBe("beer_with_food");
  });

  it("classifies a pure drink request with no food signal as drink_only", () => {
    const mode = classifyCustomerMode({ answers: {}, freetext: "само бира", budgetEur: null });
    expect(mode).toBe("drink_only");
  });

  it("classifies sweet-only free text", () => {
    const mode = classifyCustomerMode({
      answers: { foodProtein: "sweet-only" },
      freetext: "sadece tatlı bir şey istiyorum",
      budgetEur: null,
    });
    expect(mode).toBe("sweet_only");
  });

  it("classifies a family/kids mention as family_safe even if alcohol keywords are present", () => {
    const mode = classifyCustomerMode({
      answers: {},
      freetext: "çocuklarla geldik, alkol olmasın",
      budgetEur: null,
    });
    expect(mode).toBe("family_safe");
  });

  it("classifies an adventurous/spicy request", () => {
    const mode = classifyCustomerMode({ answers: {}, freetext: "acı ve farklı bir şey öner", budgetEur: null });
    expect(mode).toBe("adventurous");
  });

  it("classifies a light/fresh request", () => {
    const mode = classifyCustomerMode({
      answers: {},
      freetext: "hafif bir şey istiyorum midem ağır",
      budgetEur: null,
    });
    expect(mode).toBe("light_fresh");
  });

  it("classifies a cheap-but-filling request as budget_value when hunger isn't extreme", () => {
    const mode = classifyCustomerMode({
      answers: { anchor: "food" },
      freetext: "çok param yok ama doyurucu olsun",
      budgetEur: null,
    });
    expect(mode).toBe("budget_value");
  });

  it("falls back to undecided with no signals", () => {
    const mode = classifyCustomerMode({ answers: {}, freetext: "", budgetEur: null });
    expect(mode).toBe("undecided");
  });

  it("never classifies very_hungry_low_budget without a budget", () => {
    const mode = classifyCustomerMode({ answers: { hunger: "feast" }, freetext: "çok açım", budgetEur: null });
    expect(mode).not.toBe("very_hungry_low_budget");
  });

  it("classifies Bulgarian 'very hungry' with an explicit EUR budget", () => {
    const mode = classifyCustomerMode({
      answers: {},
      freetext: "имам 15 евро и съм много гладен",
      budgetEur: 15,
    });
    expect(mode).toBe("very_hungry_low_budget");
  });
});
