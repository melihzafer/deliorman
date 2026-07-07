// Customer-mode classifier for the LLM candidate pipeline.
//
// Turns WizardAnswers (from buttons or the lexicon NLU) plus raw free-text
// and an extracted budget into one CustomerMode. This mode drives hard
// filtering in candidates.ts and drop-priority in budgetRepair.ts. It is
// pure and deterministic — the LLM never decides this, so a Groq outage or
// a bad model response cannot change how the candidate shortlist is built.
//
// Free-text keyword lists are intentionally separate from lexicon.json:
// lexicon.json drives the 8-dimension quiz-answer inference and touching it
// risks regressing the quiz flow. These lists only feed customer-mode
// classification, a strictly additive concern.

import type { CustomerMode, WizardAnswers } from "./types";

// EUR reference: a "low/medium" budget for a single diner — comfortably
// above one filling main + a drink at Deliorman's price points, but low
// enough that a hungry diner needs value-first picks.
const MEDIUM_BUDGET_MAX_EUR = 23;

const VERY_HUNGRY_KEYWORDS = [
  "çok aç", "çok açım", "acıktım", "aç karnına", "kurt gibi aç",
  "starving", "very hungry", "so hungry", "super hungry", "really hungry",
  "много гладен", "страшно гладен", "умирам от глад", "адски гладен",
];

const BEER_ALCOHOL_KEYWORDS = [
  "bira", "birayı", "biraya", "alkol", "rakı", "şarap", "votka", "viski",
  "beer", "wine", "vodka", "whiskey", "alcohol", "cocktail",
  "бира", "алкохол", "вино", "водка", "уиски", "ракия",
];

// Naive substring matching can't see negation ("alkol olmasın" = "no
// alcohol please") — these phrases suppress a positive alcohol-keyword hit
// so "no alcohol" free text doesn't get misread as an alcohol request.
const ALCOHOL_NEGATION_KEYWORDS = [
  "alkol olmasın", "alkolsüz", "alkol yok", "alkol istemiyoruz", "alkol istemiyorum",
  "no alcohol", "without alcohol", "non-alcoholic", "alcohol-free",
  "без алкохол", "не искаме алкохол", "не искам алкохол",
];

const FAMILY_KEYWORDS = [
  "çocuk", "çocuklar", "çocuklarla", "aile", "ailece",
  "kids", "children", "family", "with kids", "with the kids",
  "деца", "дете", "семейство", "със семейството",
];

const SWEET_KEYWORDS = [
  "tatlı", "sadece tatlı", "sadece tatlı bir şey",
  "sweet", "dessert", "only sweet", "something sweet",
  "сладко", "десерт", "нещо сладко", "само нещо сладко",
  "sladko", "neshto sladko", // romanized fallback (no Cyrillic input)
];

const ADVENTUROUS_KEYWORDS = [
  "acı", "acılı", "farklı", "değişik", "baharatlı",
  "spicy", "adventurous", "different", "bold", "something new",
  "пикантно", "различно", "нещо ново", "лютиво",
];

const LIGHT_KEYWORDS = [
  "hafif", "midem ağır", "ağır olmasın", "hafif bir şey",
  "light", "not heavy", "something light", "fresh",
  "леко", "не тежко", "нещо леко", "свежо",
];

const CHEAP_KEYWORDS = [
  "param yok", "çok param yok", "ucuz", "ucuz bir şey", "bütçem az",
  "cheap", "budget", "limited money", "not much money", "inexpensive",
  "евтино", "малко пари", "нямам много пари", "ограничен бюджет",
];

function containsAny(haystack: string, needles: string[]): boolean {
  return needles.some((n) => haystack.includes(n));
}

export interface ClassifyModeInput {
  answers: WizardAnswers;
  freetext?: string;
  budgetEur?: number | null;
}

export function classifyCustomerMode(input: ClassifyModeInput): CustomerMode {
  const { answers } = input;
  const text = (input.freetext || "").toLowerCase();
  const budgetEur = input.budgetEur ?? null;

  const isSweetOnlyAnswer = answers.foodProtein === "sweet-only";
  const veryHungry = answers.hunger === "feast" || containsAny(text, VERY_HUNGRY_KEYWORDS);
  const hasAlcoholNegation = containsAny(text, ALCOHOL_NEGATION_KEYWORDS);
  const wantsBeer =
    !hasAlcoholNegation &&
    (answers.alcohol === "alcoholic" || containsAny(text, BEER_ALCOHOL_KEYWORDS));
  const wantsFamily = containsAny(text, FAMILY_KEYWORDS);
  const wantsSweet = isSweetOnlyAnswer || containsAny(text, SWEET_KEYWORDS);
  const wantsAdventurous = answers.mood === "adventurous" || containsAny(text, ADVENTUROUS_KEYWORDS);
  const wantsLight = answers.mood === "healthy" || containsAny(text, LIGHT_KEYWORDS);
  const wantsCheap = containsAny(text, CHEAP_KEYWORDS);
  const budgetIsLowMedium = budgetEur != null && budgetEur <= MEDIUM_BUDGET_MAX_EUR;
  // "sweet-only" means dessert-only, not a savory-meal signal — keep it out
  // of wantsFoodSignal so sweet_only classification isn't shadowed.
  const wantsFoodSignal =
    !isSweetOnlyAnswer &&
    answers.anchor !== "drink" &&
    (answers.anchor === "food" || answers.anchor === "both" || veryHungry || !!answers.hunger || !!answers.foodProtein);
  const wantsDrinkOnly = !wantsFoodSignal && (answers.anchor === "drink" || wantsBeer);

  // Priority order mirrors the spec's classification rules exactly.
  if (veryHungry && budgetEur != null && budgetIsLowMedium) return "very_hungry_low_budget";
  if (wantsBeer && (wantsFoodSignal || veryHungry)) return "beer_with_food";
  if (wantsDrinkOnly) return "drink_only";
  if (wantsSweet && !wantsFoodSignal) return "sweet_only";
  if (wantsFamily) return "family_safe";
  if (wantsAdventurous) return "adventurous";
  if (wantsLight) return "light_fresh";
  if (wantsCheap || (budgetEur != null && budgetIsLowMedium && !veryHungry)) return "budget_value";
  return "undecided";
}
