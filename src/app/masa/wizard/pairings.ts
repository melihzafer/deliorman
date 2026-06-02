// Combo pairing logic for the Taste Wizard.
//
// Given the main recommendation, suggest a side and a drink that match.
// Pairings are tag-driven: a savory grilled main pairs with a fresh cold
// drink; a dessert pairs with a hot coffee-style drink; a fish pairs with
// a white wine or light beer; etc.

import type { QrMenuCategory, QrMenuItem } from "../masaTypes";
import { getItemTags } from "./menuTags";
import type { ItemTags } from "./types";
import { isDrinkCategory } from "./types";

export interface PairingPick {
  item: QrMenuItem & { categoryId: string };
  reasonKey: string; // translation key
}

function flatten(categories: QrMenuCategory[]): Array<QrMenuItem & { categoryId: string }> {
  return categories.flatMap((cat) => cat.items.map((it) => ({ ...it, categoryId: cat.id })));
}

function byCategory(pool: Array<QrMenuItem & { categoryId: string }>, catId: string) {
  return pool.filter((it) => it.categoryId === catId);
}

function pickRandom<T>(arr: T[]): T | null {
  if (arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

function bestDrinkForFood(main: QrMenuItem & { categoryId: string }, drinks: Array<QrMenuItem & { categoryId: string }>): PairingPick | null {
  if (drinks.length === 0) return null;
  const mainTags = getItemTags(main.id);
  const ranked = drinks
    .map((d) => {
      const t = getItemTags(d.id);
      let s = 0;
      // Grilled/BBQ → beer
      if ((mainTags.flavors.includes("smoky") || mainTags.textures.includes("grilled")) && t.profile === "malty") s += 8;
      // Fish/seafood → white wine
      if ((mainTags.protein === "fish" || mainTags.protein === "seafood") && t.profile === "wine" && t.flavors.includes("fruity")) s += 10;
      // Spicy / heavy meat → red wine
      if ((mainTags.flavors.includes("spicy") || mainTags.vibe === "indulgent") && t.profile === "wine" && t.flavors.includes("umami")) s += 6;
      // Pizza / burger → beer or cola-style
      if ((mainTags.course === "main" && (main.categoryId === "pizzas" || main.categoryId === "burgers")) && t.profile === "malty") s += 5;
      // Salad / light → white wine or fresh
      if (mainTags.vibe === "light" || mainTags.course === "starter") {
        if (t.profile === "wine" && t.flavors.includes("fruity")) s += 7;
        if (t.profile === "fruity") s += 4;
      }
      // Heavy / celebratory → spirit or rakia
      if (mainTags.vibe === "celebratory" && t.profile === "spirit" && d.categoryId === "rakia") s += 4;
      return { item: d, score: s };
    })
    .sort((a, b) => b.score - a.score);
  const top = ranked[0];
  if (!top) return null;
  if (top.score > 0) {
    return { item: top.item, reasonKey: "pair_drink_match" };
  }
  // Default: a cold non-alcoholic if nothing matched
  const fallback = drinks.find((d) => d.categoryId === "beer-cider-other-drinks" && getItemTags(d.id).state === "non-alcoholic") || pickRandom(drinks);
  return fallback ? { item: fallback, reasonKey: "pair_drink_default" } : null;
}

function bestDrinkForDrink(main: QrMenuItem & { categoryId: string }, foods: Array<QrMenuItem & { categoryId: string }>): PairingPick | null {
  // For drinks we suggest a snack/side that pairs well.
  if (foods.length === 0) return null;
  const mainTags = getItemTags(main.id);
  const appetizers = byCategory(foods, "hot-appetizers");
  const sides = byCategory(foods, "cold-appetizers-sides");
  const salads = byCategory(foods, "salads");
  const desserts = byCategory(foods, "nuts-desserts");

  if (mainTags.course === "drink" && mainTags.profile === "caffeine" && mainTags.temp === "hot") {
    // Coffee → dessert
    const d = pickRandom(desserts) || pickRandom(nutsDessertsAny(foods)) || pickRandom(sides);
    if (d) return { item: d, reasonKey: "pair_dessert" };
  }
  if (mainTags.profile === "malty" || mainTags.profile === "hoppy" || mainTags.profile === "wine") {
    // Beer / wine → snack or salad
    const snack = pickRandom(appetizers) || pickRandom(salads) || pickRandom(sides);
    if (snack) return { item: snack, reasonKey: "pair_snack" };
  }
  if (mainTags.profile === "spirit" || main.categoryId === "rakia") {
    const snack = pickRandom(appetizers) || pickRandom(sides) || pickRandom(salads);
    if (snack) return { item: snack, reasonKey: "pair_rakia" };
  }
  if (mainTags.profile === "fruity" || mainTags.profile === "herbal") {
    const snack = pickRandom(desserts) || pickRandom(sides) || pickRandom(salads);
    if (snack) return { item: snack, reasonKey: "pair_light" };
  }
  // default
  const fallback = pickRandom(appetizers) || pickRandom(salads) || pickRandom(desserts);
  return fallback ? { item: fallback, reasonKey: "pair_default" } : null;
}

function nutsDessertsAny(foods: Array<QrMenuItem & { categoryId: string }>) {
  return byCategory(foods, "nuts-desserts");
}

function bestSideForFood(main: QrMenuItem & { categoryId: string }, sides: Array<QrMenuItem & { categoryId: string }>): PairingPick | null {
  if (sides.length === 0) return null;
  const mainTags = getItemTags(main.id);
  const fries = sides.find((s) => s.id.includes("parzheni-kartofi"));
  const garlicBread = sides.find((s) => s.id.includes("gratska-chesnova-pitka") || s.id.includes("gratska-pitka"));
  const saladSides = sides.filter((s) => s.categoryId === "cold-appetizers-sides" && s.id.includes("studena-garnitura") || s.id.includes("topla-garnitura"));

  if (mainTags.course === "main" && (mainTags.textures.includes("grilled") || mainTags.vibe === "indulgent")) {
    if (fries) return { item: fries, reasonKey: "pair_fries" };
  }
  if (mainTags.course === "main" && (mainTags.vibe === "comfort" || mainTags.vibe === "traditional-bg")) {
    if (garlicBread) return { item: garlicBread, reasonKey: "pair_bread" };
  }
  if (mainTags.vibe === "light" || mainTags.flavors.includes("fresh")) {
    const fresh = pickRandom(saladSides);
    if (fresh) return { item: fresh, reasonKey: "pair_fresh_side" };
  }
  // default: any random side
  const fallback = pickRandom(sides);
  return fallback ? { item: fallback, reasonKey: "pair_side_default" } : null;
}

export interface ComboResult {
  side: PairingPick | null;
  drink: PairingPick | null;
}

export function buildCombo(
  main: QrMenuItem & { categoryId: string },
  categories: QrMenuCategory[],
): ComboResult {
  const all = flatten(categories);
  const isDrink = isDrinkCategory(main.categoryId);
  if (isDrink) {
    const foods = all.filter((it) => !isDrinkCategory(it.categoryId) && it.categoryId !== "allergens");
    return { side: bestDrinkForDrink(main, foods), drink: null };
  }
  const drinks = all.filter((it) => isDrinkCategory(it.categoryId));
  const sides = all.filter(
    (it) =>
      it.categoryId === "hot-appetizers" ||
      it.categoryId === "cold-appetizers-sides" ||
      it.categoryId === "salads",
  );
  return {
    side: bestSideForFood(main, sides),
    drink: bestDrinkForFood(main, drinks),
  };
}
