import { budgetHint, budgetInEur, parseBudget } from "../../../src/app/masa/wizard/budgetParse";

describe("parseBudget", () => {
  it("parses English euros", () => {
    expect(parseBudget("I have 10 euros")?.value).toBe(10);
    expect(parseBudget("I have 10 euros")?.currency).toBe("EUR");
  });

  it("parses singular euro", () => {
    expect(parseBudget("budget is 1 euro")?.value).toBe(1);
  });

  it("parses Bulgarian евро / евра", () => {
    expect(parseBudget("Бюджет 20 евро")?.value).toBe(20);
    expect(parseBudget("Бюджет 20 евро")?.currency).toBe("EUR");
    expect(parseBudget("имам 30 евро")?.value).toBe(30);
    expect(parseBudget("имам 30 евро")?.currency).toBe("EUR");
  });

  it("does not recognise the old Bulgarian lev (лв / лева / BGN) — no longer legal tender", () => {
    expect(parseBudget("имам 30 лв")).toBeNull();
    expect(parseBudget("30 лева")).toBeNull();
    expect(parseBudget("30 BGN")).toBeNull();
    expect(parseBudget("30 leva")).toBeNull();
  });

  it("parses Turkish lira is intentionally not recognised (only euro is a valid budget currency)", () => {
    expect(parseBudget("30 lira")).toBeNull();
  });

  it("parses the euro symbol", () => {
    expect(parseBudget("20€")?.value).toBe(20);
    expect(parseBudget("20€")?.currency).toBe("EUR");
    expect(parseBudget("20 €")?.value).toBe(20);
  });

  it("parses decimal values", () => {
    expect(parseBudget("10,5 евро")?.value).toBe(10.5);
    expect(parseBudget("10.50 EUR")?.value).toBe(10.5);
  });

  it("returns null when no budget is mentioned", () => {
    expect(parseBudget("I'm hungry")).toBeNull();
    expect(parseBudget("")).toBeNull();
    expect(parseBudget("give me something spicy")).toBeNull();
  });

  it("returns null for nonsense numbers", () => {
    expect(parseBudget("zero euros")).toBeNull();
    expect(parseBudget("abc евро")).toBeNull();
  });

  it("captures the source span", () => {
    expect(parseBudget("budget is 10 euros")?.source.toLowerCase()).toContain("10");
  });
});

describe("budgetInEur", () => {
  it("returns the euro value unchanged (menu prices are already in EUR)", () => {
    expect(budgetInEur("30 евро")).toBe(30);
    expect(budgetInEur("10 euros")).toBe(10);
  });

  it("returns null when nothing matches", () => {
    expect(budgetInEur("no money here")).toBeNull();
    expect(budgetInEur("30 лв")).toBeNull();
  });
});

describe("budgetHint", () => {
  it("formats bg locale", () => {
    expect(budgetHint("30 евро", "bg")).toBe("Бюджет: 30 €");
  });
  it("formats tr locale", () => {
    expect(budgetHint("30 евро", "tr")).toBe("Bütçe: 30 €");
  });
  it("formats en locale", () => {
    expect(budgetHint("30 евро", "en")).toBe("Budget: €30");
  });
  it("returns null when no budget", () => {
    expect(budgetHint("just hungry", "en")).toBeNull();
  });
});
