// Optional semantic intent stage.
//
// This module is intentionally a stub right now. The lexicon stage in
// intentLexicon.ts covers >80% of free-text inputs we expect from a QR-menu
// context. When the lexicon is unsure, the router in intentRouter.ts will
// try this module — and currently receives null, falling back to the
// button flow.
//
// To enable semantic search:
//   1) `npm i @xenova/transformers`
//   2) Pre-compute item embeddings and bake them into public/data/menu.json
//      (use scripts/build-item-embeddings.mjs).
//   3) Replace `matchSemantic` below with a real implementation that:
//        - loads the MiniLM model on first use (lazy + cached in IndexedDB)
//        - embeds the user input
//        - computes cosine similarity against the pre-baked embeddings
//        - maps top-K items → wizard answers (via the inverse of the tag
//          map in menuTags.ts)
//        - returns the inferred answers and the source signals
//
// Keeping this as a stub means we don't pay a 25MB+ bundle cost on devices
// that don't need it. The wizard UI lets the user opt in.

import type { WizardAnswers } from "./types";

export interface SemanticResult {
  answers: WizardAnswers;
  coverage: number;
  signals: { dim: string; value: string; score: number }[];
}

export async function matchSemantic(_input: string): Promise<SemanticResult | null> {
  return null;
}
