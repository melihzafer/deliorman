import {
  ALLOWED_BUDGET_STATUS,
  ALLOWED_REASON_KEYS,
  parseLlmJson,
  validateLlmResponse,
} from "../../../src/app/masa/wizard/recommendSchema";
import { TEST_CATEGORIES } from "./fixture";

describe("recommendSchema — parseLlmJson", () => {
  it("parses raw JSON", () => {
    const r = parseLlmJson('{"a": 1}');
    expect(r).toEqual({ a: 1 });
  });
  it("strips a single json fence", () => {
    const r = parseLlmJson('```json\n{"a": 1}\n```');
    expect(r).toEqual({ a: 1 });
  });
  it("strips a generic ``` fence", () => {
    const r = parseLlmJson('```\n{"a": 1}\n```');
    expect(r).toEqual({ a: 1 });
  });
  it("returns null for invalid JSON", () => {
    expect(parseLlmJson("not json")).toBeNull();
    expect(parseLlmJson("{broken")).toBeNull();
  });
  it("ignores leading/trailing whitespace", () => {
    expect(parseLlmJson('   \n  {"a":1}  \n')).toEqual({ a: 1 });
  });
});

describe("recommendSchema — validateLlmResponse", () => {
  const good = {
    language: "bg",
    primaryItemId: "kebabche",
    drinkItemId: "carlsberg",
    sideItemId: "shopska",
    alternativeItemIds: ["chicken-skewer", "mixed-grill"],
    budgetStatus: "within_budget",
    totalEstimatedPrice: 9.71,
    confidence: 82,
    reasonKeys: ["filling", "grilled"],
    customerMessage: "Кебапче с бира и шопска салата.",
  };

  it("accepts a well-formed response", () => {
    const r = validateLlmResponse(good, TEST_CATEGORIES, "bg");
    expect(r.ok).toBe(true);
    expect(r.response?.primaryItemId).toBe("kebabche");
    expect(r.response?.drinkItemId).toBe("carlsberg");
    expect(r.response?.sideItemId).toBe("shopska");
    expect(r.response?.alternativeItemIds).toEqual(["chicken-skewer", "mixed-grill"]);
    expect(r.response?.budgetStatus).toBe("within_budget");
    expect(r.response?.reasonKeys).toEqual(["filling", "grilled"]);
  });

  it("drops a hallucinated primaryItemId but keeps validity if other slots are real", () => {
    const raw = { ...good, primaryItemId: "nonsense-item" };
    const r = validateLlmResponse(raw, TEST_CATEGORIES, "bg");
    expect(r.ok).toBe(true);
    expect(r.response?.primaryItemId).toBeNull();
    expect(r.response?.drinkItemId).toBe("carlsberg");
  });

  it("is not ok when nothing in the response is a real id", () => {
    const raw = {
      language: "bg",
      primaryItemId: "fake-1",
      drinkItemId: "fake-2",
      sideItemId: "fake-3",
      alternativeItemIds: ["fake-4"],
      budgetStatus: "within_budget",
      totalEstimatedPrice: null,
      confidence: 50,
      reasonKeys: [],
      customerMessage: "...",
    };
    const r = validateLlmResponse(raw, TEST_CATEGORIES, "bg");
    expect(r.ok).toBe(false);
    expect(r.response?.primaryItemId).toBeNull();
  });

  it("drops hallucinated alternatives but keeps the valid ones", () => {
    const raw = { ...good, alternativeItemIds: ["fake-1", "shopska-clone", "chicken-skewer"] };
    const r = validateLlmResponse(raw, TEST_CATEGORIES, "bg");
    expect(r.response?.alternativeItemIds).toEqual(["chicken-skewer"]);
  });

  it("excludes primary/drink/side ids from alternatives (no duplicates)", () => {
    const raw = { ...good, alternativeItemIds: ["kebabche", "carlsberg", "chicken-skewer"] };
    const r = validateLlmResponse(raw, TEST_CATEGORIES, "bg");
    expect(r.response?.alternativeItemIds).toEqual(["chicken-skewer"]);
  });

  it("caps alternatives to 3", () => {
    const raw = {
      ...good,
      alternativeItemIds: ["chicken-skewer", "mixed-grill", "margherita", "ice-cream", "espresso"],
    };
    const r = validateLlmResponse(raw, TEST_CATEGORIES, "bg");
    expect(r.response?.alternativeItemIds.length).toBe(3);
  });

  it("filters invalid reasonKeys to only the allowed vocabulary", () => {
    const raw = { ...good, reasonKeys: ["filling", "made-up-key", "spicy"] };
    const r = validateLlmResponse(raw, TEST_CATEGORIES, "bg");
    expect(r.response?.reasonKeys).toEqual(["filling", "spicy"]);
  });

  it("caps reasonKeys to 4", () => {
    const raw = { ...good, reasonKeys: ["filling", "grilled", "classic", "fresh", "spicy"] };
    const r = validateLlmResponse(raw, TEST_CATEGORIES, "bg");
    expect(r.response?.reasonKeys.length).toBe(4);
  });

  it("coerces an invalid budgetStatus to within_budget", () => {
    const raw = { ...good, budgetStatus: "totally_fine" };
    const r = validateLlmResponse(raw, TEST_CATEGORIES, "bg");
    expect(r.response?.budgetStatus).toBe("within_budget");
  });

  it("clamps confidence to 0-100", () => {
    expect(validateLlmResponse({ ...good, confidence: 500 }, TEST_CATEGORIES, "bg").response?.confidence).toBe(100);
    expect(validateLlmResponse({ ...good, confidence: -10 }, TEST_CATEGORIES, "bg").response?.confidence).toBe(0);
    expect(validateLlmResponse({ ...good, confidence: "not-a-number" }, TEST_CATEGORIES, "bg").response?.confidence).toBe(50);
  });

  it("truncates an overlong customerMessage", () => {
    const raw = { ...good, customerMessage: "x".repeat(500) };
    const r = validateLlmResponse(raw, TEST_CATEGORIES, "bg", { maxMessageChars: 50 });
    expect(r.response?.customerMessage.length).toBeLessThanOrEqual(51); // 50 + ellipsis
  });

  it("defaults customerMessage length cap to 280", () => {
    const raw = { ...good, customerMessage: "x".repeat(500) };
    const r = validateLlmResponse(raw, TEST_CATEGORIES, "bg");
    expect(r.response?.customerMessage.length).toBeLessThanOrEqual(281);
  });

  it("falls back to the requested locale when language is missing/invalid", () => {
    const raw = { ...good, language: "fr" };
    const r = validateLlmResponse(raw, TEST_CATEGORIES, "tr");
    expect(r.response?.language).toBe("tr");
  });

  it("rejects a non-object top-level", () => {
    expect(validateLlmResponse("nope", TEST_CATEGORIES, "bg").ok).toBe(false);
    expect(validateLlmResponse(null, TEST_CATEGORIES, "bg").ok).toBe(false);
  });

  it("rejects an empty top-level object", () => {
    const r = validateLlmResponse({}, TEST_CATEGORIES, "bg");
    expect(r.ok).toBe(false);
    expect(r.response?.primaryItemId).toBeNull();
  });
});

describe("recommendSchema — vocabulary exports", () => {
  it("ALLOWED_REASON_KEYS contains the spec vocabulary", () => {
    for (const k of ["filling", "budget_fit", "beer_pairing", "light", "sweet", "grilled", "classic", "adventurous", "family_safe", "good_value", "fresh", "spicy"]) {
      expect(ALLOWED_REASON_KEYS.has(k)).toBe(true);
    }
    expect(ALLOWED_REASON_KEYS.has("nope")).toBe(false);
  });

  it("ALLOWED_BUDGET_STATUS contains the 4 spec values", () => {
    expect(ALLOWED_BUDGET_STATUS.has("within_budget")).toBe(true);
    expect(ALLOWED_BUDGET_STATUS.has("food_only_within_budget")).toBe(true);
    expect(ALLOWED_BUDGET_STATUS.has("drink_only_within_budget")).toBe(true);
    expect(ALLOWED_BUDGET_STATUS.has("over_budget_no_safe_combo")).toBe(true);
    expect(ALLOWED_BUDGET_STATUS.has("nope")).toBe(false);
  });
});
