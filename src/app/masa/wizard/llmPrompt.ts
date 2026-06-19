// Pure prompt builder for the wizard LLM.
//
// Produces the { system, user } messages we send to Groq. Pure & testable:
// no fetch, no env reads, no DOM. The route handler at /api/wizard/recommend
// reads GROQ_API_KEY / GROQ_MODEL and POSTs the result of this function.
//
// Menu compaction: we never send the full QrMenuCategory tree. We send a
// flat list of {id, name, price, categoryId, tags} so the LLM can reason
// about 184 items in ~9-12K tokens. Tags are the same tags the local
// scoring engine uses — single source of truth.
//
// All three locales (bg, tr, en) live in the menu object; we only ship the
// requested locale's name to the prompt to save tokens. The route reads
// `categoryId` from the LLM response (which IS in the compacted menu) and
// resolves the real item client-side.

import type { Locale, QrMenuCategory, QrMenuItem } from "../masaTypes";
import { localized } from "../masaMenuUtils";
import { getItemTags } from "./menuTags";
import type { WizardAnswers } from "./types";

export type PromptMode = "buttons" | "freetext";

export interface CompactionEntry {
  id: string;
  name: string;
  price: number | null;
  categoryId: string;
  tags: string[]; // e.g. ["vibe:comfort", "flavor:spicy"]
}

const TAG_FIELDS: Array<keyof ReturnType<typeof getItemTags>> = [
  "vibe",
  "flavors",
  "textures",
  "temp",
  "state",
  "profile",
  "portion",
  "course",
  "protein",
];

function tagListForItem(item: QrMenuItem): string[] {
  const t = getItemTags(item.id);
  const out: string[] = [];
  for (const field of TAG_FIELDS) {
    const v = t[field];
    if (Array.isArray(v)) {
      for (const x of v) out.push(`${String(field)}:${x}`);
    } else if (typeof v === "string") {
      // skip "na" tokens to save tokens
      if (v !== "na" && v !== "none") out.push(`${String(field)}:${v}`);
    }
  }
  return out;
}

export function compactMenu(categories: QrMenuCategory[], locale: Locale): CompactionEntry[] {
  const out: CompactionEntry[] = [];
  for (const cat of categories) {
    for (const item of cat.items) {
      const name = localized(item.title, locale);
      if (!name) continue; // skip untranslated items
      out.push({
        id: item.id,
        name,
        price: item.price,
        categoryId: cat.id,
        tags: tagListForItem(item),
      });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Prompt
// ---------------------------------------------------------------------------

export interface BuildPromptInput {
  locale: Locale;
  mode: PromptMode;
  answers: WizardAnswers;
  freetext?: string;
  budgetBgn?: number | null;
  menu: QrMenuCategory[];
}

export interface BuiltPrompt {
  system: string;
  user: string;
  menuSize: number;
  approxInputTokens: number;
}

const SYSTEM_TEMPLATE = `You are the Deliorman restaurant taste-wizard in Samuil, Bulgaria.
You recommend menu items and pairings based on diner answers or free-text queries.
Your output language is {{LOCALE_LABEL}} ({{LOCALE}}). All text fields — especially "rationale" — must be in {{LOCALE_LABEL}}.

Strict rules:
- Use ONLY item ids from the provided "menu" array. Never invent ids.
- Respect "budget_bgn" (BGN) if present — the main pick's price MUST be <= budget_bgn.
- matchReasons must be valid tag values that exist on the chosen item in the menu. Prefer the tags already listed for that item.
- combo.side and combo.drink are optional. Pick items that genuinely pair with main. If unsure, set them to null.
- If the user query is ambiguous and no good match exists, set main to null.
- Output strictly valid JSON matching the schema in the user message. No markdown fences, no commentary, no preamble.
- Provide exactly 1 main + 0-3 alternatives + 0-1 combo.side + 0-1 combo.drink + 1 short rationale (<= 240 chars).`;

const LOCALE_LABEL: Record<Locale, string> = {
  bg: "Bulgarian",
  tr: "Turkish",
  en: "English",
};

export function buildPrompt(input: BuildPromptInput): BuiltPrompt {
  const { locale, mode, answers, freetext, budgetBgn, menu } = input;
  const compacted = compactMenu(menu, locale);

  const system = SYSTEM_TEMPLATE
    .replaceAll("{{LOCALE}}", locale)
    .replaceAll("{{LOCALE_LABEL}}", LOCALE_LABEL[locale]);

  // Always include the schema in the user message — the model is good at
  // producing JSON, but only when the schema is unambiguous.
  const userPayload: Record<string, unknown> = {
    locale,
    mode,
    answers: Object.keys(answers).length > 0 ? answers : null,
    freetext: mode === "freetext" && freetext ? freetext : null,
    budget_bgn: budgetBgn ?? null,
    schema: {
      main: { id: "string (must exist in menu)", matchReasons: "string[] (valid tag values)" },
      alternatives: "{id, matchReasons}[] (0-3 entries, ids from menu)",
      combo: {
        side: "{id, reasonKey: 'pair_* key'} | null",
        drink: "{id, reasonKey: 'pair_* key'} | null",
      },
      rationale: "string in " + LOCALE_LABEL[locale] + ", <= 240 chars",
    },
    valid_reason_keys: [
      "pair_fries", "pair_bread", "pair_fresh_side", "pair_side_default",
      "pair_drink_match", "pair_drink_default", "pair_dessert", "pair_snack",
      "pair_rakia", "pair_light", "pair_default",
    ],
    menu: compacted,
  };

  const user = JSON.stringify(userPayload);
  // Rough token estimate: ~4 chars/token for English; Bulgarian ~3 chars/token.
  const approxInputTokens = Math.ceil((system.length + user.length) / 4);

  return { system, user, menuSize: compacted.length, approxInputTokens };
}
