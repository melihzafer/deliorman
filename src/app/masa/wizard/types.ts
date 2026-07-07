// Taste Wizard — shared types and the new tag model.
// The tag model replaces brittle keyword matching: every item has a curated
// tag set, and the scoring engine reasons about tags instead of substrings.

import type { Locale, QrMenuItem } from "../masaTypes";

// ---------------------------------------------------------------------------
// Item tags — curated once, used by scoring / pairings / rationale / NLU.
// ---------------------------------------------------------------------------

export type Protein =
  | "meat"
  | "poultry"
  | "fish"
  | "seafood"
  | "dairy"
  | "vegetable"
  | "grain"
  | "legume"
  | "fruit"
  | "sweet"
  | "mixed"
  | "none";

export type Flavor =
  | "savory"
  | "sweet"
  | "umami"
  | "spicy"
  | "fresh"
  | "smoky"
  | "bitter"
  | "tart"
  | "fruity";

export type Texture =
  | "grilled"
  | "fried"
  | "baked"
  | "raw"
  | "creamy"
  | "crispy"
  | "liquid"
  | "chewy"
  | "smooth"
  | "crumbly"
  | "soft";

export type Temp = "hot" | "cold" | "room";

export type DrinkState = "alcoholic" | "non-alcoholic" | "low-alcohol" | "na";

export type DrinkProfile =
  | "caffeine"
  | "fruity"
  | "herbal"
  | "malty"
  | "hoppy"
  | "wine"
  | "spirit"
  | "na";

export type Vibe =
  | "traditional-bg"
  | "comfort"
  | "modern"
  | "indulgent"
  | "light"
  | "celebratory"
  | "adventurous";

export type Portion = "snack" | "meal" | "feast";

export type Course = "starter" | "main" | "side" | "dessert" | "drink" | "snack";

export interface ItemTags {
  protein: Protein;
  flavors: Flavor[];
  textures: Texture[];
  temp: Temp;
  state: DrinkState;
  profile: DrinkProfile;
  vibe: Vibe;
  portion: Portion;
  course: Course;
}

export const EMPTY_TAGS: ItemTags = {
  protein: "none",
  flavors: [],
  textures: [],
  temp: "room",
  state: "na",
  profile: "na",
  vibe: "comfort",
  portion: "snack",
  course: "snack",
};

// ---------------------------------------------------------------------------
// Wizard answers — the adaptive state model.
// ---------------------------------------------------------------------------

export type Anchor = "food" | "drink" | "both";

export type Mood = "comfort" | "healthy" | "indulgent" | "adventurous";

export type FoodProtein = "meat" | "poultry" | "fish" | "vegetarian" | "sweet-only";

export type Hunger = "snack" | "meal" | "feast";

export type FoodTexture = "grilled" | "crispy" | "creamy" | "no-preference";

export type DrinkTemp = "hot" | "cold";

export type AlcoholChoice = "non-alcoholic" | "alcoholic" | "either";

export type DrinkProfileChoice = "caffeine" | "fruity" | "herbal" | "beer-wine" | "any";

export interface WizardAnswers {
  mood?: Mood;
  anchor?: Anchor;
  foodProtein?: FoodProtein;
  hunger?: Hunger;
  foodTexture?: FoodTexture;
  drinkTemp?: DrinkTemp;
  alcohol?: AlcoholChoice;
  drinkProfile?: DrinkProfileChoice;
}

// ---------------------------------------------------------------------------
// Steps — the adaptive state machine.
// ---------------------------------------------------------------------------

export type WizardStep =
  | "intro"
  | "q_mood"
  | "q_anchor"
  | "q_food_protein"
  | "q_food_hunger"
  | "q_food_texture"
  | "q_drink_temp"
  | "q_drink_alcohol"
  | "q_drink_profile"
  | "spinning"
  | "result";

// ---------------------------------------------------------------------------
// Scored items — internal shape returned by the scoring engine.
// ---------------------------------------------------------------------------

export interface ScoredItem {
  item: QrMenuItem & { categoryId: string };
  score: number;
  rationaleKey: string; // translation key for "why this item"
  matchReasons: string[]; // list of matched tag values (bg/tr/en friendly)
}

// ---------------------------------------------------------------------------
// Customer mode — classification used by the LLM candidate pipeline to
// decide hard filters, value scoring, and budget-repair priority.
// ---------------------------------------------------------------------------

export type CustomerMode =
  | "very_hungry_low_budget"
  | "hungry_normal"
  | "beer_with_food"
  | "drink_only"
  | "sweet_only"
  | "family_safe"
  | "adventurous"
  | "light_fresh"
  | "budget_value"
  | "undecided";

export type BudgetStatus =
  | "within_budget"
  | "food_only_within_budget"
  | "drink_only_within_budget"
  | "over_budget_no_safe_combo";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const DEFAULT_ANSWERS: WizardAnswers = {};

const DRINK_CATEGORIES = new Set<string>([
  "hot-beverages",
  "beer-cider-other-drinks",
  "rakia",
  "wines",
  "whiskey-vodka",
]);

export function isDrinkCategory(categoryId: string | undefined): boolean {
  return !!categoryId && DRINK_CATEGORIES.has(categoryId);
}

export function isFoodCategory(categoryId: string | undefined): boolean {
  return !!categoryId && !DRINK_CATEGORIES.has(categoryId) && categoryId !== "allergens";
}

export function categoryCourse(categoryId: string | undefined): Course {
  if (!categoryId) return "snack";
  if (categoryId === "nuts-desserts") return "dessert";
  if (isDrinkCategory(categoryId)) return "drink";
  if (categoryId === "hot-appetizers" || categoryId === "cold-appetizers-sides") return "starter";
  if (categoryId === "soups-sandwiches") return "main";
  return "main";
}

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "bg" || value === "tr" || value === "en";
}
