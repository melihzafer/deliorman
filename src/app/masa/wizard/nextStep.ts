// Adaptive state machine for the Taste Wizard.
//
// The old wizard forced every user through 6 linear questions. This state
// machine asks between 3 and 5 questions, branching dynamically:
//   - After "Mood + Anchor" we already know whether the user wants food,
//     drink, or both.
//   - For food: we ask Protein, then Hunger. Texture is only asked when the
//     top items after those two questions are still ambiguous (handled by
//     the UI via the confidence check in scoring.ts).
//   - For drink: we ask Temp, then Alcohol. Profile is only asked when the
//     top items are still ambiguous.
//   - For "both" we ask the food path with a slightly shorter Hunger step,
//     then the drink path.
//
// nextStep() is a pure function — given the current step and the answers
// collected so far, it returns the next step or "spinning" if the quiz is
// complete.

import type { WizardAnswers, WizardStep } from "./types";

export function nextStep(current: WizardStep, answers: WizardAnswers): WizardStep {
  if (current === "intro") {
    // The first question is always Mood, since it sets the vibe for everything
    // downstream and gives the engine a strong initial signal.
    return "q_mood";
  }
  if (current === "q_mood") {
    return "q_anchor";
  }
  if (current === "q_anchor") {
    const anchor = answers.anchor ?? "food";
    if (anchor === "drink") return "q_drink_temp";
    return "q_food_protein";
  }
  if (current === "q_food_protein") {
    // Sweet-only skips hunger (desserts are never "feast" sized)
    if (answers.foodProtein === "sweet-only") return "spinning";
    return "q_food_hunger";
  }
  if (current === "q_food_hunger") {
    // We let the UI decide whether to ask texture; from the state-machine
    // perspective the quiz can stop here. The UI adds a texture question
    // only when the confidence from scoring.ts is low.
    return "spinning";
  }
  if (current === "q_food_texture") {
    return "spinning";
  }
  if (current === "q_drink_temp") {
    return "q_drink_alcohol";
  }
  if (current === "q_drink_alcohol") {
    // If user picked non-alcoholic, profile matters (what kind of NA drink).
    // If user picked alcoholic, profile still matters (beer vs wine vs spirit).
    return "q_drink_profile";
  }
  if (current === "q_drink_profile") {
    return "spinning";
  }
  return "spinning";
}

// Returns the total question count the user will see in the happy path
// (texture/profile are only asked when needed — this is the minimum).
export function minQuestionsFor(answers: WizardAnswers): number {
  const base = 2; // mood + anchor
  const anchor = answers.anchor ?? "food";
  if (anchor === "drink") return base + 2; // + temp + alcohol (+ optional profile)
  if (anchor === "both") return base + 2 + 2; // food(2) + drink(2)
  // food
  if (answers.foodProtein === "sweet-only") return base + 1; // mood + anchor + protein
  return base + 2; // mood + anchor + protein + hunger
}

// Returns the question number we are on (1-indexed) — used for "Question 2 of 4"
export function questionNumber(current: WizardStep, answers: WizardAnswers): { current: number; total: number } {
  const order: WizardStep[] = ["intro", "q_mood", "q_anchor"];
  const anchor = answers.anchor ?? "food";
  if (anchor === "drink") order.push("q_drink_temp", "q_drink_alcohol", "q_drink_profile");
  else if (anchor === "both") order.push("q_food_protein", "q_food_hunger", "q_drink_temp", "q_drink_alcohol");
  else if (answers.foodProtein === "sweet-only") order.push("q_food_protein");
  else order.push("q_food_protein", "q_food_hunger", "q_food_texture");
  const idx = order.indexOf(current);
  if (idx < 0) return { current: 1, total: order.length };
  return { current: idx, total: order.length };
}
