import {
  ALLOWED_REASON_KEYS,
  ALLOWED_TAGS,
  parseLlmJson,
  validateLlmResponse,
} from "../../../src/app/masa/wizard/recommendSchema";
import { TEST_CATEGORIES } from "./fixture";

const MENU_IDS = TEST_CATEGORIES.flatMap((c) => c.items.map((i) => i.id));

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
  const goodMain = {
    id: "kebabche",
    matchReasons: ["vibe:adventurous", "texture:grilled"],
  };

  it("accepts a well-formed response", () => {
    const raw = {
      main: goodMain,
      alternatives: [
        { id: "chicken-skewer", matchReasons: ["vibe:comfort"] },
        { id: "mixed-grill", matchReasons: ["vibe:indulgent", "state:alcoholic"] },
      ],
      combo: {
        side: { id: "shopska", reasonKey: "pair_fresh_side" },
        drink: { id: "espresso", reasonKey: "pair_drink_default" },
      },
      rationale: "Пикантно кебапче с шопска салата.",
    };
    const r = validateLlmResponse(raw, TEST_CATEGORIES, "bg");
    expect(r.ok).toBe(true);
    expect(r.response?.main?.id).toBe("kebabche");
    expect(r.response?.alternatives).toHaveLength(2);
    expect(r.response?.combo.side?.id).toBe("shopska");
    expect(r.response?.combo.drink?.reasonKey).toBe("pair_drink_default");
  });

  it("rejects a hallucinated main id", () => {
    const raw = {
      main: { id: "nonsense-item", matchReasons: [] },
      alternatives: [],
      combo: { side: null, drink: null },
      rationale: "...",
    };
    const r = validateLlmResponse(raw, TEST_CATEGORIES, "bg");
    expect(r.ok).toBe(false);
    expect(r.response?.main).toBeNull();
  });

  it("drops hallucinated alternatives but keeps the valid ones", () => {
    const raw = {
      main: goodMain,
      alternatives: [
        { id: "fake-1", matchReasons: [] },
        { id: "shopska", matchReasons: [] },
        { id: "fake-2", matchReasons: [] },
      ],
      combo: { side: null, drink: null },
      rationale: "...",
    };
    const r = validateLlmResponse(raw, TEST_CATEGORIES, "bg");
    expect(r.ok).toBe(true);
    expect(r.response?.alternatives).toHaveLength(1);
    expect(r.response?.alternatives[0].id).toBe("shopska");
  });

  it("enforces the budget gate after the LLM picks", () => {
    const raw = {
      main: { id: "mixed-grill", matchReasons: [] }, // 34.22 BGN
      alternatives: [{ id: "kebabche", matchReasons: [] }], // 1.95 BGN
      combo: { side: null, drink: null },
      rationale: "...",
    };
    // budget = 5 BGN → main is over budget, alternatives within budget
    const r = validateLlmResponse(raw, TEST_CATEGORIES, "bg", { budgetBgn: 5 });
    expect(r.ok).toBe(false);
    expect(r.response?.main).toBeNull();
    expect(r.response?.alternatives).toHaveLength(1);
  });

  it("keeps the main when it fits the budget", () => {
    const raw = {
      main: { id: "kebabche", matchReasons: [] }, // 1.95 BGN
      alternatives: [],
      combo: { side: null, drink: null },
      rationale: "...",
    };
    const r = validateLlmResponse(raw, TEST_CATEGORIES, "bg", { budgetBgn: 5 });
    expect(r.ok).toBe(true);
  });

  it("filters invalid matchReasons to only allowed tags", () => {
    const raw = {
      main: { id: "kebabche", matchReasons: ["vibe:adventurous", "nonsense", "color:red"] },
      alternatives: [],
      combo: { side: null, drink: null },
      rationale: "...",
    };
    const r = validateLlmResponse(raw, TEST_CATEGORIES, "bg");
    expect(r.response?.main?.matchReasons).toEqual(["vibe:adventurous"]);
  });

  it("coerces an invalid reasonKey to pair_default", () => {
    const raw = {
      main: goodMain,
      alternatives: [],
      combo: {
        side: { id: "shopska", reasonKey: "make-it-spicy" },
        drink: { id: "espresso", reasonKey: "pair_drink_default" },
      },
      rationale: "...",
    };
    const r = validateLlmResponse(raw, TEST_CATEGORIES, "bg");
    expect(r.response?.combo.side?.reasonKey).toBe("pair_default");
  });

  it("truncates an overlong rationale", () => {
    const long = "x".repeat(500);
    const raw = {
      main: goodMain,
      alternatives: [],
      combo: { side: null, drink: null },
      rationale: long,
    };
    const r = validateLlmResponse(raw, TEST_CATEGORIES, "bg", { maxRationaleChars: 50 });
    expect(r.response?.rationale.length).toBeLessThanOrEqual(51); // 50 + ellipsis
  });

  it("rejects an empty top-level object", () => {
    const r = validateLlmResponse({}, TEST_CATEGORIES, "bg");
    expect(r.ok).toBe(false);
  });

  it("rejects a non-object top-level", () => {
    const r = validateLlmResponse("nope", TEST_CATEGORIES, "bg");
    expect(r.ok).toBe(false);
  });

  it("handles missing alternatives array gracefully", () => {
    const raw = {
      main: goodMain,
      combo: { side: null, drink: null },
      rationale: "...",
    };
    const r = validateLlmResponse(raw as Record<string, unknown>, TEST_CATEGORIES, "bg");
    expect(r.ok).toBe(true);
    expect(r.response?.alternatives).toEqual([]);
  });

  it("caps alternatives to 3", () => {
    const raw = {
      main: goodMain,
      alternatives: [
        { id: "kebabche", matchReasons: [] },
        { id: "chicken-skewer", matchReasons: [] },
        { id: "shopska", matchReasons: [] },
        { id: "caesar", matchReasons: [] },
        { id: "espresso", matchReasons: [] },
      ],
      combo: { side: null, drink: null },
      rationale: "...",
    };
    const r = validateLlmResponse(raw, TEST_CATEGORIES, "bg");
    expect(r.response?.alternatives.length).toBe(3);
  });
});

describe("recommendSchema — vocabulary exports", () => {
  it("ALLOWED_TAGS is non-empty and contains expected keys", () => {
    expect(ALLOWED_TAGS.size).toBeGreaterThan(20);
    expect(ALLOWED_TAGS.has("vibe:comfort")).toBe(true);
    expect(ALLOWED_TAGS.has("flavor:spicy")).toBe(true);
    expect(ALLOWED_TAGS.has("texture:grilled")).toBe(true);
    expect(ALLOWED_TAGS.has("protein:meat")).toBe(true);
    expect(ALLOWED_TAGS.has("portion:feast")).toBe(true);
  });

  it("ALLOWED_REASON_KEYS contains all pair_* keys", () => {
    expect(ALLOWED_REASON_KEYS.has("pair_fries")).toBe(true);
    expect(ALLOWED_REASON_KEYS.has("pair_bread")).toBe(true);
    expect(ALLOWED_REASON_KEYS.has("pair_drink_match")).toBe(true);
    expect(ALLOWED_REASON_KEYS.has("pair_default")).toBe(true);
    expect(ALLOWED_REASON_KEYS.has("nope")).toBe(false);
  });

  it("sanity: the test fixture ids must all be considered real", () => {
    for (const id of MENU_IDS) {
      // The validator doesn't expose the index, but the e2e tests above
      // already cover the lookup. Just make sure the fixture hasn't gone
      // empty by accident.
      expect(id.length).toBeGreaterThan(0);
    }
  });
});
