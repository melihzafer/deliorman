// Budget extraction from free-text wizard input.
//
// Pulls a numeric budget (in EUR) from phrases like:
//   "I have 10 euros"
//   "budget is 10 euro"
//   "20€"
//   "10.50 EUR"
//
// Menu prices are stored in Euro — Bulgaria's currency since it adopted the
// Euro — so the extracted value is used as-is, no currency conversion. The
// old Bulgarian lev (лв / лева / BGN) is no longer legal tender and is
// intentionally not recognised here.

import type { Locale } from "../masaTypes";

interface BudgetMatch {
  value: number;
  currency: "EUR";
  source: string;
}

// IMPORTANT: we deliberately do NOT use \b word boundaries. \b only recognises
// ASCII word characters, so it would fail to anchor after Cyrillic words like
// "евро". Instead we anchor with a non-currency-character lookbehind/lookahead
// using an explicit character class.
const PATTERNS: RegExp[] = [
  // 10 euros / 10 euro / 10 евро / 10 евра / 10 evro (common Balkan romanization)
  /(\d+(?:[.,]\d+)?)\s*(?:евро|евра|евp.?|euro?s?|evro)(?=$|[^\p{L}\p{N}])/giu,
  // 10€ or 10 € (with optional whitespace)
  /(\d+(?:[.,]\d+)?)\s*€/gu,
  // 10 EUR / 10 eur
  /(\d+(?:[.,]\d+)?)\s*(?:EUR|eur)(?=$|[^\p{L}\p{N}])/gu,
];

function parseNumber(raw: string): number {
  // Normalise "10,5" to 10.5
  return Number.parseFloat(raw.replace(",", "."));
}

export function parseBudget(input: string): BudgetMatch | null {
  if (!input || typeof input !== "string") return null;
  for (const regex of PATTERNS) {
    regex.lastIndex = 0;
    const m = regex.exec(input);
    if (m) {
      const n = parseNumber(m[1]);
      if (Number.isFinite(n) && n > 0) {
        return { value: n, currency: "EUR", source: m[0].trim() };
      }
    }
  }
  return null;
}

export function budgetInEur(input: string): number | null {
  return parseBudget(input)?.value ?? null;
}

export function budgetHint(input: string, locale: Locale): string | null {
  // Returns a localized hint like "Бюджет: 10 €" / "Bütçe: 10 €" / "Budget: €10"
  const eur = budgetInEur(input);
  if (eur == null) return null;
  const rounded = Math.round(eur * 100) / 100;
  if (locale === "bg") return `Бюджет: ${rounded} €`;
  if (locale === "tr") return `Bütçe: ${rounded} €`;
  return `Budget: €${rounded}`;
}
