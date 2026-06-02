import { buildPrompt, compactMenu } from "../../../src/app/masa/wizard/llmPrompt";
import { TEST_CATEGORIES } from "./fixture";

describe("compactMenu", () => {
  it("compacts to {id, name, price, categoryId, tags}", () => {
    const out = compactMenu(TEST_CATEGORIES, "en");
    expect(out.length).toBeGreaterThan(0);
    const sample = out[0];
    expect(sample).toHaveProperty("id");
    expect(sample).toHaveProperty("name");
    expect(sample).toHaveProperty("price");
    expect(sample).toHaveProperty("categoryId");
    expect(Array.isArray(sample.tags)).toBe(true);
  });

  it("uses the requested locale for the name", () => {
    const out = compactMenu(TEST_CATEGORIES, "bg");
    const kebabche = out.find((e) => e.id === "kebabche");
    expect(kebabche?.name).toBe("Кебапче");
  });

  it("skips items without a localised name", () => {
    const out = compactMenu(TEST_CATEGORIES, "tr");
    const allHaveNames = out.every((e) => e.name && e.name.length > 0);
    expect(allHaveNames).toBe(true);
  });

  it("never emits 'na' or 'none' tag values to save tokens", () => {
    const out = compactMenu(TEST_CATEGORIES, "en");
    for (const e of out) {
      for (const tag of e.tags) {
        expect(tag).not.toMatch(/:na$/);
        expect(tag).not.toMatch(/:none$/);
      }
    }
  });

  it("keeps at least one tag per item when tags are defined", () => {
    const out = compactMenu(TEST_CATEGORIES, "en");
    for (const e of out) {
      expect(e.tags.length).toBeGreaterThan(0);
    }
  });
});

describe("buildPrompt", () => {
  it("produces a system prompt that names the locale", () => {
    const p = buildPrompt({ locale: "bg", mode: "buttons", answers: {}, menu: TEST_CATEGORIES });
    expect(p.system).toContain("Bulgarian");
    expect(p.system).toContain("(bg)");
  });

  it("produces a user payload with the compacted menu", () => {
    const p = buildPrompt({ locale: "en", mode: "buttons", answers: {}, menu: TEST_CATEGORIES });
    const parsed = JSON.parse(p.user);
    expect(Array.isArray(parsed.menu)).toBe(true);
    expect(parsed.menu.length).toBe(compactMenu(TEST_CATEGORIES, "en").length);
  });

  it("passes answers through to the user payload", () => {
    const p = buildPrompt({
      locale: "en",
      mode: "buttons",
      answers: { mood: "adventurous", foodProtein: "meat", hunger: "meal" },
      menu: TEST_CATEGORIES,
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
      menu: TEST_CATEGORIES,
    });
    const parsed1 = JSON.parse(p1.user);
    expect(parsed1.freetext).toBe("I have 10 euros and I'm hungry");
    expect(parsed1.mode).toBe("freetext");

    const p2 = buildPrompt({
      locale: "en",
      mode: "buttons",
      answers: {},
      freetext: "should-be-ignored",
      menu: TEST_CATEGORIES,
    });
    const parsed2 = JSON.parse(p2.user);
    expect(parsed2.freetext).toBeNull();
    expect(parsed2.mode).toBe("buttons");
  });

  it("passes budget_bgn only when provided", () => {
    const p1 = buildPrompt({ locale: "en", mode: "buttons", answers: {}, menu: TEST_CATEGORIES });
    const parsed1 = JSON.parse(p1.user);
    expect(parsed1.budget_bgn).toBeNull();

    const p2 = buildPrompt({
      locale: "en",
      mode: "buttons",
      answers: {},
      budgetBgn: 15,
      menu: TEST_CATEGORIES,
    });
    const parsed2 = JSON.parse(p2.user);
    expect(parsed2.budget_bgn).toBe(15);
  });

  it("includes the schema and valid_reason_keys for unambiguous output", () => {
    const p = buildPrompt({ locale: "en", mode: "buttons", answers: {}, menu: TEST_CATEGORIES });
    const parsed = JSON.parse(p.user);
    expect(parsed.schema).toBeDefined();
    expect(parsed.schema.main).toBeDefined();
    expect(parsed.schema.alternatives).toBeDefined();
    expect(parsed.schema.combo).toBeDefined();
    expect(parsed.schema.rationale).toBeDefined();
    expect(Array.isArray(parsed.valid_reason_keys)).toBe(true);
    expect(parsed.valid_reason_keys).toContain("pair_fries");
    expect(parsed.valid_reason_keys).toContain("pair_drink_match");
  });

  it("instructs the model to output strictly valid JSON (no fences)", () => {
    const p = buildPrompt({ locale: "en", mode: "buttons", answers: {}, menu: TEST_CATEGORIES });
    expect(p.system.toLowerCase()).toContain("strictly valid json");
    expect(p.system.toLowerCase()).toContain("no markdown");
  });

  it("respects the budget rule in the system prompt", () => {
    const p = buildPrompt({ locale: "en", mode: "buttons", answers: {}, menu: TEST_CATEGORIES });
    expect(p.system).toContain("budget_bgn");
    expect(p.system).toContain("MUST be <= budget_bgn");
  });

  it("approximates input tokens reasonably for the test fixture", () => {
    const p = buildPrompt({ locale: "en", mode: "buttons", answers: {}, menu: TEST_CATEGORIES });
    // Just smoke-test that the estimate is positive and bounded
    expect(p.approxInputTokens).toBeGreaterThan(100);
    expect(p.approxInputTokens).toBeLessThan(20000);
    expect(p.menuSize).toBeGreaterThan(0);
  });

  it("system prompt for tr uses Turkish label, not Bulgarian", () => {
    const p = buildPrompt({ locale: "tr", mode: "buttons", answers: {}, menu: TEST_CATEGORIES });
    expect(p.system).toContain("Turkish");
    expect(p.system).toContain("(tr)");
    expect(p.system).not.toContain("Bulgarian");
  });
});
