// Rationale generator: turns the tag-driven "matchReasons" from the scoring
// engine into a one-line sentence in the user's locale, plus a structured
// set of reasons for the UI to display.

import type { Locale } from "../masaTypes";
import { t } from "../masaTranslations";
import { localized } from "../masaMenuUtils";
import type { ScoredItem, WizardAnswers } from "./types";
import { getItemTags } from "./menuTags";

const REASON_TRANSLATION_KEYS: Record<string, string> = {
  "vibe:comfort": "rv_comfort",
  "vibe:traditional-bg": "rv_traditional",
  "vibe:light": "rv_light",
  "vibe:modern": "rv_modern",
  "vibe:indulgent": "rv_indulgent",
  "vibe:celebratory": "rv_celebratory",
  "vibe:adventurous": "rv_adventurous",
  "flavor:fresh": "rf_fresh",
  "flavor:spicy": "rf_spicy",
  "flavor:smoky": "rf_smoky",
  "flavor:sweet": "rf_sweet",
  "flavor:savory": "rf_savory",
  "flavor:umami": "rf_umami",
  "flavor:bitter": "rf_bitter",
  "flavor:fruity": "rf_fruity",
  "flavor:tart": "rf_tart",
  "texture:grilled": "rt_grilled",
  "texture:fried": "rt_fried",
  "texture:baked": "rt_baked",
  "texture:creamy": "rt_creamy",
  "texture:crispy": "rt_crispy",
  "texture:raw": "rt_raw",
  "texture:chewy": "rt_chewy",
  "texture:smooth": "rt_smooth",
  "temp:hot": "rte_hot",
  "temp:cold": "rte_cold",
  "temp:room": "rte_room",
  "protein:meat": "rp_meat",
  "protein:poultry": "rp_poultry",
  "protein:fish": "rp_fish",
  "protein:seafood": "rp_seafood",
  "protein:dairy": "rp_dairy",
  "protein:vegetable": "rp_vegetable",
  "protein:grain": "rp_grain",
  "protein:fruit": "rp_fruit",
  "protein:mixed": "rp_mixed",
  "protein:legume": "rp_legume",
  "protein:vegetarian": "rp_vegetarian",
  "portion:snack": "rpo_snack",
  "portion:meal": "rpo_meal",
  "portion:feast": "rpo_feast",
  "profile:caffeine": "rpr_caffeine",
  "profile:fruity": "rpr_fruity",
  "profile:herbal": "rpr_herbal",
  "profile:malty": "rpr_malty",
  "profile:hoppy": "rpr_hoppy",
  "profile:wine": "rpr_wine",
  "profile:spirit": "rpr_spirit",
  "state:alcoholic": "rs_alcoholic",
  "state:non-alcoholic": "rs_non_alcoholic",
};

export interface Rationale {
  headline: string; // i18n key prefix
  reasons: string[]; // translated short reasons to display as chips
  sentence: string; // one-sentence rationale in user's locale
}

export function explainMatch(item: ScoredItem, answers: WizardAnswers, locale: Locale): Rationale {
  const tags = getItemTags(item.item.id);
  const chips: string[] = [];
  for (const reason of item.matchReasons) {
    const k = REASON_TRANSLATION_KEYS[reason];
    if (k) chips.push(t(locale, k as Parameters<typeof t>[1]));
  }
  // Always include a flavor chip
  if (chips.length === 0) {
    if (tags.flavors.length > 0) {
      const f = tags.flavors[0];
      const k = REASON_TRANSLATION_KEYS[`flavor:${f}`];
      if (k) chips.push(t(locale, k as Parameters<typeof t>[1]));
    }
  }

  // Sentence: "{item} — {reason1}, {reason2}"
  const itemName = localized(item.item.title, locale);
  const sentenceParts: string[] = [];
  if (chips.length > 0) sentenceParts.push(chips.slice(0, 3).join(", "));
  if (answers.mood) {
    const moodKey = `rm_${answers.mood}` as Parameters<typeof t>[1];
    sentenceParts.push(t(locale, moodKey));
  }
  const sentence = sentenceParts.length > 0
    ? t(locale, "r_full_pattern").replace("{item}", itemName).replace("{reasons}", sentenceParts.join(" · "))
    : itemName;

  return {
    headline: item.rationaleKey,
    reasons: chips,
    sentence,
  };
}
