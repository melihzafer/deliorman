"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, X, RotateCcw, ArrowLeft, Wand2, MessageSquare } from "lucide-react";
import { formatPrice, localized } from "./masaMenuUtils";
import { t } from "./masaTranslations";
import type { Locale, MasaStyles, QrMenuCategory } from "./masaTypes";
import { playClick } from "./masaAudioUtils";
import { pickRecommendation, getSurprisePick, type WizardPick } from "./wizard/scoring";
import { nextStep, questionNumber } from "./wizard/nextStep";
import { buildCombo, type PairingPick } from "./wizard/pairings";
import { explainMatch } from "./wizard/rationale";
import { inferIntent } from "./wizard/intentRouter";
import { parseWithLexicon } from "./wizard/intentLexicon";
import { budgetInEur, parseBudget } from "./wizard/budgetParse";
import { recommend, type WizardPickFromLlm } from "./wizard/llmRecommend";
import { getItemTags } from "./wizard/menuTags";
import { isDrinkCategory, type BudgetStatus, type ScoredItem, type WizardAnswers, type WizardStep } from "./wizard/types";

interface MasaTasteWizardProps {
  categories: QrMenuCategory[];
  activeCategory: QrMenuCategory | undefined;
  currency: string;
  locale: Locale;
  onClose: () => void;
  styles: MasaStyles;
  soundEnabled?: boolean;
  /** QR session token. Used by the LLM proxy as a soft auth gate. */
  sessionToken?: string;
}

const STORAGE_KEY = "masa_wizard_history_v2";
const WIZARD_DEBUG = process.env.NODE_ENV !== "production";
const SPINNER_MIN_MS = 900;
const CLIENT_LLM_TIMEOUT_MS = 6000;

const WIZARD_COPY = {
  en: {
    tabs: { quiz: "Quick Quiz", text: "Tell the Wizard" },
    headerKicker: "AI WAITER",
    assistantName: "Deliorman Wizard",
    assistantStatus: "Listening for budget, hunger and cravings",
    freeTitle: "Tell us what you feel like.",
    freeSubtitle: "Mention budget, hunger, drink, mood, or anything you crave.",
    placeholders: [
      "I have 10 euros, I'm very hungry and I want a beer.",
      "Something spicy, grilled, and not too expensive.",
      "Light food, no alcohol, with something cold.",
    ],
    chips: [
      { key: "budget_hungry", label: "€10 + very hungry", sentence: "I have 10 euros, I'm very hungry and want filling food first." },
      { key: "beer_grill", label: "Beer + grilled food", sentence: "I want a beer with grilled food, but keep the combo sensible." },
      { key: "light_fresh", label: "Light and fresh", sentence: "Light food, no alcohol, with something cold." },
      { key: "spicy", label: "Spicy choice", sentence: "Something spicy, grilled, and not too expensive." },
      { key: "sweet", label: "Sweet only", sentence: "I only want something sweet." },
      { key: "no_alcohol", label: "No alcohol", sentence: "No alcohol, just a good food and drink match." },
    ],
    submit: "Find my pick",
    loading: "Finding your best match...",
    clear: "Clear",
    tryAnother: "Try another",
    understood: "Understood:",
    matched: "Matched:",
    tip: "Tip: Try adding your budget or hunger level.",
    budget: "budget",
    veryHungry: "very hungry",
    hungry: "hungry",
    wantsBeer: "wants beer",
    noAlcohol: "no alcohol",
    sweetOnly: "sweet only",
    spicy: "spicy",
    grilled: "grilled",
    light: "light",
    fresh: "fresh",
    language: { en: "English", tr: "Turkish", bg: "Bulgarian" },
    subtitles: {
      smartPick: "SMART PICK",
      underBudget: "UNDER YOUR BUDGET",
      foodDrink: "FOOD + DRINK",
      quickMatch: "QUICK MATCH",
      filling: "FILLING CHOICE",
    },
    total: "Total",
    remaining: "left",
    foodOnlyBudget: "Skipped the drink or side to keep the meal inside your budget.",
    alt: { cheaper: "Cheaper", filling: "More filling", noAlcohol: "Without alcohol", spicy: "Spicier", lighter: "Lighter" },
  },
  tr: {
    tabs: { quiz: "Kısa Test", text: "Dileğini Yaz" },
    headerKicker: "AI GARSON",
    assistantName: "Deliorman Sihirbazı",
    assistantStatus: "Bütçe, açlık ve canının çektiğini dinliyor",
    freeTitle: "Ne istediğini tek cümleyle yaz.",
    freeSubtitle: "Bütçe, açlık, içecek veya canının çektiği şeyi yazabilirsin.",
    placeholders: [
      "10 euro var, çok açım ve bira istiyorum.",
      "Acılı, ızgara ve çok pahalı olmayan bir şey.",
      "Hafif bir yemek olsun, alkol olmasın.",
    ],
    chips: [
      { key: "budget_hungry", label: "10€ + çok açım", sentence: "10 euro var, çok açım ve önce doyurucu yemek istiyorum." },
      { key: "beer_grill", label: "Bira + ızgara", sentence: "Bira istiyorum, yanında ızgara bir yemek iyi olur." },
      { key: "light_fresh", label: "Hafif ve ferah", sentence: "Hafif ve ferah bir yemek olsun, alkol olmasın." },
      { key: "spicy", label: "Acılı bir şey", sentence: "Acılı, ızgara ve çok pahalı olmayan bir şey istiyorum." },
      { key: "sweet", label: "Sadece tatlı", sentence: "Sadece tatlı bir şey istiyorum." },
      { key: "no_alcohol", label: "Alkol olmasın", sentence: "Alkol olmasın, iyi bir yemek ve içecek eşleşmesi olsun." },
    ],
    submit: "Bana öner",
    loading: "En iyi seçimi buluyorum...",
    clear: "Temizle",
    tryAnother: "Başka öner",
    understood: "Anladım:",
    matched: "Eşleşti:",
    tip: "İpucu: Bütçeni veya ne kadar aç olduğunu yaz.",
    budget: "bütçe",
    veryHungry: "çok aç",
    hungry: "aç",
    wantsBeer: "bira istiyor",
    noAlcohol: "alkol istemiyor",
    sweetOnly: "sadece tatlı",
    spicy: "acılı",
    grilled: "ızgara",
    light: "hafif",
    fresh: "ferah",
    language: { en: "İngilizce", tr: "Türkçe", bg: "Bulgarca" },
    subtitles: {
      smartPick: "AKILLI SEÇİM",
      underBudget: "BÜTÇEYE UYGUN",
      foodDrink: "YEMEK + İÇECEK",
      quickMatch: "HIZLI EŞLEŞME",
      filling: "DOYURUCU SEÇİM",
    },
    total: "Toplam",
    remaining: "kaldı",
    foodOnlyBudget: "Bütçeyi aşmamak için içecek veya yan ürünü çıkardım.",
    alt: { cheaper: "Daha ucuz", filling: "Daha doyurucu", noAlcohol: "Alkolsüz", spicy: "Daha acılı", lighter: "Daha hafif" },
  },
  bg: {
    tabs: { quiz: "Бърз тест", text: "Напиши желание" },
    headerKicker: "AI СЕРВИТЬОР",
    assistantName: "Вълшебникът на Делиорман",
    assistantStatus: "Разбира бюджет, глад и вкус",
    freeTitle: "Напиши какво ти се хапва.",
    freeSubtitle: "Можеш да споменеш бюджет, глад, напитка или вкус.",
    placeholders: [
      "Имам 15 €, много съм гладен и искам бира.",
      "Нещо пикантно, скара и не много скъпо.",
      "Леко хапване, без алкохол, с нещо студено.",
    ],
    chips: [
      { key: "budget_hungry", label: "€15 + много гладен", sentence: "Имам 15 €, много съм гладен и искам нещо засищащо." },
      { key: "beer_grill", label: "Бира + скара", sentence: "Искам бира със скара, но да е разумно като цена." },
      { key: "light_fresh", label: "Леко и свежо", sentence: "Леко хапване, без алкохол, с нещо студено." },
      { key: "spicy", label: "Пикантно", sentence: "Нещо пикантно, скара и не много скъпо." },
      { key: "sweet", label: "Само сладко", sentence: "Искам само нещо сладко." },
      { key: "no_alcohol", label: "Без алкохол", sentence: "Без алкохол, само добра комбинация храна и напитка." },
    ],
    submit: "Препоръчай ми",
    loading: "Търся най-добрия избор...",
    clear: "Изчисти",
    tryAnother: "Друга препоръка",
    understood: "Разбрах:",
    matched: "Съвпадение:",
    tip: "Съвет: добави бюджет или колко си гладен.",
    budget: "бюджет",
    veryHungry: "много гладен",
    hungry: "гладен",
    wantsBeer: "иска бира",
    noAlcohol: "без алкохол",
    sweetOnly: "само сладко",
    spicy: "пикантно",
    grilled: "скара",
    light: "леко",
    fresh: "свежо",
    language: { en: "английски", tr: "турски", bg: "български" },
    subtitles: {
      smartPick: "УМЕН ИЗБОР",
      underBudget: "В БЮДЖЕТА",
      foodDrink: "ХРАНА + НАПИТКА",
      quickMatch: "БЪРЗО СЪВПАДЕНИЕ",
      filling: "ЗАСИЩАЩ ИЗБОР",
    },
    total: "Общо",
    remaining: "остават",
    foodOnlyBudget: "Пропуснах напитка или гарнитура, за да остане в бюджета.",
    alt: { cheaper: "По-евтино", filling: "По-засищащо", noAlcohol: "Без алкохол", spicy: "По-пикантно", lighter: "По-леко" },
  },
} satisfies Record<Locale, {
  tabs: { quiz: string; text: string };
  headerKicker: string;
  assistantName: string;
  assistantStatus: string;
  freeTitle: string;
  freeSubtitle: string;
  placeholders: string[];
  chips: Array<{ key: string; label: string; sentence: string }>;
  submit: string;
  loading: string;
  clear: string;
  tryAnother: string;
  understood: string;
  matched: string;
  tip: string;
  budget: string;
  veryHungry: string;
  hungry: string;
  wantsBeer: string;
  noAlcohol: string;
  sweetOnly: string;
  spicy: string;
  grilled: string;
  light: string;
  fresh: string;
  language: Record<Locale, string>;
  subtitles: { smartPick: string; underBudget: string; foodDrink: string; quickMatch: string; filling: string };
  total: string;
  remaining: string;
  foodOnlyBudget: string;
  alt: { cheaper: string; filling: string; noAlcohol: string; spicy: string; lighter: string };
}>;

interface HistoryEntry {
  itemId: string;
  titleBg: string;
  titleTr: string;
  titleEn: string;
  at: number;
}

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 3);
  } catch {
    return [];
  }
}

function pushHistory(entry: HistoryEntry) {
  if (typeof window === "undefined") return;
  try {
    const prev = loadHistory();
    const next = [entry, ...prev.filter((e) => e.itemId !== entry.itemId)].slice(0, 3);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

function wizardDebug(stage: string, details?: Record<string, unknown>) {
  if (!WIZARD_DEBUG) return;
  if (details) console.debug(`[wizard] ${stage}`, details);
  else console.debug(`[wizard] ${stage}`);
}

function isVeryHungryText(text: string): boolean {
  const s = text.toLowerCase();
  return /very hungry|so hungry|super hungry|really hungry|starving/.test(s) ||
    /çok aç|çok açım|kurt gibi aç|acıktım/.test(s) ||
    /много гладен|много гладна|страшно гладен|умирам от глад|адски гладен/.test(s);
}

function wantsBeerText(text: string): boolean {
  const s = text.toLowerCase();
  const negated = /no alcohol|without alcohol|non-alcoholic|alcohol-free|alkol olmasın|alkolsüz|alkol yok|без алкохол/.test(s);
  if (negated) return false;
  return /\bbeer\b|\bwine\b|\balcohol\b|bira|şarap|alkol|бира|вино|алкохол/.test(s);
}

function wantsNoAlcoholText(text: string): boolean {
  const s = text.toLowerCase();
  return /no alcohol|without alcohol|non-alcoholic|alcohol-free|alkol olmasın|alkolsüz|alkol yok|без алкохол|безалкохолно/.test(s);
}

function wantsSweetOnlyText(text: string): boolean {
  const s = text.toLowerCase();
  return /sweet only|only sweet|dessert only|само сладко|sadece tatlı/.test(s);
}

function detectInputLanguage(text: string, fallback: Locale): Locale {
  const s = text.toLowerCase();
  if (/[а-яё]/i.test(text)) return "bg";
  if (/[çğıöşü]/i.test(text) || /\b(bira|cebimde|açım|istiyorum|olsun|hafif|acılı|ızgara)\b/.test(s)) return "tr";
  if (/[a-z]/i.test(text)) return "en";
  return fallback;
}

function enrichAnswersFromFreeText(base: WizardAnswers, text: string): WizardAnswers {
  const s = text.toLowerCase();
  const next: WizardAnswers = { ...base };
  const veryHungry = isVeryHungryText(text);
  const wantsBeer = wantsBeerText(text);

  if (veryHungry) {
    next.hunger = "feast";
    if (!next.anchor || next.anchor === "drink") next.anchor = wantsBeer ? "both" : "food";
  }
  if (wantsBeer) {
    next.alcohol = "alcoholic";
    next.drinkProfile = "beer-wine";
    if (!next.anchor) next.anchor = veryHungry || /food|eat|meal|yemek|храна|ядене/.test(s) ? "both" : "drink";
  }
  if (wantsNoAlcoholText(text)) {
    next.alcohol = "non-alcoholic";
    if (!next.drinkProfile) next.drinkProfile = "any";
  }
  if (wantsSweetOnlyText(text)) {
    next.foodProtein = "sweet-only";
    next.anchor = "food";
    next.hunger = "snack";
  }
  if (/spicy|hot sauce|acılı|acı|пикантно|люто|лютиво/.test(s)) {
    next.mood = "adventurous";
  }
  if (/grilled|grill|bbq|ızgara|mangal|скара|грил/.test(s)) {
    next.foodTexture = "grilled";
    if (!next.anchor) next.anchor = "food";
  }
  if (/light|fresh|hafif|ferah|леко|свежо/.test(s)) {
    next.mood = "healthy";
    if (!next.hunger) next.hunger = "snack";
  }
  if (/cold|iced|soğuk|buzlu|студено|ледено/.test(s)) {
    next.drinkTemp = "cold";
  }
  return next;
}

function factListForInput(
  text: string,
  answers: WizardAnswers,
  budgetEur: number | null,
  locale: Locale,
): string[] {
  const copy = WIZARD_COPY[locale];
  const facts: string[] = [];
  const add = (value: string) => {
    if (!facts.includes(value)) facts.push(value);
  };
  const parsedBudget = parseBudget(text);
  if (budgetEur != null) {
    const budgetLabel = parsedBudget?.currency === "BGN" ? parsedBudget.source : formatPrice(budgetEur, "EUR", locale);
    add(`${budgetLabel} ${copy.budget}`);
  }
  if (answers.hunger === "feast" || isVeryHungryText(text)) add(copy.veryHungry);
  else if (answers.hunger) add(copy.hungry);
  if (answers.alcohol === "alcoholic" || wantsBeerText(text)) add(copy.wantsBeer);
  if (answers.alcohol === "non-alcoholic" || wantsNoAlcoholText(text)) add(copy.noAlcohol);
  if (answers.foodProtein === "sweet-only" || wantsSweetOnlyText(text)) add(copy.sweetOnly);
  if (answers.mood === "adventurous" || /spicy|acılı|acı|пикантно|люто/.test(text.toLowerCase())) add(copy.spicy);
  if (answers.foodTexture === "grilled") add(copy.grilled);
  if (answers.mood === "healthy") add(copy.light);
  if (/fresh|ferah|свежо/.test(text.toLowerCase())) add(copy.fresh);
  if (text.trim().length > 0 && facts.length > 0) add(copy.language[detectInputLanguage(text, locale)]);
  return facts.slice(0, 5);
}

function appendSentence(prev: string, sentence: string): string {
  const trimmed = prev.trim();
  if (!trimmed) return sentence;
  const separator = /[.!?]$/.test(trimmed) ? " " : ". ";
  return `${trimmed}${separator}${sentence}`;
}

function priceOf(item: { price: number | null } | null | undefined): number {
  return typeof item?.price === "number" ? item.price : 0;
}

function comboTotal(
  main: ScoredItem["item"],
  combo: { side: PairingPick | null; drink: PairingPick | null },
): number {
  return Math.round((priceOf(main) + priceOf(combo.side?.item) + priceOf(combo.drink?.item)) * 100) / 100;
}

function findBudgetBeer(categories: QrMenuCategory[], maxPrice: number | null): PairingPick | null {
  const beers = categories
    .flatMap((cat) => cat.items.map((item) => ({ ...item, categoryId: cat.id })))
    .filter((item) => {
      const tags = getItemTags(item.id);
      return isDrinkCategory(item.categoryId) &&
        tags.state === "alcoholic" &&
        (tags.profile === "malty" || tags.profile === "hoppy" || item.categoryId === "beer-cider-other-drinks") &&
        (maxPrice == null || priceOf(item) <= maxPrice);
    })
    .sort((a, b) => priceOf(a) - priceOf(b));
  return beers[0] ? { item: beers[0], reasonKey: "pair_drink_match" } : null;
}

function chooseBudgetSafeMain(
  local: WizardPick,
  budgetEur: number | null | undefined,
  answers: WizardAnswers,
  freetext?: string,
): ScoredItem {
  const wantsFoodFirst = answers.hunger === "feast" || answers.hunger === "meal" || isVeryHungryText(freetext ?? "");
  if (wantsFoodFirst && isDrinkCategory(local.main.item.categoryId)) {
    const foodFirst = local.pool.find((candidate) => {
      if (isDrinkCategory(candidate.item.categoryId)) return false;
      return budgetEur == null || priceOf(candidate.item) <= budgetEur;
    });
    if (foodFirst) return foodFirst;
  }
  if (budgetEur == null || priceOf(local.main.item) <= budgetEur) return local.main;
  const affordable = local.pool.find((candidate) => {
    if (priceOf(candidate.item) > budgetEur) return false;
    return !wantsFoodFirst || !isDrinkCategory(candidate.item.categoryId);
  });
  return affordable ?? local.main;
}

function buildBudgetAwareCombo(
  main: ScoredItem["item"],
  categories: QrMenuCategory[],
  budgetEur: number | null | undefined,
  answers: WizardAnswers,
  freetext?: string,
): { combo: { side: PairingPick | null; drink: PairingPick | null }; totalEstimatedPrice: number; budgetStatus: BudgetStatus } {
  const combo = buildCombo(main, categories);
  let side = combo.side;
  let drink = combo.drink;
  let budgetStatus: BudgetStatus = "within_budget";
  const wantsBeer = wantsBeerText(freetext ?? "") || answers.alcohol === "alcoholic" || answers.drinkProfile === "beer-wine";

  if (!isDrinkCategory(main.categoryId) && wantsBeer) {
    const remainingForDrink = budgetEur == null ? null : Math.max(0, budgetEur - priceOf(main) - priceOf(side?.item));
    let beer = findBudgetBeer(categories, remainingForDrink);
    if (!beer && side && budgetEur != null) {
      beer = findBudgetBeer(categories, Math.max(0, budgetEur - priceOf(main)));
      if (beer) side = null;
    }
    if (beer) drink = beer;
  }

  const fits = () => budgetEur == null || comboTotal(main, { side, drink }) <= budgetEur;
  if (!fits() && side) {
    side = null;
    budgetStatus = "food_only_within_budget";
  }
  if (!fits() && drink) {
    drink = null;
    budgetStatus = "food_only_within_budget";
  }
  if (!fits()) {
    budgetStatus = "over_budget_no_safe_combo";
  }
  return {
    combo: { side, drink },
    totalEstimatedPrice: comboTotal(main, { side, drink }),
    budgetStatus,
  };
}

function resultIds(result: ResultView | null): string {
  if (!result) return "";
  return [
    result.mainItem.item.id,
    result.combo.side?.item.id ?? "",
    result.combo.drink?.item.id ?? "",
  ].join("|");
}

function getResultSubtitle(result: ResultView | null, locale: Locale): string {
  const copy = WIZARD_COPY[locale].subtitles;
  if (!result) return copy.quickMatch;
  if (result.budgetEur != null && result.totalEstimatedPrice != null && result.totalEstimatedPrice <= result.budgetEur) {
    return copy.underBudget;
  }
  if (result.combo.drink && !isDrinkCategory(result.mainItem.item.categoryId)) return copy.foodDrink;
  if (result.matchedFacts?.some((fact) => fact === WIZARD_COPY[locale].veryHungry)) return copy.filling;
  if (result.source === "groq") return copy.smartPick;
  return copy.quickMatch;
}

function formatBudgetLine(result: ResultView, currency: string, locale: Locale): string | null {
  const total = result.totalEstimatedPrice ?? comboTotal(result.mainItem.item, result.combo);
  if (result.budgetEur != null) {
    return `${WIZARD_COPY[locale].total}: ${formatPrice(total, currency, locale)} / ${formatPrice(result.budgetEur, currency, locale)} ${WIZARD_COPY[locale].budget}`;
  }
  if (result.combo.side || result.combo.drink) {
    return `${WIZARD_COPY[locale].total}: ${formatPrice(total, currency, locale)}`;
  }
  return null;
}

function formatBudgetRemaining(result: ResultView, currency: string, locale: Locale): string | null {
  if (result.budgetEur == null || result.totalEstimatedPrice == null) return null;
  const remaining = Math.round((result.budgetEur - result.totalEstimatedPrice) * 100) / 100;
  if (remaining < 0) return null;
  return `${formatPrice(remaining, currency, locale)} ${WIZARD_COPY[locale].remaining}`;
}

function comboReasonText(
  kind: "side" | "drink",
  result: ResultView,
  pair: PairingPick,
  locale: Locale,
): string {
  const mainTags = getItemTags(result.mainItem.item.id);
  const pairTags = getItemTags(pair.item.id);
  const budgetSafe = result.budgetEur != null && result.totalEstimatedPrice != null && result.totalEstimatedPrice <= result.budgetEur;
  if (budgetSafe && kind === "drink" && pairTags.state === "alcoholic") {
    if (locale === "tr") return "Bira isteğine uyuyor ve bütçeyi aşmıyor.";
    if (locale === "bg") return "Пасва на бира и остава в бюджета.";
    return "Fits the beer request without breaking your budget.";
  }
  if (budgetSafe && kind === "side") {
    if (locale === "tr") return "Ana yemeği tamamlıyor ve toplamı bütçede tutuyor.";
    if (locale === "bg") return "Допълва основното и остава в бюджета.";
    return "Rounds out the main while staying within budget.";
  }
  if (kind === "drink" && (mainTags.flavors.includes("smoky") || mainTags.textures.includes("grilled"))) {
    if (locale === "tr") return "Izgara ve tuzlu lezzetle iyi gider.";
    if (locale === "bg") return "Подхожда на скара и солен вкус.";
    return "Works well with grilled, salty food.";
  }
  if (kind === "side" && mainTags.portion === "feast") {
    if (locale === "tr") return "Çok açsan tabağı daha doyurucu yapar.";
    if (locale === "bg") return "Прави избора още по-засищащ.";
    return "Makes the pick more filling for a big appetite.";
  }
  return t(locale, pair.reasonKey);
}

function alternativeLabel(alt: ScoredItem, result: ResultView, locale: Locale): string {
  const copy = WIZARD_COPY[locale].alt;
  const mainPrice = priceOf(result.mainItem.item);
  const altPrice = priceOf(alt.item);
  const altTags = getItemTags(alt.item.id);
  const mainTags = getItemTags(result.mainItem.item.id);
  if (altPrice > 0 && mainPrice > 0 && altPrice < mainPrice) return copy.cheaper;
  if (altTags.portion === "feast" && mainTags.portion !== "feast") return copy.filling;
  if (altTags.state !== "alcoholic" && mainTags.state === "alcoholic") return copy.noAlcohol;
  if (altTags.flavors.includes("spicy") && !mainTags.flavors.includes("spicy")) return copy.spicy;
  if (altTags.vibe === "light" && mainTags.vibe !== "light") return copy.lighter;
  return copy.cheaper;
}

// Inline icons — small, no external dependency, themed via currentColor.
function Icon({ name, size = 28 }: { name: string; size?: number }) {
  const props = {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "mood_comfort": return (<svg {...props}><path d="M3 9h18M5 9c0-3 3-5 7-5s7 2 7 5v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9Z" /><path d="M9 14a3 3 0 0 0 6 0" /></svg>);
    case "mood_healthy": return (<svg {...props}><path d="M12 21c-4-4-7-7-7-11a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4-3 7-7 11Z" /><path d="M5 8c2 0 4 1 5 3" /></svg>);
    case "mood_indulgent": return (<svg {...props}><path d="M12 2v4M9 4l3-2 3 2M5 10h14l-2 10H7L5 10Z" /><path d="M9 14h6" /></svg>);
    case "mood_adventurous": return (<svg {...props}><path d="M3 21h12L21 3l-6 6 6 6-3 6-3-3-12 3Z" /></svg>);
    case "anchor_food": return (<svg {...props}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v0-7" /></svg>);
    case "anchor_drink": return (<svg {...props}><path d="M21 22H3M6 12h12M12 12v10M18 2H6l6 10Z" /></svg>);
    case "anchor_both": return (<svg {...props}><path d="M3 11h6M15 11h6M6 11V7a3 3 0 0 1 6 0v4M12 11V7a3 3 0 0 1 6 0v4M9 22h6M12 11v11" /></svg>);
    case "protein_meat": return (<svg {...props}><path d="M15.5 8.5C18.5 5.5 22 2 22 2s-3.5 3.5-6.5 6.5C13 11 9 10 7 12s-2 6-2 6 4 0 6-2 1-6 4.5-7.5Z" /></svg>);
    case "protein_poultry": return (<svg {...props}><path d="M12 2c4 0 7 3 7 7 0 1-1 2-2 2H7c-1 0-2-1-2-2 0-4 3-7 7-7ZM9 11v3M15 11v3M7 14c-1 2-2 4-2 6 0 1 1 2 2 2h10c1 0 2-1 2-2 0-2-1-4-2-6" /></svg>);
    case "protein_fish": return (<svg {...props}><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z" /><circle cx="16" cy="12" r="1" /><path d="M22 12c-2 1-2 3 0 4M2 12c2-1 2-3 0-4" /></svg>);
    case "protein_vegetarian": return (<svg {...props}><path d="M12 22V8M5 12c0-4 3-7 7-7s7 3 7 7-3 7-7 7" /></svg>);
    case "protein_sweet": return (<svg {...props}><path d="M12 2v6M21 16H3l9-12 9 12Z" /><path d="M3 16c0 2.2 4 4 9 4s9-1.8 9-4" /></svg>);
    case "hunger_snack": return (<svg {...props}><path d="M5 11h14a8 8 0 0 1-14 0ZM12 6V3M9 7 7 4M15 7l2-3" /></svg>);
    case "hunger_meal": return (<svg {...props}><path d="M3 11c0-4 4-6 9-6s9 2 9 6H3Z" /><path d="M2 14h20M5 18h14" /></svg>);
    case "hunger_feast": return (<svg {...props}><path d="M6 4v8a4 4 0 0 0 4 4v8M18 4v8a4 4 0 0 1-4 4v8" /></svg>);
    case "texture_grilled": return (<svg {...props}><path d="M12 2v6M8 3v4M16 3v4M4 12h16a8 8 0 0 1-16 0Z" /></svg>);
    case "texture_crispy": return (<svg {...props}><rect x={3} y={7} width={12} height={12} rx={6} /><path d="m13 15 8-8" /></svg>);
    case "texture_creamy": return (<svg {...props}><path d="M5 11c0 5 3 9 7 9s7-4 7-9-3-7-7-7-7 2-7 7Z" /></svg>);
    case "temp_hot": return (<svg {...props}><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8Z" /></svg>);
    case "temp_cold": return (<svg {...props}><path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19" /></svg>);
    case "alcohol_na": return (<svg {...props}><path d="M5 22h14l1-15H4l1 15Z" /><path d="M9 11v6M13 11v4" /></svg>);
    case "alcohol_alcoholic": return (<svg {...props}><path d="M6 21h11a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H6v18ZM20 8h1a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1" /></svg>);
    case "alcohol_either": return (<svg {...props}><path d="M3 12h18M9 6l6 6-6 6" /></svg>);
    case "profile_caffeine": return (<svg {...props}><path d="M12 22c5 0 10-4 10-10S17 2 12 2 2 7 2 12s5 10 10 10Z" /><path d="M7 17s3-3 5-5 5-3 5-3M7 7s5 2 7 5 3 5 3 5" /></svg>);
    case "profile_fruity": return (<svg {...props}><circle cx={6} cy={18} r={4} /><circle cx={18} cy={16} r={4} /><path d="M6 14V4c0-1 1-2 2-2h10v10" /></svg>);
    case "profile_herbal": return (<svg {...props}><path d="M12 22C12 12 22 12 22 12s-10 0-10 10ZM12 22C12 12 2 12 2 12s10 0 10 10ZM12 2c0 10 10 10 10 10s-10 0-10-10Z" /></svg>);
    case "profile_beer_wine": return (<svg {...props}><path d="M5 22h14M6 12h12M12 12v10M18 2H6l6 10Z" /></svg>);
    case "profile_any": return (<svg {...props}><path d="M12 2 14 9h7l-5.5 4 2 8L12 17l-5.5 4 2-8L3 9h7Z" /></svg>);
    case "no_preference": return (<svg {...props}><path d="M3 12h18M12 3v18" /></svg>);
    case "surprise": return (<svg {...props}><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3" /></svg>);
    case "free_text": return (<svg {...props}><path d="M4 6h16v12H4z" /><path d="M4 6l8 7 8-7" /></svg>);
    default: return null;
  }
}

interface OptionDef {
  key: string;
  icon: string;
  labelKey: string;
  value: string;
}

function pickOptions(step: WizardStep, locale: Locale): OptionDef[] {
  switch (step) {
    case "q_mood":
      return [
        { key: "comfort", icon: "mood_comfort", labelKey: "mood_comfort", value: "comfort" },
        { key: "healthy", icon: "mood_healthy", labelKey: "mood_healthy", value: "healthy" },
        { key: "indulgent", icon: "mood_indulgent", labelKey: "mood_indulgent", value: "indulgent" },
        { key: "adventurous", icon: "mood_adventurous", labelKey: "mood_adventurous", value: "adventurous" },
      ];
    case "q_anchor":
      return [
        { key: "food", icon: "anchor_food", labelKey: "q_anchor_food", value: "food" },
        { key: "drink", icon: "anchor_drink", labelKey: "q_anchor_drink", value: "drink" },
        { key: "both", icon: "anchor_both", labelKey: "q_anchor_both", value: "both" },
      ];
    case "q_food_protein":
      return [
        { key: "meat", icon: "protein_meat", labelKey: "q_protein_meat", value: "meat" },
        { key: "poultry", icon: "protein_poultry", labelKey: "q_protein_poultry", value: "poultry" },
        { key: "fish", icon: "protein_fish", labelKey: "q_protein_fish", value: "fish" },
        { key: "vegetarian", icon: "protein_vegetarian", labelKey: "q_protein_vegetarian", value: "vegetarian" },
        { key: "sweet-only", icon: "protein_sweet", labelKey: "q_protein_sweet_only", value: "sweet-only" },
      ];
    case "q_food_hunger":
      return [
        { key: "snack", icon: "hunger_snack", labelKey: "q_hunger_snack", value: "snack" },
        { key: "meal", icon: "hunger_meal", labelKey: "q_hunger_meal", value: "meal" },
        { key: "feast", icon: "hunger_feast", labelKey: "q_hunger_feast", value: "feast" },
      ];
    case "q_food_texture":
      return [
        { key: "grilled", icon: "texture_grilled", labelKey: "q_texture_grilled", value: "grilled" },
        { key: "crispy", icon: "texture_crispy", labelKey: "q_texture_crispy", value: "crispy" },
        { key: "creamy", icon: "texture_creamy", labelKey: "q_texture_creamy", value: "creamy" },
        { key: "no-preference", icon: "no_preference", labelKey: "q_texture_no_preference", value: "no-preference" },
      ];
    case "q_drink_temp":
      return [
        { key: "hot", icon: "temp_hot", labelKey: "q_temp_hot", value: "hot" },
        { key: "cold", icon: "temp_cold", labelKey: "q_temp_cold", value: "cold" },
      ];
    case "q_drink_alcohol":
      return [
        { key: "non-alcoholic", icon: "alcohol_na", labelKey: "q_alcohol_na", value: "non-alcoholic" },
        { key: "alcoholic", icon: "alcohol_alcoholic", labelKey: "q_alcohol_alcoholic", value: "alcoholic" },
        { key: "either", icon: "alcohol_either", labelKey: "q_alcohol_either", value: "either" },
      ];
    case "q_drink_profile":
      return [
        { key: "caffeine", icon: "profile_caffeine", labelKey: "q_profile_caffeine", value: "caffeine" },
        { key: "fruity", icon: "profile_fruity", labelKey: "q_profile_fruity", value: "fruity" },
        { key: "herbal", icon: "profile_herbal", labelKey: "q_profile_herbal", value: "herbal" },
        { key: "beer-wine", icon: "profile_beer_wine", labelKey: "q_profile_beer_wine", value: "beer-wine" },
        { key: "any", icon: "profile_any", labelKey: "q_profile_any", value: "any" },
      ];
    default:
      return [];
  }
}

function questionTitleKey(step: WizardStep): string {
  switch (step) {
    case "q_mood": return "q_mood";
    case "q_anchor": return "q_anchor";
    case "q_food_protein": return "q_food_protein";
    case "q_food_hunger": return "q_food_hunger";
    case "q_food_texture": return "q_food_texture";
    case "q_drink_temp": return "q_drink_temp";
    case "q_drink_alcohol": return "q_drink_alcohol";
    case "q_drink_profile": return "q_drink_profile";
    default: return "wizardTitle";
  }
}

function fieldForStep(step: WizardStep): keyof WizardAnswers {
  switch (step) {
    case "q_mood": return "mood";
    case "q_anchor": return "anchor";
    case "q_food_protein": return "foodProtein";
    case "q_food_hunger": return "hunger";
    case "q_food_texture": return "foodTexture";
    case "q_drink_temp": return "drinkTemp";
    case "q_drink_alcohol": return "alcohol";
    case "q_drink_profile": return "drinkProfile";
    default: return "mood";
  }
}

interface ResultView {
  mainItem: ScoredItem & { item: import("./masaTypes").QrMenuItem & { categoryId: string } };
  alternatives: ScoredItem[];
  combo: { side: PairingPick | null; drink: PairingPick | null };
  confidence: WizardPick["confidence"];
  isSurprise: boolean;
  pickIndex: number; // for "show me another" cycling
  source: "groq" | "local" | "surprise";
  rationaleText?: string; // LLM-supplied one-liner (only when source === "groq")
  budgetEur?: number | null;
  totalEstimatedPrice?: number | null;
  budgetStatus?: BudgetStatus;
  matchedFacts?: string[];
  requestId?: number;
  llmAppliedMode?: "replace" | "enriched";
}

export function MasaTasteWizard({
  categories,
  currency,
  locale,
  onClose,
  styles,
  soundEnabled = true,
  sessionToken = "",
}: MasaTasteWizardProps) {
  const [step, setStep] = useState<WizardStep>("intro");
  const [answers, setAnswers] = useState<WizardAnswers>({});
  const [result, setResult] = useState<ResultView | null>(null);
  const [spinningLabel, setSpinningLabel] = useState("");
  const [freeText, setFreeText] = useState("");
  const [freeTextLoading, setFreeTextLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"quiz" | "text">("quiz");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [activeChipKey, setActiveChipKey] = useState<string | null>(null);
  // Bumped on every finishQuiz() call so a late LLM/local response from a
  // previous quiz run (e.g. the user restarted before it resolved) is
  // ignored instead of overwriting the current result.
  const requestIdRef = useRef(0);
  const localAppliedRequestRef = useRef<number | null>(null);
  const pendingLlmRef = useRef<{ requestId: number; pick: WizardPickFromLlm } | null>(null);
  const resultRef = useRef<ResultView | null>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const triggerClick = () => playClick(soundEnabled);
  const setResultView = (next: ResultView | null) => {
    resultRef.current = next;
    setResult(next);
  };

  const localLexicon = useMemo(() => parseWithLexicon(freeText), [freeText]);
  const liveAnswers = useMemo(
    () => enrichAnswersFromFreeText(localLexicon.answers, freeText),
    [freeText, localLexicon.answers],
  );
  const liveBudgetEur = useMemo(() => budgetInEur(freeText), [freeText]);
  const liveFacts = useMemo(
    () => factListForInput(freeText, liveAnswers, liveBudgetEur, locale),
    [freeText, liveAnswers, liveBudgetEur, locale],
  );

  useEffect(() => {
    if (activeTab !== "text" || freeText.trim()) return;
    const id = window.setInterval(() => {
      setPlaceholderIndex((idx) => (idx + 1) % WIZARD_COPY[locale].placeholders.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [activeTab, freeText, locale]);

  // -------------------------------------------------------------------------
  // Step navigation
  // -------------------------------------------------------------------------

  const handleOption = (field: keyof WizardAnswers, value: string) => {
    triggerClick();
    const newAnswers: WizardAnswers = { ...answers, [field]: value };
    setAnswers(newAnswers);
    if (field === "foodProtein" && value === "sweet-only") {
      // Skip hunger for desserts
      finishQuiz({ ...newAnswers, hunger: "snack" });
      return;
    }
    if (field === "alcohol" && value === "non-alcoholic") {
      // NA drinks skip profile by default
      finishQuiz({ ...newAnswers, drinkProfile: "any" });
      return;
    }
    const next = nextStep(step, newAnswers);
    setStep(next);
    if (next === "spinning") {
      finishQuiz(newAnswers);
    }
  };

  const pushResultHistory = (item: ResultView["mainItem"]["item"]) => {
    pushHistory({
      itemId: item.id,
      titleBg: item.title.bg ?? "",
      titleTr: item.title.tr ?? "",
      titleEn: item.title.en ?? "",
      at: Date.now(),
    });
    setHistory(loadHistory());
  };

  const llmSkipReason = (
    mode: "buttons" | "freetext",
    local: WizardPick | null,
    finalAnswers: WizardAnswers,
    freetext?: string,
    budgetEur?: number | null,
  ): string | null => {
    const text = (freetext ?? "").trim();
    if (!sessionToken) return "missing_session_token";
    if (typeof navigator !== "undefined" && navigator.onLine === false) return "offline";
    if (mode === "freetext" && text.length < 4 && budgetEur == null) return "empty_input";
    const hasMixedConstraints =
      budgetEur != null ||
      wantsBeerText(text) ||
      wantsNoAlcoholText(text) ||
      isVeryHungryText(text) ||
      finalAnswers.anchor === "both" ||
      finalAnswers.alcohol != null;
    if (mode === "freetext" && text.length >= 4) return null;
    if (local?.confidence !== "high" || hasMixedConstraints) return null;
    return "high_confidence_local";
  };

  const applyLlmPick = (
    requestId: number,
    llm: WizardPickFromLlm,
    context: { budgetEur?: number | null; matchedFacts: string[] },
  ) => {
    if (requestIdRef.current !== requestId) {
      wizardDebug("llm:response:rejected", { requestId, reason: "stale_request" });
      return;
    }
    if (localAppliedRequestRef.current !== requestId) {
      pendingLlmRef.current = { requestId, pick: llm };
      return;
    }

    const current = resultRef.current;
    const budgetEur = context.budgetEur ?? null;
    const computedTotal = comboTotal(llm.main.item, llm.combo);
    const llmTotal = llm.totalEstimatedPrice ?? computedTotal;
    if (budgetEur != null && llmTotal > budgetEur + 0.001) {
      wizardDebug("llm:response:rejected", { requestId, reason: "budget_overrun", total: llmTotal, budgetEur });
      return;
    }
    if (!llm.rationaleText?.trim() && (llm.confidence ?? 0) < 50) {
      wizardDebug("llm:response:rejected", { requestId, reason: "no_improvement" });
      return;
    }
    if (current?.confidence === "high" && (llm.confidence ?? 50) < 40 && resultIds(current) !== [
      llm.main.item.id,
      llm.combo.side?.item.id ?? "",
      llm.combo.drink?.item.id ?? "",
    ].join("|")) {
      wizardDebug("llm:response:rejected", { requestId, reason: "lower_confidence", confidence: llm.confidence });
      return;
    }

    const sameIds = resultIds(current) === [
      llm.main.item.id,
      llm.combo.side?.item.id ?? "",
      llm.combo.drink?.item.id ?? "",
    ].join("|");
    const next: ResultView = {
      mainItem: llm.main,
      alternatives: llm.alternatives.length > 0 ? llm.alternatives : current?.alternatives ?? [],
      combo: llm.combo,
      confidence: "high",
      isSurprise: false,
      pickIndex: 0,
      source: "groq",
      rationaleText: llm.rationaleText,
      budgetEur,
      totalEstimatedPrice: llm.totalEstimatedPrice ?? computedTotal,
      budgetStatus: llm.budgetStatus,
      matchedFacts: context.matchedFacts,
      requestId,
      llmAppliedMode: sameIds ? "enriched" : "replace",
    };
    wizardDebug("llm:response:accepted", {
      requestId,
      mode: next.llmAppliedMode,
      mainItemId: next.mainItem.item.id,
      total: next.totalEstimatedPrice,
      confidence: llm.confidence,
    });
    setResultView(next);
    pushResultHistory(next.mainItem.item);
    wizardDebug("ui:applied-llm", { requestId, mode: next.llmAppliedMode });
  };

  const flushPendingLlm = (requestId: number, context: { budgetEur?: number | null; matchedFacts: string[] }) => {
    const pending = pendingLlmRef.current;
    if (!pending || pending.requestId !== requestId) return;
    pendingLlmRef.current = null;
    applyLlmPick(requestId, pending.pick, context);
  };

  const finishQuiz = (
    finalAnswers: WizardAnswers,
    opts: { freetext?: string; budgetEur?: number | null } = {},
  ) => {
    const freetext = opts.freetext?.trim() || "";
    const mode: "buttons" | "freetext" = freetext ? "freetext" : "buttons";
    const requestId = ++requestIdRef.current;
    localAppliedRequestRef.current = null;
    pendingLlmRef.current = null;
    const budgetEur = opts.budgetEur ?? null;
    const matchedFacts = factListForInput(freetext, finalAnswers, budgetEur, locale);

    wizardDebug("local:start", { requestId, mode, budgetEur, textLen: freetext.length });
    const local = pickRecommendation(categories, finalAnswers, locale, freetext);
    wizardDebug("local:result", {
      requestId,
      mainItemId: local?.main.item.id,
      confidence: local?.confidence,
      alternatives: local?.alternatives.map((alt) => alt.item.id) ?? [],
    });

    const spin = setInterval(() => {
      const pool = categories.flatMap((c) => c.items.map((i) => ({ ...i, categoryId: c.id })));
      if (pool.length === 0) return;
      const randomItem = pool[Math.floor(Math.random() * pool.length)];
      setSpinningLabel(localized(randomItem.title, locale));
      triggerClick();
    }, 110);
    setStep("spinning");

    const skipReason = llmSkipReason(mode, local, finalAnswers, freetext, budgetEur);
    if (skipReason) {
      wizardDebug("llm:request:skipped", { requestId, reason: skipReason });
    } else {
      wizardDebug("llm:request:start", { requestId, mode, timeoutMs: CLIENT_LLM_TIMEOUT_MS, budgetEur, textLen: freetext.length });
      void recommend(
        {
          mode,
          answers: finalAnswers,
          freetext,
          budgetEur,
          locale,
          sessionToken,
          requestId: String(requestId),
          timeoutMs: CLIENT_LLM_TIMEOUT_MS,
        },
        categories,
      ).then((llm) => {
        if (!llm) return;
        applyLlmPick(requestId, llm, { budgetEur, matchedFacts });
      });
    }

    window.setTimeout(() => {
      clearInterval(spin);
      if (requestIdRef.current !== requestId) return;
      if (!local) {
        const surprise = getSurprisePick(categories);
        if (!surprise) {
          setResultView(null);
          setStep("result");
          return;
        }
        const comboMeta = buildBudgetAwareCombo(surprise.item, categories, budgetEur, finalAnswers, freetext);
        const surpriseResult: ResultView = {
          mainItem: surprise,
          alternatives: [],
          combo: comboMeta.combo,
          confidence: "low",
          isSurprise: true,
          pickIndex: 0,
          source: "surprise",
          budgetEur,
          totalEstimatedPrice: comboMeta.totalEstimatedPrice,
          budgetStatus: comboMeta.budgetStatus,
          matchedFacts,
          requestId,
        };
        setResultView(surpriseResult);
        setStep("result");
        localAppliedRequestRef.current = requestId;
        wizardDebug("ui:applied-local", { requestId, source: "surprise", mainItemId: surprise.item.id });
        flushPendingLlm(requestId, { budgetEur, matchedFacts });
        return;
      }

      const mainItem = chooseBudgetSafeMain(local, budgetEur, finalAnswers, freetext);
      const comboMeta = buildBudgetAwareCombo(mainItem.item, categories, budgetEur, finalAnswers, freetext);
      const localResult: ResultView = {
        mainItem,
        alternatives: local.alternatives.filter((alt) => alt.item.id !== mainItem.item.id),
        combo: comboMeta.combo,
        confidence: local.confidence,
        isSurprise: false,
        pickIndex: 0,
        source: "local",
        budgetEur,
        totalEstimatedPrice: comboMeta.totalEstimatedPrice,
        budgetStatus: comboMeta.budgetStatus,
        matchedFacts,
        requestId,
      };
      setResultView(localResult);
      pushResultHistory(localResult.mainItem.item);
      setStep("result");
      localAppliedRequestRef.current = requestId;
      wizardDebug("ui:applied-local", {
        requestId,
        mainItemId: localResult.mainItem.item.id,
        total: localResult.totalEstimatedPrice,
        budgetStatus: localResult.budgetStatus,
      });
      flushPendingLlm(requestId, { budgetEur, matchedFacts });
    }, SPINNER_MIN_MS);
  };

  const handleSurprise = () => {
    triggerClick();
    requestIdRef.current++; // invalidate any in-flight finishQuiz response
    localAppliedRequestRef.current = null;
    pendingLlmRef.current = null;
    const surprise = getSurprisePick(categories);
    if (!surprise) return;
    const combo = buildCombo(surprise.item, categories);
    setResultView({ mainItem: surprise, alternatives: [], combo, confidence: "low", isSurprise: true, pickIndex: 0, source: "surprise" });
    setStep("result");
  };

  const handleBack = () => {
    triggerClick();
    if (step === "q_mood") {
      setStep("intro");
      return;
    }
    // Pop the last answer and step back one
    const order: WizardStep[] = ["intro", "q_mood", "q_anchor"];
    const anchor = answers.anchor ?? "food";
    if (anchor === "drink") order.push("q_drink_temp", "q_drink_alcohol", "q_drink_profile");
    else if (anchor === "both") order.push("q_food_protein", "q_food_hunger", "q_drink_temp", "q_drink_alcohol");
    else if (answers.foodProtein === "sweet-only") order.push("q_food_protein");
    else order.push("q_food_protein", "q_food_hunger", "q_food_texture");

    const idx = order.indexOf(step);
    if (idx > 0) {
      const prev = order[idx - 1];
      // Clear the last-set field so the back navigation is honest
      if (step === "q_anchor") setAnswers((a) => ({ ...a, anchor: undefined }));
      else if (step === "q_food_protein") setAnswers((a) => ({ ...a, foodProtein: undefined, hunger: undefined }));
      else if (step === "q_food_hunger") setAnswers((a) => ({ ...a, hunger: undefined }));
      else if (step === "q_food_texture") setAnswers((a) => ({ ...a, foodTexture: undefined }));
      else if (step === "q_drink_temp") setAnswers((a) => ({ ...a, drinkTemp: undefined }));
      else if (step === "q_drink_alcohol") setAnswers((a) => ({ ...a, alcohol: undefined }));
      else if (step === "q_drink_profile") setAnswers((a) => ({ ...a, drinkProfile: undefined }));
      setStep(prev);
    }
  };

  const handleRestart = () => {
    triggerClick();
    requestIdRef.current++; // invalidate any in-flight finishQuiz response
    localAppliedRequestRef.current = null;
    pendingLlmRef.current = null;
    setStep("intro");
    setAnswers({});
    setResultView(null);
    setFreeText("");
    setActiveChipKey(null);
    setActiveTab("quiz");
  };

  const handleShowAnother = () => {
    if (!result || result.alternatives.length === 0) return;
    triggerClick();
    const next = result.alternatives[result.pickIndex] ?? result.alternatives[0];
    const newAlternatives = [result.mainItem, ...result.alternatives.filter((_, i) => i !== result.pickIndex)];
    const combo = buildCombo(next.item, categories);
    setResultView({
      mainItem: next,
      alternatives: newAlternatives,
      combo,
      confidence: result.confidence,
      isSurprise: false,
      pickIndex: 0,
      // After "show another" the pick is local — we don't re-call the LLM
      // for the second result because the LLM's job was to pick the winner.
      source: "local",
      budgetEur: result.budgetEur,
      totalEstimatedPrice: comboTotal(next.item, combo),
      budgetStatus: result.budgetStatus,
      matchedFacts: result.matchedFacts,
    });
  };

  const handleFreeTextSubmit = async () => {
    const text = freeText.trim();
    if (!text) return;
    triggerClick();
    setFreeTextLoading(true);
    try {
      const intent = await inferIntent({ text });
      const budgetEur = budgetInEur(text);
      const enrichedAnswers = enrichAnswersFromFreeText(intent.answers ?? {}, text);
      setAnswers(enrichedAnswers);
      finishQuiz(enrichedAnswers, { freetext: text, budgetEur });
      setFreeText("");
      setActiveChipKey(null);
    } finally {
      setFreeTextLoading(false);
    }
  };

  const handleChipClick = (chip: { key: string; sentence: string }) => {
    triggerClick();
    setActiveChipKey(chip.key);
    setFreeText((prev) => {
      if (prev.includes(chip.sentence)) return prev;
      return appendSentence(prev, chip.sentence);
    });
    setTimeout(() => {
      const el = document.getElementById("wizardFreeTextInput") as HTMLTextAreaElement | null;
      if (el) el.focus();
    }, 50);
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const renderProgress = () => {
    if (step === "intro" || step === "spinning" || step === "result") return null;
    const { current, total } = questionNumber(step, answers);
    return (
      <div className={styles.wizardProgress}>
        {t(locale, "wizardProgress").replace("{current}", String(current)).replace("{total}", String(total))}
      </div>
    );
  };

  const renderQuestion = () => {
    const options = pickOptions(step, locale);
    const titleKey = questionTitleKey(step);
    const field = fieldForStep(step);
    return (
      <div className={styles.wizardStep}>
        {renderProgress()}
        <h3 className={styles.wizardQuestion}>{t(locale, titleKey)}</h3>
        <div className={styles.wizardOptions}>
          {options.map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={styles.wizardOptionBtn}
              onClick={() => handleOption(field, opt.value)}
            >
              <span className={styles.wizardOptionIcon}><Icon name={opt.icon} size={28} /></span>
              <span className={styles.wizardOptionLabel}>{t(locale, opt.labelKey)}</span>
            </button>
          ))}
        </div>
        {step !== "q_mood" ? (
          <button type="button" className={styles.wizardBackBtn} onClick={handleBack}>
            <ArrowLeft size={14} />
            <span>{t(locale, "wizardBack")}</span>
          </button>
        ) : null}
      </div>
    );
  };

  // -------------------------------------------------------------------------

  const renderIntro = () => {
    return (
      <div className={styles.wizardIntroContainer}>
        {/* Tab Switcher */}
        <div className={styles.wizardTabSwitcher}>
          <button
            type="button"
            className={`${styles.wizardTabBtn} ${activeTab === "quiz" ? styles.wizardTabBtnActive : ""}`}
            data-active={activeTab === "quiz" ? "true" : "false"}
            aria-pressed={activeTab === "quiz"}
            onClick={() => {
              triggerClick();
              setActiveTab("quiz");
            }}
          >
            <Sparkles size={16} />
            <span>{WIZARD_COPY[locale].tabs.quiz}</span>
          </button>
          <button
            type="button"
            className={`${styles.wizardTabBtn} ${activeTab === "text" ? styles.wizardTabBtnActive : ""}`}
            data-active={activeTab === "text" ? "true" : "false"}
            aria-pressed={activeTab === "text"}
            onClick={() => {
              triggerClick();
              setActiveTab("text");
            }}
          >
            <MessageSquare size={16} />
            <span>{WIZARD_COPY[locale].tabs.text}</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "quiz" ? (
          <div className={styles.wizardIntroContent}>
            <p className={styles.wizardIntroText}>{t(locale, "wizardIntro")}</p>
            {history.length > 0 ? (
              <div className={styles.wizardHistory}>
                <span className={styles.wizardHistoryLabel}>{t(locale, "last_picked_label")}</span>
                <span className={styles.wizardHistoryItem}>
                  {history[0] ? localized(
                    { bg: history[0].titleBg, tr: history[0].titleTr, en: history[0].titleEn },
                    locale,
                  ) : ""}
                </span>
              </div>
            ) : null}
            <div className={styles.wizardIntroActions}>
              <button
                type="button"
                className={styles.wizardBtnPrimary}
                onClick={() => {
                  triggerClick();
                  setStep("q_mood");
                }}
              >
                <Sparkles size={16} />
                <span>{t(locale, "wizardStart")}</span>
              </button>
              <button
                type="button"
                className={styles.wizardBtnSecondary}
                onClick={handleSurprise}
              >
                <Wand2 size={16} />
                <span>{t(locale, "wizardSurprise")}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.wizardFreeTextContainer}>
            <div className={styles.wizardFreeTextBox}>
              <div className={styles.wizardAssistantHeader}>
                <span className={styles.wizardAssistantAvatar} aria-hidden="true">
                  <Sparkles size={16} />
                </span>
                <div>
                  <p className={styles.wizardAssistantName}>{WIZARD_COPY[locale].assistantName}</p>
                  <p className={styles.wizardAssistantStatus}>{WIZARD_COPY[locale].assistantStatus}</p>
                </div>
              </div>
              <div className={styles.wizardFreeTextHeader}>
                <label htmlFor="wizardFreeTextInput" className={styles.wizardFreeTextTitle}>
                  {WIZARD_COPY[locale].freeTitle}
                </label>
                <p className={styles.wizardFreeTextSubtitle}>{WIZARD_COPY[locale].freeSubtitle}</p>
              </div>
              <textarea
                id="wizardFreeTextInput"
                className={styles.wizardFreeTextInput}
                value={freeText}
                onChange={(e) => {
                  setFreeText(e.target.value);
                  if (!e.target.value.trim()) setActiveChipKey(null);
                }}
                placeholder={WIZARD_COPY[locale].placeholders[placeholderIndex % WIZARD_COPY[locale].placeholders.length]}
                rows={3}
                disabled={freeTextLoading}
                autoFocus
                aria-describedby="wizardFreeTextHelp wizardUnderstandingPreview"
              />

              <div className={styles.wizardFreeTextSuggestions}>
                {WIZARD_COPY[locale].chips.map((chip) => {
                  const active = activeChipKey === chip.key && freeText.includes(chip.sentence);
                  return (
                  <button
                    key={chip.key}
                    type="button"
                    className={`${styles.wizardSuggestionChip} ${active ? styles.wizardSuggestionChipActive : ""}`}
                    onClick={() => handleChipClick(chip)}
                    disabled={freeTextLoading}
                    aria-pressed={active}
                    aria-label={chip.sentence}
                  >
                    <span>{chip.label}</span>
                  </button>
                  );
                })}
              </div>
              <div
                id="wizardUnderstandingPreview"
                className={`${styles.wizardUnderstandingBar} ${liveFacts.length > 0 ? styles.wizardUnderstandingBarActive : ""}`}
                aria-live="polite"
              >
                {liveFacts.length > 0 ? (
                  <span>{WIZARD_COPY[locale].understood} {liveFacts.join(" · ")}</span>
                ) : (
                  <span id="wizardFreeTextHelp">{WIZARD_COPY[locale].tip}</span>
                )}
              </div>
            </div>

            <div className={styles.wizardFreeTextActions}>
              <button
                type="button"
                className={styles.wizardBtnPrimary}
                onClick={handleFreeTextSubmit}
                disabled={freeTextLoading || !freeText.trim()}
              >
                {freeTextLoading ? WIZARD_COPY[locale].loading : WIZARD_COPY[locale].submit}
              </button>
              <button
                type="button"
                className={styles.wizardBtnSecondary}
                onClick={() => {
                  triggerClick();
                  setFreeText("");
                  setActiveChipKey(null);
                }}
                disabled={freeTextLoading || !freeText.trim()}
              >
                {WIZARD_COPY[locale].clear}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSpinning = () => (
    <div className={styles.wizardStep}>
      <div className={styles.wizardLoader}>
        <div className={styles.wizardWheelOuter}>
          <div className={styles.wizardWheelInner}>
            <p className={styles.wizardSpinningText}>{spinningLabel}</p>
          </div>
        </div>
        <p className={styles.wizardLoaderSub}>{t(locale, "wizardSpinning")}</p>
      </div>
    </div>
  );

  const renderResult = () => {
    if (!result) {
      return (
        <div className={styles.wizardStep}>
          <div className={styles.wizardResultCard}>
            <p>{t(locale, "result_no_match")}</p>
            <button type="button" className={styles.wizardBtnPrimary} onClick={handleRestart}>
              {WIZARD_COPY[locale].tryAnother}
            </button>
          </div>
        </div>
      );
    }
    const rationale = explainMatch(result.mainItem, answers, locale);
    const mainName = localized(result.mainItem.item.title, locale);
    const subtitle = getResultSubtitle(result, locale);
    const budgetLine = formatBudgetLine(result, currency, locale);
    const budgetRemaining = formatBudgetRemaining(result, currency, locale);
    // LLM-supplied rationale wins when present; otherwise the local chips
    // generated by explainMatch handle the "why this item" story.
    const showLlmRationale = result.source === "groq" && result.rationaleText && result.rationaleText.trim().length > 0;
    return (
      <div className={styles.wizardStep}>
        <div className={styles.wizardResultCard}>
          <div className={styles.wizardResultTopline}>
            <span className={styles.wizardResultBadge}>{subtitle}</span>
            {result.source === "groq" ? (
              <span className={styles.wizardResultSource}>
                <Sparkles size={13} />
                {t(locale, "wizard_ai_label")}
              </span>
            ) : null}
          </div>
          {result.isSurprise ? (
            <div className={styles.wizardResultSurprise}>
              <Wand2 size={14} />
              <span>{t(locale, "r_surprise")}</span>
            </div>
          ) : null}
          <h4 className={styles.wizardResultTitle}>{mainName}</h4>
          <p className={styles.wizardResultPrice}>
            {formatPrice(result.mainItem.item.price, currency, locale)}
          </p>
          {budgetLine ? (
            <div className={styles.wizardBudgetBox}>
              <p className={styles.wizardBudgetLine}>{budgetLine}</p>
              {budgetRemaining ? <p className={styles.wizardBudgetRemaining}>{budgetRemaining}</p> : null}
              {result.budgetStatus === "food_only_within_budget" ? (
                <p className={styles.wizardBudgetNote}>{WIZARD_COPY[locale].foodOnlyBudget}</p>
              ) : null}
            </div>
          ) : null}
          {result.matchedFacts && result.matchedFacts.length > 0 ? (
            <p className={styles.wizardMatchedFacts}>
              {WIZARD_COPY[locale].matched} {result.matchedFacts.join(" · ")}
            </p>
          ) : null}
          {showLlmRationale ? (
            <p className={styles.wizardResultDesc}>{result.rationaleText}</p>
          ) : (
            <p className={styles.wizardResultDesc}>{rationale.sentence}</p>
          )}
          {rationale.reasons.length > 0 && !showLlmRationale ? (
            <div className={styles.wizardRationaleChips}>
              {rationale.reasons.map((r, i) => (
                <span key={i} className={styles.wizardRationaleChip}>{r}</span>
              ))}
            </div>
          ) : null}
          {!showLlmRationale && result.mainItem.item.description && (() => {
            const d = localized(result.mainItem.item.description, locale);
            return d ? <p className={styles.wizardResultDesc}>{d}</p> : null;
          })()}

          {/* Combo */}
          {result.combo.side || result.combo.drink ? (
            <div className={styles.wizardComboSection}>
              <h5>{t(locale, "result_combo_heading")}</h5>
              <div className={styles.wizardComboGrid}>
                {result.combo.side ? (
                  <div className={styles.wizardComboItem}>
                    <span className={styles.comboItemIcon}><Icon name="anchor_food" size={18} /></span>
                    <div>
                      <p className={styles.comboItemTitle}>{localized(result.combo.side.item.title, locale)}</p>
                      <p className={styles.comboItemPrice}>{formatPrice(result.combo.side.item.price, currency, locale)}</p>
                      <p className={styles.comboItemReason}>{comboReasonText("side", result, result.combo.side, locale)}</p>
                    </div>
                  </div>
                ) : null}
                {result.combo.drink ? (
                  <div className={styles.wizardComboItem}>
                    <span className={styles.comboItemIcon}><Icon name="anchor_drink" size={18} /></span>
                    <div>
                      <p className={styles.comboItemTitle}>{localized(result.combo.drink.item.title, locale)}</p>
                      <p className={styles.comboItemPrice}>{formatPrice(result.combo.drink.item.price, currency, locale)}</p>
                      <p className={styles.comboItemReason}>{comboReasonText("drink", result, result.combo.drink, locale)}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* Alternatives */}
          {result.alternatives.length > 0 ? (
            <div className={styles.wizardAlternativesSection}>
              <h5>{t(locale, "result_alternatives_heading")}</h5>
              <div className={styles.wizardAlternativesList}>
                {result.alternatives.slice(0, 2).map((alt) => (
                  <div key={alt.item.id} className={styles.wizardAltItem}>
                    <span className={styles.wizardAltTitle}>
                      <span className={styles.wizardAltReason}>{alternativeLabel(alt, result, locale)}</span>
                      {localized(alt.item.title, locale)}
                    </span>
                    <span className={styles.wizardAltPrice}>{formatPrice(alt.item.price, currency, locale)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className={styles.wizardResultActions}>
            <button type="button" className={styles.wizardBtnPrimary} onClick={onClose}>
              {t(locale, "wizard_show_in_menu")}
            </button>
            <button
              type="button"
              className={styles.wizardBtnSecondary}
              onClick={result.alternatives.length > 0 ? handleShowAnother : handleRestart}
            >
              <RotateCcw size={14} />
              <span>{WIZARD_COPY[locale].tryAnother}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.wizardBackdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.wizardModal}
        role="dialog"
        aria-modal="true"
        aria-label={t(locale, "wizardTitle")}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.wizardClose} onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className={styles.wizardHeader}>
          <Sparkles className={styles.wizardSparkle} size={24} />
          <h2>{t(locale, "wizardTitle")}</h2>
          <div className={styles.wizardKicker}>
            {step === "result" || activeTab === "text" ? WIZARD_COPY[locale].headerKicker : WIZARD_COPY[locale].tabs.quiz}
          </div>
        </div>

        <div className={styles.wizardBody}>
          {step === "intro" ? renderIntro() : null}
          {step === "q_mood" || step === "q_anchor" || step === "q_food_protein" || step === "q_food_hunger" || step === "q_food_texture" || step === "q_drink_temp" || step === "q_drink_alcohol" || step === "q_drink_profile" ? renderQuestion() : null}
          {step === "spinning" ? renderSpinning() : null}
          {step === "result" ? renderResult() : null}
        </div>
      </div>
    </div>
  );
}
