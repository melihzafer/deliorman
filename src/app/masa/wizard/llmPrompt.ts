// Pure prompt builder for the wizard LLM.
//
// Produces the { system, user } messages sent to Groq. Pure & testable: no
// fetch, no env reads, no DOM. The route handler at /api/wizard/recommend
// builds a deterministic candidate shortlist first (candidates.ts) and only
// then calls this function — the LLM never sees the full menu, it reranks
// and explains a pre-filtered, pre-scored shortlist of 8-15 items.
//
// The LLM's role here is narrow on purpose: rerank among valid candidates,
// pick a human-feeling pairing, and write a short natural-language message.
// It does not own prices, budget validation, item existence, or fallback
// selection — recommendSchema.ts and budgetRepair.ts own those.

import type { CandidateItem } from "./candidates";
import type { CustomerMode, WizardAnswers } from "./types";
import type { Locale } from "../masaTypes";

export type PromptMode = "buttons" | "freetext";

const LOCALE_LABEL: Record<Locale, string> = {
  bg: "Bulgarian",
  tr: "Turkish",
  en: "English",
};

// ---------------------------------------------------------------------------
// System prompt — hard rules + tone rules + compact few-shot examples.
// Kept deliberately terse: max_completion_tokens is 450, so a bloated
// system prompt eats the model's own output budget.
// ---------------------------------------------------------------------------

const SYSTEM_TEMPLATE = `You are Taste Wizard, Deliorman restaurant's multilingual QR-menu assistant in Samuil, Bulgaria.
You are a practical restaurant waiter, not a generic chatbot. Recommend the best realistic choice using ONLY the "candidates" array below.
Reply in {{LOCALE_LABEL}} ({{LOCALE}}). All text, especially customerMessage, must be in {{LOCALE_LABEL}}.

Hard rules:
- Return JSON only. No markdown fences, no commentary, no preamble.
- Use only candidate item ids. Never invent items, prices, ingredients, categories, or availability.
- budget_eur is a hard cap (in Euro) on primaryItemId + drinkItemId + sideItemId combined. If the best combo exceeds it, drop items or pick a cheaper primary — you do not have to solve this perfectly, the server re-checks and repairs the budget after you answer.
- If the diner is very hungry (customer_mode = very_hungry_low_budget or hungry_normal), prioritize a filling primary item before any drink or side.
- Include alcohol only when it fits the budget and context; never push it aggressively.
- If customer_mode = drink_only, set primaryItemId to null, put the drink in drinkItemId, and only add a small snack to sideItemId if it clearly fits the budget. Never force a full meal.
- If customer_mode = sweet_only, recommend dessert or a sweet drink only — no grill, meat, salad, or beer.
- If customer_mode = family_safe, never pick an alcoholic item for any slot.
- Never shame a low-budget diner. Never say generic filler like "Based on your preferences".
- customerMessage must be a short, natural, spoken-sounding line, <= 280 characters.

Tone:
- Turkish: natural spoken Turkish. "Aga" is fine only if the diner's own text is casual. Avoid stiff phrases like "damak zevkinize hitap eder".
- Bulgarian: practical restaurant Bulgarian, e.g. "Ще те засити", "Най-смисленият избор".
- English: casual restaurant English, never "Based on your preferences".

Examples (adapt to the real candidates given, do not copy text verbatim):
1. "10 euro var, çok açım, bira istiyorum" -> filling food first; add beer only if it still fits; else explain gently that food is the smarter pick right now.
2. "sadece tatlı bir şey istiyorum" -> dessert or sweet drink only, nothing savory.
3. "çocuklarla geldik, alkol olmasın" -> no alcohol anywhere, familiar family-safe classics.
4. "değişik ve acılı bir şey öner" -> smoky, spicy, bold, or house-special pick.
5. "имам 8 евро, много гладен съм" -> best filling item within €8, skip extras that break budget.
6. "I want beer but need something cheap to eat" -> cheap filling food first, beer only if the total still fits.

Output strictly valid JSON matching the "schema" field in the user message.`;

// ---------------------------------------------------------------------------
// Prompt
// ---------------------------------------------------------------------------

export interface BuildPromptInput {
  locale: Locale;
  mode: PromptMode;
  answers: WizardAnswers;
  freetext?: string;
  budgetEur?: number | null;
  customerMode: CustomerMode;
  candidates: CandidateItem[];
}

export interface BuiltPrompt {
  system: string;
  user: string;
  candidateCount: number;
  approxInputTokens: number;
}

interface CandidatePromptEntry {
  id: string;
  name: string;
  price: number | null;
  categoryId: string;
  course: string;
  portion: string;
  tags: string[];
  valueScore: number;
}

function candidatesForPrompt(candidates: CandidateItem[], locale: Locale): CandidatePromptEntry[] {
  return candidates.map((c) => ({
    id: c.id,
    name: c.name[locale] || c.name.en || c.name.bg,
    price: c.price,
    categoryId: c.categoryId,
    course: c.course,
    portion: c.portion,
    tags: [
      ...c.tags.protein.map((p) => `protein:${p}`),
      ...c.tags.flavor.map((f) => `flavor:${f}`),
      ...c.tags.texture.map((t) => `texture:${t}`),
      ...c.tags.vibe.map((v) => `vibe:${v}`),
    ],
    valueScore: c.valueScore,
  }));
}

export function buildPrompt(input: BuildPromptInput): BuiltPrompt {
  const { locale, mode, answers, freetext, budgetEur, customerMode, candidates } = input;

  const system = SYSTEM_TEMPLATE.replaceAll("{{LOCALE}}", locale).replaceAll(
    "{{LOCALE_LABEL}}",
    LOCALE_LABEL[locale],
  );

  const userPayload: Record<string, unknown> = {
    locale,
    mode,
    customer_mode: customerMode,
    answers: Object.keys(answers).length > 0 ? answers : null,
    freetext: mode === "freetext" && freetext ? freetext : null,
    budget_eur: budgetEur ?? null,
    schema: {
      language: "'bg' | 'tr' | 'en'",
      primaryItemId: "string | null (candidate id)",
      drinkItemId: "string | null (candidate id)",
      sideItemId: "string | null (candidate id)",
      alternativeItemIds: "string[] (0-3 candidate ids, excluding the ids already used above)",
      budgetStatus:
        "'within_budget' | 'food_only_within_budget' | 'drink_only_within_budget' | 'over_budget_no_safe_combo'",
      totalEstimatedPrice: "number | null (sum of the prices you picked, in EUR)",
      confidence: "number 0-100",
      reasonKeys: `string[] (0-4, only from valid_reason_keys)`,
      customerMessage: "string, <= 280 chars, in " + LOCALE_LABEL[locale],
    },
    valid_reason_keys: [
      "filling",
      "budget_fit",
      "beer_pairing",
      "light",
      "sweet",
      "grilled",
      "classic",
      "adventurous",
      "family_safe",
      "good_value",
      "fresh",
      "spicy",
    ],
    candidates: candidatesForPrompt(candidates, locale),
  };

  const user = JSON.stringify(userPayload);
  const approxInputTokens = Math.ceil((system.length + user.length) / 4);

  return { system, user, candidateCount: candidates.length, approxInputTokens };
}
