// Deterministic candidate shortlist builder for the LLM recommendation
// pipeline.
//
// This is the core of the "code filters and scores first, LLM reranks only
// valid options" upgrade: instead of handing Groq the full ~184-item menu,
// we run the existing tag-based scorer (scoring.ts), apply a customerMode
// hard filter, layer a deterministic valueScore on top, and hand the LLM
// only the top 8-15 candidates. Every field the LLM needs to reason about
// budget (price, portion, course) travels with the candidate — the LLM
// never has to guess.

import type { Locale, QrMenuCategory } from "../masaTypes";
import { localized } from "../masaMenuUtils";
import { getItemTags } from "./menuTags";
import { scoreItems } from "./scoring";
import type { CustomerMode, ItemTags, WizardAnswers } from "./types";

export interface CandidateItem {
  id: string;
  name: { bg: string; tr: string; en: string };
  categoryId: string;
  price: number | null;
  currency: "EUR";
  course: ItemTags["course"];
  portion: ItemTags["portion"];
  tags: {
    protein: string[];
    flavor: string[];
    texture: string[];
    vibe: string[];
  };
  valueScore: number;
  isAlcoholic: boolean;
}

export interface BuildCandidatesInput {
  categories: QrMenuCategory[];
  answers: WizardAnswers;
  customerMode: CustomerMode;
  budgetEur?: number | null;
  freetext?: string;
  locale: Locale;
  limit?: number;
}

const DEFAULT_LIMIT = 12;
const MIN_LIMIT = 8;
const MAX_LIMIT = 15;

// ---------------------------------------------------------------------------
// customerMode hard filters — run AFTER the existing anchor filter inside
// scoreItems(). Each mode narrows the pool to items that could ever be a
// sane answer; valueScore (below) then ranks within that pool.
// ---------------------------------------------------------------------------

function passesModeFilter(tags: ItemTags, mode: CustomerMode): boolean {
  switch (mode) {
    case "sweet_only":
      return tags.course === "dessert" || (tags.course === "drink" && tags.flavors.includes("sweet"));
    case "drink_only":
      return (
        tags.course === "drink" ||
        tags.course === "starter" ||
        tags.course === "snack" ||
        tags.course === "side"
      );
    case "family_safe":
      return tags.state !== "alcoholic";
    default:
      return true;
  }
}

// ---------------------------------------------------------------------------
// valueScore — 0..1. Rewards filling portion, lower price relative to
// budget, main-course suitability, and protein/starch density. Penalizes
// dessert/drink-only/side-only picks when the diner is hungry, and
// expensive picks for a tight budget.
// ---------------------------------------------------------------------------

const HEARTY_PROTEINS = new Set(["meat", "poultry", "fish", "seafood"]);
const STARCH_PROTEINS = new Set(["grain", "legume"]);

function computeValueScore(
  price: number | null,
  tags: ItemTags,
  mode: CustomerMode,
  budgetEur: number | null,
): number {
  let v = 0.5;

  if (tags.portion === "meal") v += 0.15;
  else if (tags.portion === "feast") v += 0.1;
  else if (tags.portion === "snack") v -= 0.05;

  if (tags.course === "main") v += 0.15;
  if (HEARTY_PROTEINS.has(tags.protein)) v += 0.1;
  else if (STARCH_PROTEINS.has(tags.protein)) v += 0.05;

  if (price != null) {
    const referenceBudget = budgetEur ?? 10;
    const ratio = price / Math.max(1, referenceBudget);
    if (ratio <= 0.35) v += 0.15;
    else if (ratio <= 0.7) v += 0.08;
    else if (ratio > 1) v -= Math.min(0.3, 0.15 * (ratio - 1));
  }

  const isHungryFoodMode =
    mode === "very_hungry_low_budget" || mode === "hungry_normal" || mode === "beer_with_food";
  if (isHungryFoodMode) {
    if (tags.course === "dessert") v -= 0.3;
    if (tags.course === "drink") v -= 0.25;
    if ((tags.course === "side" || tags.course === "starter") && tags.portion === "snack") v -= 0.1;
  }
  if (mode === "drink_only" && tags.course !== "drink") v -= 0.1;
  if (mode === "budget_value" && price != null && price > (budgetEur ?? 15) * 0.6) v -= 0.1;

  return Math.max(0, Math.min(1, v));
}

// Squash the tag-match score (roughly -60..+120) into 0..1 so it can be
// blended with valueScore on the same scale.
function squash(score: number): number {
  return 1 / (1 + Math.exp(-score / 20));
}

export function buildCandidateShortlist(input: BuildCandidatesInput): CandidateItem[] {
  const { categories, answers, customerMode, locale, freetext } = input;
  const budgetEur = input.budgetEur ?? null;
  const limit = Math.max(MIN_LIMIT, Math.min(MAX_LIMIT, input.limit ?? DEFAULT_LIMIT));

  const scored = scoreItems(categories, answers, locale, freetext);
  if (scored.length === 0) return [];

  const ranked = scored
    .map((s) => {
      const tags = getItemTags(s.item.id);
      if (!passesModeFilter(tags, customerMode)) return null;
      const valueScore = computeValueScore(s.item.price, tags, customerMode, budgetEur);
      const rank = 0.55 * squash(s.score) + 0.45 * valueScore;
      return { scored: s, tags, valueScore, rank };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.rank - a.rank)
    .slice(0, limit);

  return ranked.map(({ scored: s, tags, valueScore }): CandidateItem => ({
    id: s.item.id,
    name: {
      bg: localized(s.item.title, "bg") || "",
      tr: localized(s.item.title, "tr") || "",
      en: localized(s.item.title, "en") || "",
    },
    categoryId: s.item.categoryId,
    price: s.item.price,
    currency: "EUR",
    course: tags.course,
    portion: tags.portion,
    tags: {
      protein: tags.protein === "none" ? [] : [tags.protein],
      flavor: tags.flavors,
      texture: tags.textures,
      vibe: [tags.vibe],
    },
    valueScore: Math.round(valueScore * 100) / 100,
    isAlcoholic: tags.state === "alcoholic",
  }));
}
