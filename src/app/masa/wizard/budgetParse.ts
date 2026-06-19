// Budget extraction from free-text wizard input.
//
// Pulls a numeric budget (in BGN) from phrases like:
//   "I have 10 euros"
//   "budget is 30 лв"
//   "15 лева"
//   "20€"
//   "12 лв."
//   "30 leva" / "30 BGN" (rare but covered)
//
// The BGN menu prices are in BGN, so the function normalises euros to BGN
// using a fixed 1.95583 rate (the official peg). A future improvement is
// reading the rate from env — for now, hard-coded keeps this function pure
// and testable.

import type { Locale } from "../masaTypes";

const EUR_TO_BGN = 1.95583;

interface BudgetMatch {
  value: number;
  currency: "BGN" | "EUR";
  source: string;
}

// IMPORTANT: we deliberately do NOT use \b word boundaries. \b only recognises
// ASCII word characters, so it would fail to anchor after Cyrillic words like
// "лв". Instead we anchor with a non-currency-character lookbehind/lookahead
// using an explicit character class.
const PATTERNS: { regex: RegExp; currency: "BGN" | "EUR" }[] = [
  // 10 euros / 10 euro / 10 euros.
  { regex: /(\d+(?:[.,]\d+)?)\s*(?:евро|евра|евp.?|euro?s?)(?=$|[^\p{L}\p{N}])/giu, currency: "EUR" },
  // 10 лв / 10 лв. / 10 лева / 10 лев
  { regex: /(\d+(?:[.,]\d+)?)\s*(?:лв\.?|лева|лев)(?=$|[^\p{L}\p{N}])/giu, currency: "BGN" },
  // 10€ or 10 € (with optional whitespace)
  { regex: /(\d+(?:[.,]\d+)?)\s*€/gu, currency: "EUR" },
  // 10 BGN / 10 bgn / 10 leva (English) / 10 lev
  { regex: /(\d+(?:[.,]\d+)?)\s*(?:BGN|bgn|leva|lev)(?=$|[^\p{L}\p{N}])/giu, currency: "BGN" },
];

function parseNumber(raw: string): number {
  // Normalise "10,5" to 10.5
  return Number.parseFloat(raw.replace(",", "."));
}

export function parseBudget(input: string): BudgetMatch | null {
  if (!input || typeof input !== "string") return null;
  for (const { regex, currency } of PATTERNS) {
    regex.lastIndex = 0;
    const m = regex.exec(input);
    if (m) {
      const n = parseNumber(m[1]);
      if (Number.isFinite(n) && n > 0) {
        return { value: n, currency, source: m[0].trim() };
      }
    }
  }
  return null;
}

export function budgetInBGN(input: string): number | null {
  const hit = parseBudget(input);
  if (!hit) return null;
  return hit.currency === "EUR" ? hit.value * EUR_TO_BGN : hit.value;
}

export function budgetHint(input: string, locale: Locale): string | null {
  // Returns a localized hint like "10 BGN budget" / "10 лв бюджет" / "10 lira bütçe"
  const bgn = budgetInBGN(input);
  if (bgn == null) return null;
  const rounded = Math.round(bgn * 100) / 100;
  if (locale === "bg") return `Бюджет: ${rounded} лв`;
  if (locale === "tr") return `Bütçe: ${rounded} BGN`;
  return `Budget: ${rounded} BGN`;
}

export const _INTERNAL = { EUR_TO_BGN };
