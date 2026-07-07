import { buildCandidateShortlist } from "../../../src/app/masa/wizard/candidates";
import type { QrMenuCategory, QrMenuItem } from "../../../src/app/masa/masaTypes";
import { TEST_CATEGORIES } from "./fixture";

const ALL_IDS = new Set(TEST_CATEGORIES.flatMap((c) => c.items.map((i) => i.id)));

// candidates.ts reasons about curated tags from menuTags.ts, which are keyed
// by the REAL production item ids. fixture.ts intentionally uses fake ids to
// exercise the scoring engine's untagged fallback path, so mode-specific
// filter tests below need a small menu built from real, tagged ids instead.
function item(id: string, bg: string, tr: string, en: string, price: number): QrMenuItem {
  return { id, title: { bg, tr, en }, description: { bg: "", tr: "", en: "" }, amount: "", price, allergens: [] };
}

const REAL_CATEGORIES: QrMenuCategory[] = [
  {
    id: "salads", order: 1, title: { bg: "", tr: "", en: "" }, description: { bg: "", tr: "", en: "" },
    items: [item("shopska-salata", "Шопска", "Şopska", "Shopska", 7.82)],
  },
  {
    id: "grill", order: 2, title: { bg: "", tr: "", en: "" }, description: { bg: "", tr: "", en: "" },
    items: [
      item("kyufte", "Кюфте", "Köfte", "Meatball", 3.5),
      item("meshena-skara", "Мешена скара", "Karışık Izgara", "Mixed Grill", 34.22),
    ],
  },
  {
    id: "nuts-desserts", order: 3, title: { bg: "", tr: "", en: "" }, description: { bg: "", tr: "", en: "" },
    items: [
      item("kyunefe", "Кюнефе", "Künefe", "Kunefe", 6.5),
      item("sladoled", "Сладолед", "Dondurma", "Ice Cream", 5.67),
    ],
  },
  {
    id: "beer-cider-other-drinks", order: 4, title: { bg: "", tr: "", en: "" }, description: { bg: "", tr: "", en: "" },
    items: [
      item("carlsberg", "Карлсберг", "Carlsberg", "Carlsberg", 3.91),
      item("carlsberg-0-0", "Карлсберг 0.0", "Carlsberg 0.0", "Carlsberg 0.0", 4.3),
    ],
  },
  {
    id: "rakia", order: 5, title: { bg: "", tr: "", en: "" }, description: { bg: "", tr: "", en: "" },
    items: [item("peshterska-grozdova-otlezhala", "Пещерска", "Peşterska", "Peshterska", 2.34)],
  },
];

describe("buildCandidateShortlist", () => {
  it("returns only real menu ids, each with price/course/portion/tags/valueScore", () => {
    const out = buildCandidateShortlist({
      categories: TEST_CATEGORIES,
      answers: { anchor: "food" },
      customerMode: "hungry_normal",
      budgetBgn: null,
      locale: "en",
    });
    expect(out.length).toBeGreaterThan(0);
    for (const c of out) {
      expect(ALL_IDS.has(c.id)).toBe(true);
      expect(c.name.en.length).toBeGreaterThan(0);
      expect(typeof c.valueScore).toBe("number");
      expect(c.valueScore).toBeGreaterThanOrEqual(0);
      expect(c.valueScore).toBeLessThanOrEqual(1);
    }
  });

  it("caps the shortlist to at most 15 items", () => {
    const out = buildCandidateShortlist({
      categories: TEST_CATEGORIES,
      answers: {},
      customerMode: "undecided",
      budgetBgn: null,
      locale: "en",
    });
    expect(out.length).toBeLessThanOrEqual(15);
  });

  it("respects a custom limit within the 8-15 bounds", () => {
    const out = buildCandidateShortlist({
      categories: TEST_CATEGORIES,
      answers: {},
      customerMode: "undecided",
      budgetBgn: null,
      locale: "en",
      limit: 3, // below MIN_LIMIT (8), should be clamped up
    });
    expect(out.length).toBeGreaterThanOrEqual(Math.min(8, ALL_IDS.size));
  });

  it("sweet_only mode only returns dessert (or sweet drink) items", () => {
    const out = buildCandidateShortlist({
      categories: REAL_CATEGORIES,
      answers: { foodProtein: "sweet-only" },
      customerMode: "sweet_only",
      budgetBgn: null,
      locale: "en",
    });
    expect(out.length).toBeGreaterThan(0);
    for (const c of out) {
      expect(c.course === "dessert" || (c.course === "drink" && c.tags.flavor.includes("sweet"))).toBe(true);
    }
    expect(out.some((c) => c.id === "kyunefe" || c.id === "sladoled")).toBe(true);
    expect(out.some((c) => c.id === "meshena-skara")).toBe(false);
  });

  it("family_safe mode never includes an alcoholic item", () => {
    const out = buildCandidateShortlist({
      categories: REAL_CATEGORIES,
      answers: {},
      customerMode: "family_safe",
      budgetBgn: null,
      locale: "en",
    });
    for (const c of out) {
      expect(c.isAlcoholic).toBe(false);
    }
    expect(out.some((c) => c.id === "carlsberg")).toBe(false);
    expect(out.some((c) => c.id === "carlsberg-0-0")).toBe(true);
  });

  it("very_hungry_low_budget mode ranks a cheap filling main above a feast item that blows the budget", () => {
    const out = buildCandidateShortlist({
      categories: REAL_CATEGORIES,
      answers: { anchor: "food" },
      customerMode: "very_hungry_low_budget",
      budgetBgn: 20,
      locale: "en",
    });
    const kyufte = out.find((c) => c.id === "kyufte");
    const mixedGrill = out.find((c) => c.id === "meshena-skara"); // 34.22 BGN, way over a 20 BGN budget
    expect(kyufte).toBeDefined();
    expect(mixedGrill).toBeDefined();
    expect(kyufte!.valueScore).toBeGreaterThan(mixedGrill!.valueScore);
  });
});
