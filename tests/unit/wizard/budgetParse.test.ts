import { budgetHint, budgetInBGN, parseBudget } from "../../../src/app/masa/wizard/budgetParse";

describe("parseBudget", () => {
  it("parses English euros", () => {
    expect(parseBudget("I have 10 euros")?.value).toBe(10);
    expect(parseBudget("I have 10 euros")?.currency).toBe("EUR");
  });

  it("parses singular euro", () => {
    expect(parseBudget("budget is 1 euro")?.value).toBe(1);
  });

  it("parses Bulgarian лева / лев", () => {
    expect(parseBudget("Бюджет 20 лева")?.value).toBe(20);
    expect(parseBudget("Бюджет 20 лева")?.currency).toBe("BGN");
    expect(parseBudget("имам 30 лв")?.value).toBe(30);
    expect(parseBudget("имам 30 лв")?.currency).toBe("BGN");
    expect(parseBudget("30 лв.")?.value).toBe(30);
  });

  it("parses Turkish lira is intentionally not recognised (we normalise to BGN)", () => {
    // Turkish free-text is rare in our context; we don't accept lira.
    expect(parseBudget("30 lira")).toBeNull();
  });

  it("parses the euro symbol", () => {
    expect(parseBudget("20€")?.value).toBe(20);
    expect(parseBudget("20€")?.currency).toBe("EUR");
    expect(parseBudget("20 €")?.value).toBe(20);
  });

  it("parses decimal values", () => {
    expect(parseBudget("10,5 лева")?.value).toBe(10.5);
    expect(parseBudget("10.50 EUR")?.value).toBe(10.5);
  });

  it("returns null when no budget is mentioned", () => {
    expect(parseBudget("I'm hungry")).toBeNull();
    expect(parseBudget("")).toBeNull();
    expect(parseBudget("give me something spicy")).toBeNull();
  });

  it("returns null for nonsense numbers", () => {
    expect(parseBudget("zero euros")).toBeNull();
    expect(parseBudget("abc лв")).toBeNull();
  });

  it("captures the source span", () => {
    expect(parseBudget("budget is 10 euros")?.source.toLowerCase()).toContain("10");
  });
});

describe("budgetInBGN", () => {
  it("returns BGN value unchanged", () => {
    expect(budgetInBGN("30 лева")).toBe(30);
    expect(budgetInBGN("30 лв")).toBe(30);
  });

  it("converts EUR to BGN using the fixed rate", () => {
    // 10 EUR * 1.95583 = 19.5583
    const v = budgetInBGN("10 euros");
    expect(v).toBeCloseTo(19.5583, 3);
  });

  it("returns null when nothing matches", () => {
    expect(budgetInBGN("no money here")).toBeNull();
  });
});

describe("budgetHint", () => {
  it("formats bg locale", () => {
    expect(budgetHint("30 лева", "bg")).toBe("Бюджет: 30 лв");
  });
  it("formats tr locale", () => {
    expect(budgetHint("30 лева", "tr")).toBe("Bütçe: 30 BGN");
  });
  it("formats en locale", () => {
    expect(budgetHint("30 лева", "en")).toBe("Budget: 30 BGN");
  });
  it("returns null when no budget", () => {
    expect(budgetHint("just hungry", "en")).toBeNull();
  });
  it("converts EUR to BGN before formatting", () => {
    // 10 EUR -> ~19.56 BGN
    expect(budgetHint("10 euros", "en")).toMatch(/^Budget: 19\.5\d BGN$/);
  });
});
