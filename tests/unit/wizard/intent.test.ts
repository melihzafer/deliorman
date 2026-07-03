import { parseWithLexicon } from "../../../src/app/masa/wizard/intentLexicon";
import { inferIntent } from "../../../src/app/masa/wizard/intentRouter";

describe("lexicon NLU", () => {
  it("detects mood in English", () => {
    const r = parseWithLexicon("I want something spicy and smoky");
    expect(r.answers.mood).toBe("adventurous");
    expect(r.signals.length).toBeGreaterThan(0);
  });

  it("detects protein in Bulgarian", () => {
    const r = parseWithLexicon("искам пилешко със зеленчуци");
    expect(r.answers.foodProtein).toBe("poultry");
  });

  it("detects alcohol in Turkish", () => {
    const r = parseWithLexicon("bir bira istiyorum");
    expect(r.answers.alcohol).toBe("alcoholic");
  });

  it("detects drink temp in English", () => {
    const r = parseWithLexicon("a hot coffee please");
    expect(r.answers.drinkTemp).toBe("hot");
    expect(r.answers.drinkProfile).toBe("caffeine");
  });

  it("detects vegetarian", () => {
    const r = parseWithLexicon("I'm vegetarian");
    expect(r.answers.foodProtein).toBe("vegetarian");
  });

  it("returns empty for gibberish", () => {
    const r = parseWithLexicon("asdf qwerty zzzz");
    expect(Object.keys(r.answers).length).toBe(0);
  });

  it("combines multiple signals in one input", () => {
    const r = parseWithLexicon("I want a grilled chicken with a cold beer");
    expect(r.answers.foodTexture).toBe("grilled");
    expect(r.answers.foodProtein).toBe("poultry");
    expect(r.answers.drinkTemp).toBe("cold");
    expect(r.answers.alcohol).toBe("alcoholic");
    expect(r.coverage).toBeGreaterThan(0.3);
  });
});

describe("intent router", () => {
  it("returns buttons-only for empty input", async () => {
    const r = await inferIntent({ text: "" });
    expect(r.source).toBe("buttons-only");
  });

  it("returns lexicon result for matching input", async () => {
    const r = await inferIntent({ text: "spicy grilled chicken" });
    expect(r.source).toBe("lexicon");
    expect(r.answers.foodProtein).toBe("poultry");
  });

  it("does not crash on non-Latin", async () => {
    const r = await inferIntent({ text: "🎉🎂💖" });
    expect(r).toBeDefined();
  });
});
