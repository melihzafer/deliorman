// Two-stage intent router. Stage 1: multilingual lexicon (always runs,
// works on every device). Stage 2: lazy ONNX semantic model — only loaded
// if the lexicon produces <2 signals, and only if the user opts in.
//
// We intentionally do NOT bundle a model in this PR. The semantic stage is
// wired up but disabled by default. Adding the model later is a 1-line
// change in intentSemantic.ts — drop in the @xenova/transformers pipeline
// and the wizard stays compatible.

import { parseWithLexicon } from "./intentLexicon";
import type { WizardAnswers } from "./types";

export interface IntentResult {
  answers: WizardAnswers;
  coverage: number;
  source: "lexicon" | "semantic" | "buttons-only" | "fallback";
  signals: { dim: string; value: string; score: number }[];
}

export interface IntentInput {
  text: string;
  /** If true, allow the (lazy, optional) semantic model to run. */
  enableSemantic?: boolean;
}

export async function inferIntent(input: IntentInput): Promise<IntentResult> {
  const text = (input.text || "").trim();
  if (!text) {
    return { answers: {}, coverage: 0, source: "buttons-only", signals: [] };
  }

  const lex = parseWithLexicon(text);
  // Strong signal: 2+ dimensions covered. Done.
  if (lex.coverage >= 0.25) {
    return { answers: lex.answers, coverage: lex.coverage, source: "lexicon", signals: lex.signals };
  }

  // Optional semantic stage — only if the caller opts in and the module
  // exposes a non-stub implementation. The stub returns null so the wizard
  // always falls back to buttons when no model is wired up.
  if (input.enableSemantic) {
    try {
      const sem = await import("./intentSemantic");
      const result = await sem.matchSemantic(text);
      if (result) {
        return { answers: result.answers, coverage: result.coverage, source: "semantic", signals: result.signals };
      }
    } catch (err) {
      // Network or model load failure — silently fall through.
    }
  }

  // Lexicon partial — return what we got, UI shows a "did you mean?" hint
  if (lex.coverage > 0) {
    return { answers: lex.answers, coverage: lex.coverage, source: "fallback", signals: lex.signals };
  }
  return { answers: {}, coverage: 0, source: "buttons-only", signals: [] };
}
