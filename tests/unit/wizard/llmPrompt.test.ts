import { buildPrompt } from "../../../src/app/masa/wizard/llmPrompt";
import type { CandidateItem } from "../../../src/app/masa/wizard/candidates";

function candidate(over: Partial<CandidateItem> = {}): CandidateItem {
  return {
    id: "kebabche",
    name: { bg: "Кебапче", tr: "Kebapçe", en: "Kebapche" },
    categoryId: "grill",
    price: 1.95,
    currency: "BGN",
    course: "main",
    portion: "snack",
    tags: { protein: ["meat"], flavor: ["savory", "smoky"], texture: ["grilled"], vibe: ["traditional-bg"] },
    valueScore: 0.7,
    isAlcoholic: false,
    ...over,
  };
}

const CANDIDATES: CandidateItem[] = [
  candidate(),
  candidate({ id: "carlsberg", name: { bg: "Carlsberg", tr: "Carlsberg", en: "Carlsberg" }, categoryId: "beer-cider-other-drinks", price: 3.91, course: "drink", portion: "snack", tags: { protein: ["grain"], flavor: ["bitter"], texture: [], vibe: ["comfort"] }, isAlcoholic: true }),
];

describe("buildPrompt", () => {
  it("produces a system prompt that names the locale", () => {
    const p = buildPrompt({ locale: "bg", mode: "buttons", answers: {}, customerMode: "undecided", candidates: CANDIDATES });
    expect(p.system).toContain("Bulgarian");
    expect(p.system).toContain("(bg)");
  });

  it("system prompt for tr names Turkish as the reply language", () => {
    const p = buildPrompt({ locale: "tr", mode: "buttons", answers: {}, customerMode: "undecided", candidates: CANDIDATES });
    expect(p.system).toContain("Reply in Turkish (tr)");
    // Tone rules and few-shot examples intentionally cover all 3 locales
    // regardless of the reply language — that's part of the spec, not a bug.
  });

  it("produces a user payload with the candidate shortlist, not the full menu", () => {
    const p = buildPrompt({ locale: "en", mode: "buttons", answers: {}, customerMode: "undecided", candidates: CANDIDATES });
    const parsed = JSON.parse(p.user);
    expect(Array.isArray(parsed.candidates)).toBe(true);
    expect(parsed.candidates.length).toBe(CANDIDATES.length);
    expect(parsed.candidates[0]).toHaveProperty("id");
    expect(parsed.candidates[0]).toHaveProperty("price");
    expect(parsed.candidates[0]).toHaveProperty("valueScore");
  });

  it("includes customer_mode in the user payload", () => {
    const p = buildPrompt({ locale: "en", mode: "buttons", answers: {}, customerMode: "very_hungry_low_budget", candidates: CANDIDATES });
    const parsed = JSON.parse(p.user);
    expect(parsed.customer_mode).toBe("very_hungry_low_budget");
  });

  it("passes answers through to the user payload", () => {
    const p = buildPrompt({
      locale: "en",
      mode: "buttons",
      answers: { mood: "adventurous", foodProtein: "meat", hunger: "meal" },
      customerMode: "undecided",
      candidates: CANDIDATES,
    });
    const parsed = JSON.parse(p.user);
    expect(parsed.answers).toEqual({ mood: "adventurous", foodProtein: "meat", hunger: "meal" });
  });

  it("passes free-text only when mode is freetext", () => {
    const p1 = buildPrompt({
      locale: "en",
      mode: "freetext",
      answers: {},
      freetext: "I have 10 euros and I'm hungry",
      customerMode: "very_hungry_low_budget",
      candidates: CANDIDATES,
    });
    const parsed1 = JSON.parse(p1.user);
    expect(parsed1.freetext).toBe("I have 10 euros and I'm hungry");
    expect(parsed1.mode).toBe("freetext");

    const p2 = buildPrompt({
      locale: "en",
      mode: "buttons",
      answers: {},
      freetext: "should-be-ignored",
      customerMode: "undecided",
      candidates: CANDIDATES,
    });
    const parsed2 = JSON.parse(p2.user);
    expect(parsed2.freetext).toBeNull();
  });

  it("passes budget_bgn only when provided", () => {
    const p1 = buildPrompt({ locale: "en", mode: "buttons", answers: {}, customerMode: "undecided", candidates: CANDIDATES });
    expect(JSON.parse(p1.user).budget_bgn).toBeNull();

    const p2 = buildPrompt({ locale: "en", mode: "buttons", answers: {}, budgetBgn: 15, customerMode: "undecided", candidates: CANDIDATES });
    expect(JSON.parse(p2.user).budget_bgn).toBe(15);
  });

  it("includes the schema and valid_reason_keys matching the required JSON shape", () => {
    const p = buildPrompt({ locale: "en", mode: "buttons", answers: {}, customerMode: "undecided", candidates: CANDIDATES });
    const parsed = JSON.parse(p.user);
    expect(parsed.schema.primaryItemId).toBeDefined();
    expect(parsed.schema.drinkItemId).toBeDefined();
    expect(parsed.schema.sideItemId).toBeDefined();
    expect(parsed.schema.alternativeItemIds).toBeDefined();
    expect(parsed.schema.budgetStatus).toBeDefined();
    expect(parsed.schema.customerMessage).toBeDefined();
    expect(parsed.valid_reason_keys).toContain("filling");
    expect(parsed.valid_reason_keys).toContain("beer_pairing");
    expect(parsed.valid_reason_keys).toContain("family_safe");
  });

  it("instructs the model to return JSON only with no markdown", () => {
    const p = buildPrompt({ locale: "en", mode: "buttons", answers: {}, customerMode: "undecided", candidates: CANDIDATES });
    expect(p.system).toContain("Return JSON only");
    expect(p.system).toContain("No markdown fences");
  });

  it("tells drink_only mode to never force a full meal", () => {
    const p = buildPrompt({ locale: "en", mode: "buttons", answers: {}, customerMode: "drink_only", candidates: CANDIDATES });
    expect(p.system).toContain("drink_only");
    expect(p.system.toLowerCase()).toContain("never force a full meal");
  });

  it("approximates input tokens reasonably for a small candidate list", () => {
    const p = buildPrompt({ locale: "en", mode: "buttons", answers: {}, customerMode: "undecided", candidates: CANDIDATES });
    expect(p.approxInputTokens).toBeGreaterThan(100);
    expect(p.approxInputTokens).toBeLessThan(5000);
    expect(p.candidateCount).toBe(CANDIDATES.length);
  });
});
