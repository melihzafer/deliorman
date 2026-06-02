// Multilingual lexicon-based NLU. Given a free-text user input, infer as
// many wizard answers as possible by matching tokens against the curated
// synonym table in lexicon.json. Works in Bulgarian, Turkish, and English
// simultaneously — no model download, runs in <5ms.
//
// This is the first stage of the two-stage intent pipeline. If the lexicon
// is unsure, the router falls back to the (lazy) semantic model.

import lexicon from "./lexicon.json";
import type { WizardAnswers } from "./types";

interface Lexicon {
  mood: Record<string, string[]>;
  anchor: Record<string, string[]>;
  food_protein: Record<string, string[]>;
  hunger: Record<string, string[]>;
  food_texture: Record<string, string[]>;
  drink_temp: Record<string, string[]>;
  alcohol: Record<string, string[]>;
  drink_profile: Record<string, string[]>;
}

const lex = lexicon as Lexicon;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return normalize(text).split(" ").filter(Boolean);
}

function scoreDimension(
  tokens: string[],
  synonyms: string[],
): number {
  // Multi-character phrase match: prefer whole-phrase hits over single-token hits.
  const norm = " " + tokens.join(" ") + " ";
  let score = 0;
  for (const syn of synonyms) {
    const s = syn.toLowerCase().trim();
    if (!s) continue;
    if (s.includes(" ")) {
      // phrase
      if (norm.includes(" " + s + " ") || norm.includes(" " + s) || norm.includes(s + " ")) {
        score += 3;
      }
    } else if (tokens.includes(s)) {
      score += 2;
    }
  }
  return score;
}

function bestFor(
  tokens: string[],
  dim: keyof Lexicon,
): { value: string; score: number } | null {
  let best: { value: string; score: number } | null = null;
  for (const [value, synonyms] of Object.entries(lex[dim])) {
    const s = scoreDimension(tokens, synonyms);
    if (s > 0 && (!best || s > best.score)) {
      best = { value, score: s };
    }
  }
  return best;
}

export interface LexiconParseResult {
  answers: WizardAnswers;
  signals: { dim: string; value: string; score: number }[];
  coverage: number; // 0..1 — how many wizard dimensions we got a signal for
}

export function parseWithLexicon(input: string): LexiconParseResult {
  const tokens = tokenize(input);
  if (tokens.length === 0) {
    return { answers: {}, signals: [], coverage: 0 };
  }
  const out: WizardAnswers = {};
  const signals: { dim: string; value: string; score: number }[] = [];
  const DIM_KEYS: { dim: keyof Lexicon; field: keyof WizardAnswers }[] = [
    { dim: "mood", field: "mood" },
    { dim: "anchor", field: "anchor" },
    { dim: "food_protein", field: "foodProtein" },
    { dim: "hunger", field: "hunger" },
    { dim: "food_texture", field: "foodTexture" },
    { dim: "drink_temp", field: "drinkTemp" },
    { dim: "alcohol", field: "alcohol" },
    { dim: "drink_profile", field: "drinkProfile" },
  ];
  for (const { dim, field } of DIM_KEYS) {
    const hit = bestFor(tokens, dim);
    if (hit) {
      out[field] = hit.value as never;
      signals.push({ dim, value: hit.value, score: hit.score });
    }
  }
  const coverage = signals.length / DIM_KEYS.length;
  return { answers: out, signals, coverage };
}
