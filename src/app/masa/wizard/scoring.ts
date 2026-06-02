// Tag-based scoring engine for the Taste Wizard.
//
// Replaces the brittle keyword-based scorer that lived inline in
// MasaTasteWizard.tsx. The new design:
//   - Reasons about structured tags instead of substrings in item titles
//   - Surfaces a "matchReasons" list per item so the UI can show a
//     transparent rationale ("Grilled, smoky, matches your Adventurous mood")
//   - Returns a confidence score so the UI can decide between "1 winner"
//     and "show top 3 as alternatives" when the top match is weak
//   - Hard-filters by anchor (food / drink / both) and adds a small
//     "popularity" boost so popular items rise when matches tie
//
// All scoring is deterministic and pure. The caller can seed RNG separately
// if it wants the spinning animation to vary.

import type { Locale, QrMenuItem, QrMenuCategory } from "../masaTypes";
import { getItemTags } from "./menuTags";
import type {
  FoodProtein,
  FoodTexture,
  Hunger,
  ItemTags,
  Mood,
  ScoredItem,
  WizardAnswers,
} from "./types";
import { isDrinkCategory, isFoodCategory } from "./types";

export interface ScoredItemInternal extends ScoredItem {
  confidence: number; // 0..1 — top score / second-top score, lower = more ambiguous
  reasons: string[]; // i18n keys for the rationale generator
}

interface ScoreContext {
  answers: WizardAnswers;
  locale: Locale;
  pool: Array<QrMenuItem & { categoryId: string }>;
}

function flattenItems(categories: QrMenuCategory[]): Array<QrMenuItem & { categoryId: string }> {
  return categories.flatMap((cat) => cat.items.map((it) => ({ ...it, categoryId: cat.id })));
}

function filterByAnchor(
  pool: Array<QrMenuItem & { categoryId: string }>,
  answers: WizardAnswers,
): Array<QrMenuItem & { categoryId: string }> {
  const anchor = answers.anchor;
  if (!anchor || anchor === "both") return pool.filter((it) => isFoodCategory(it.categoryId) || isDrinkCategory(it.categoryId));
  if (anchor === "food") return pool.filter((it) => isFoodCategory(it.categoryId));
  if (anchor === "drink") return pool.filter((it) => isDrinkCategory(it.categoryId));
  return pool;
}

function matchesFoodProtein(tags: ItemTags, want: FoodProtein | undefined): number {
  if (!want || want === "sweet-only") {
    if (want === "sweet-only") return tags.course === "dessert" ? 20 : -10;
    return 0;
  }
  if (want === "vegetarian") {
    if (tags.protein === "meat" || tags.protein === "poultry" || tags.protein === "fish" || tags.protein === "seafood") return -30;
    return 18;
  }
  if (tags.protein === want) return 25;
  if (want === "meat" && tags.protein === "poultry") return 8; // mild overlap
  if (want === "poultry" && tags.protein === "meat") return 8;
  if (want === "fish" && (tags.protein === "seafood")) return 12;
  return -8;
}

function matchesMood(tags: ItemTags, mood: Mood | undefined): number {
  if (!mood) return 0;
  if (mood === "comfort") {
    if (tags.vibe === "comfort" || tags.vibe === "traditional-bg") return 18;
    if (tags.vibe === "modern" || tags.vibe === "indulgent") return 8;
    return 0;
  }
  if (mood === "healthy") {
    if (tags.flavors.includes("fresh") || tags.vibe === "light") return 22;
    if (tags.textures.includes("raw") || tags.course === "starter" || tags.portion === "snack") return 8;
    if (tags.flavors.includes("smoky") || tags.vibe === "indulgent") return -12;
    return 0;
  }
  if (mood === "indulgent") {
    if (tags.vibe === "indulgent" || tags.vibe === "celebratory") return 22;
    if (tags.textures.includes("creamy") || tags.textures.includes("fried")) return 6;
    if (tags.vibe === "light") return -10;
    return 0;
  }
  if (mood === "adventurous") {
    if (tags.flavors.includes("spicy") || tags.flavors.includes("smoky") || tags.vibe === "adventurous" || tags.vibe === "celebratory") return 22;
    if (tags.flavors.includes("sweet") || tags.vibe === "light") return -8;
    return 0;
  }
  return 0;
}

function matchesHunger(tags: ItemTags, want: Hunger | undefined): number {
  if (!want) return 0;
  if (want === tags.portion) return 18;
  // nearby match
  if (want === "snack" && tags.portion === "meal") return 4;
  if (want === "meal" && (tags.portion === "snack" || tags.portion === "feast")) return 6;
  if (want === "feast" && tags.portion === "meal") return 8;
  return -6;
}

function matchesFoodTexture(tags: ItemTags, want: FoodTexture | undefined): number {
  if (!want || want === "no-preference") return 0;
  if (tags.textures.includes(want)) return 15;
  return -4;
}

function matchesDrink(tags: ItemTags, answers: WizardAnswers): number {
  let s = 0;
  if (answers.drinkTemp) {
    if (answers.drinkTemp === tags.temp) s += 25;
  }
  if (answers.alcohol) {
    if (answers.alcohol === "either") s += 0;
    else if (answers.alcohol === "non-alcoholic" && tags.state === "non-alcoholic") s += 22;
    else if (answers.alcohol === "non-alcoholic" && tags.state === "alcoholic") s -= 18;
    else if (answers.alcohol === "alcoholic" && tags.state === "alcoholic") s += 22;
    else if (answers.alcohol === "alcoholic" && tags.state === "non-alcoholic") s -= 18;
  }
  if (answers.drinkProfile && answers.drinkProfile !== "any") {
    if (answers.drinkProfile === "beer-wine") {
      if (tags.profile === "malty" || tags.profile === "wine" || tags.profile === "hoppy") s += 18;
    } else if (tags.profile === answers.drinkProfile) {
      s += 18;
    } else {
      s -= 4;
    }
  }
  return s;
}

function popularityBoost(categoryId: string, price: number | null): number {
  // Soft nudge so classics (grill, salads, pizza) win ties. Pure tie-breaker.
  if (categoryId === "grill") return 3;
  if (categoryId === "salads") return 2;
  if (categoryId === "pizzas") return 2;
  if (categoryId === "hot-appetizers") return 1;
  if (categoryId === "burgers") return 1;
  if (categoryId === "new-specialties") return 2;
  if (categoryId === "saj-fish-specialties") return 2;
  if (categoryId === "nuts-desserts") return 1;
  return 0;
}

function priceSweetSpot(price: number | null, hunger: Hunger | undefined): number {
  if (price == null) return 0;
  if (!hunger) return 0;
  if (hunger === "snack" && price < 6) return 2;
  if (hunger === "meal" && price >= 6 && price <= 15) return 2;
  if (hunger === "feast" && price > 15) return 2;
  return 0;
}

function buildReasonKeys(tags: ItemTags, answers: WizardAnswers): { keys: string[]; tags: string[] } {
  const keys: string[] = [];
  const tagDescs: string[] = [];

  if (answers.mood === "comfort" && (tags.vibe === "comfort" || tags.vibe === "traditional-bg")) {
    keys.push("r_comfort");
    tagDescs.push("vibe:comfort");
  }
  if (answers.mood === "healthy" && (tags.flavors.includes("fresh") || tags.vibe === "light")) {
    keys.push("r_healthy");
    tagDescs.push("flavor:fresh");
  }
  if (answers.mood === "indulgent" && (tags.vibe === "indulgent" || tags.vibe === "celebratory")) {
    keys.push("r_indulgent");
    tagDescs.push("vibe:indulgent");
  }
  if (answers.mood === "adventurous" && (tags.flavors.includes("spicy") || tags.flavors.includes("smoky") || tags.vibe === "adventurous")) {
    keys.push("r_adventurous");
    tagDescs.push("flavor:smoky");
  }
  if (answers.foodProtein && answers.foodProtein !== "sweet-only" && tags.protein === answers.foodProtein) {
    keys.push("r_protein");
    tagDescs.push(`protein:${tags.protein}`);
  }
  if (answers.foodProtein === "vegetarian" && tags.protein !== "meat" && tags.protein !== "poultry" && tags.protein !== "fish" && tags.protein !== "seafood") {
    keys.push("r_vegetarian");
    tagDescs.push("protein:vegetarian");
  }
  if (answers.hunger && tags.portion === answers.hunger) {
    keys.push("r_portion");
    tagDescs.push(`portion:${tags.portion}`);
  }
  if (answers.foodTexture && answers.foodTexture !== "no-preference" && tags.textures.includes(answers.foodTexture)) {
    keys.push("r_texture");
    tagDescs.push(`texture:${answers.foodTexture}`);
  }
  if (answers.drinkTemp && tags.temp === answers.drinkTemp) {
    keys.push("r_temp");
    tagDescs.push(`temp:${tags.temp}`);
  }
  if (answers.alcohol === "alcoholic" && tags.state === "alcoholic") {
    keys.push("r_alcoholic");
    tagDescs.push("state:alcoholic");
  }
  if (answers.alcohol === "non-alcoholic" && tags.state === "non-alcoholic") {
    keys.push("r_alcoholic");
    tagDescs.push("state:non-alcoholic");
  }
  if (answers.drinkProfile && answers.drinkProfile !== "any" && tags.profile === answers.drinkProfile) {
    keys.push("r_profile");
    tagDescs.push(`profile:${tags.profile}`);
  }

  // Always include the "signature" tag if no other reason
  if (keys.length === 0) {
    if (tags.flavors.length > 0) {
      keys.push("r_signature");
      tagDescs.push(`flavor:${tags.flavors[0]}`);
    } else {
      keys.push("r_signature");
      tagDescs.push(`vibe:${tags.vibe}`);
    }
  }
  return { keys, tags: tagDescs };
}

export function scoreItems(
  categories: QrMenuCategory[],
  answers: WizardAnswers,
  locale: Locale,
): ScoredItemInternal[] {
  const all = flattenItems(categories);
  const filtered = filterByAnchor(all, answers);
  if (filtered.length === 0) return [];

  const scored = filtered.map((item) => {
    const tags = getItemTags(item.id);
    let score = 0;
    score += matchesMood(tags, answers.mood);
    score += matchesFoodProtein(tags, answers.foodProtein);
    score += matchesHunger(tags, answers.hunger);
    score += matchesFoodTexture(tags, answers.foodTexture);
    score += matchesDrink(tags, answers);
    score += popularityBoost(item.categoryId, item.price);
    score += priceSweetSpot(item.price, answers.hunger);

    // Tiny course-priority nudge so when the user wants a main, we don't
    // lead with a starter/snack.
    if (answers.anchor === "food" && tags.course === "main") score += 4;
    if (answers.anchor === "drink" && tags.course === "drink") score += 4;

    const reason = buildReasonKeys(tags, answers);
    return { item, score, rationaleKey: reason.keys[0] ?? "r_signature", matchReasons: reason.tags, reasons: reason.keys, confidence: 0 };
  });

  scored.sort((a, b) => b.score - a.score);

  // Compute confidence: ratio between top and second score (or 1 if only one)
  for (let i = 0; i < scored.length; i++) {
    if (scored.length === 1) {
      scored[i].confidence = 1;
    } else if (i === 0) {
      const next = scored[1]?.score ?? 0;
      scored[i].confidence = next === 0 ? 1 : Math.min(1, Math.max(0, (scored[i].score - next) / Math.max(1, Math.abs(scored[i].score))));
    } else {
      scored[i].confidence = 0;
    }
  }
  return scored;
}

export interface WizardPick {
  main: ScoredItemInternal;
  alternatives: ScoredItemInternal[];
  confidence: "high" | "medium" | "low";
  pool: ScoredItemInternal[];
}

export function pickRecommendation(categories: QrMenuCategory[], answers: WizardAnswers, locale: Locale): WizardPick | null {
  const scored = scoreItems(categories, answers, locale);
  if (scored.length === 0) return null;
  const top = scored[0];
  const rest = scored.slice(1, 5);
  const confidence: WizardPick["confidence"] = top.confidence > 0.55 ? "high" : top.confidence > 0.2 ? "medium" : "low";
  return {
    main: top,
    alternatives: rest,
    confidence,
    pool: scored,
  };
}

export function getSurprisePick(categories: QrMenuCategory[]): ScoredItemInternal | null {
  const all = flattenItems(categories).filter((it) => isFoodCategory(it.categoryId) || isDrinkCategory(it.categoryId));
  if (all.length === 0) return null;
  const idx = Math.floor(Math.random() * all.length);
  const item = all[idx];
  const tags = getItemTags(item.id);
  return {
    item,
    score: 0,
    rationaleKey: "r_signature",
    matchReasons: [`vibe:${tags.vibe}`],
    reasons: ["r_surprise"],
    confidence: 1,
  };
}
