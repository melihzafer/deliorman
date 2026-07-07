"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, X, RotateCcw, ArrowLeft, Wand2, MessageSquare, ChevronDown } from "lucide-react";
import { formatPrice, localized } from "./masaMenuUtils";
import { t } from "./masaTranslations";
import type { Locale, MasaStyles, QrMenuCategory } from "./masaTypes";
import { playClick } from "./masaAudioUtils";
import { pickRecommendation, getSurprisePick, type WizardPick } from "./wizard/scoring";
import { nextStep, questionNumber } from "./wizard/nextStep";
import { buildCombo, type PairingPick } from "./wizard/pairings";
import { explainMatch } from "./wizard/rationale";
import { inferIntent, type IntentResult } from "./wizard/intentRouter";
import { budgetInEur } from "./wizard/budgetParse";
import { recommend, type WizardPickFromLlm } from "./wizard/llmRecommend";
import type { ScoredItem, WizardAnswers, WizardStep } from "./wizard/types";

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

const SUGGESTION_CHIPS = [
  { labelKey: "chip_fresh_salad", emoji: "🥗" },
  { labelKey: "chip_spicy_grill", emoji: "🔥" },
  { labelKey: "chip_cold_drink", emoji: "🍹" },
  { labelKey: "chip_sweet_dessert", emoji: "🍰" },
  { labelKey: "chip_juicy_steak", emoji: "🥩" },
  { labelKey: "chip_cold_beer", emoji: "🍺" },
];

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
}

export function MasaTasteWizard({
  categories,
  activeCategory,
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
  const [refining, setRefining] = useState(false);
  const [freeText, setFreeText] = useState("");
  const [freeTextLoading, setFreeTextLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"quiz" | "text">("quiz");
  const [freeTextResult, setFreeTextResult] = useState<IntentResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  // Bumped on every finishQuiz() call so a late LLM/local response from a
  // previous quiz run (e.g. the user restarted before it resolved) is
  // ignored instead of overwriting the current result.
  const requestIdRef = useRef(0);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const triggerClick = () => playClick(soundEnabled);

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

  const finishQuiz = (
    finalAnswers: WizardAnswers,
    opts: { freetext?: string; budgetEur?: number | null } = {},
  ) => {
    const mode: "buttons" | "freetext" = opts.freetext ? "freetext" : "buttons";
    const requestId = ++requestIdRef.current;
    const spin = setInterval(() => {
      const pool = categories.flatMap((c) => c.items.map((i) => ({ ...i, categoryId: c.id })));
      if (pool.length === 0) return;
      const randomItem = pool[Math.floor(Math.random() * pool.length)];
      setSpinningLabel(localized(randomItem.title, locale));
      triggerClick();
    }, 110);
    setStep("spinning");

    // Kick off LLM in parallel with the 1.2s UX delay. The local pick is the
    // fallback if the LLM is null, slow (>1.2s + a beat), or fails. We never
    // block the UI on the network call.
    const llmPromise: Promise<WizardPickFromLlm | null> = sessionToken
      ? recommend(
          {
            mode,
            answers: finalAnswers,
            freetext: opts.freetext,
            budgetEur: opts.budgetEur ?? null,
            locale,
            sessionToken,
          },
          categories,
        )
      : Promise.resolve(null);

    const localPromise: Promise<WizardPick | null> = new Promise((resolve) => {
      setTimeout(() => {
        clearInterval(spin);
        resolve(pickRecommendation(categories, finalAnswers, locale, opts.freetext));
      }, 1200);
    });

    void Promise.all([llmPromise, localPromise]).then(([llm, local]) => {
      if (requestIdRef.current !== requestId) return; // stale — user restarted/changed answers
      if (llm) {
        setResult({
          mainItem: llm.main,
          alternatives: llm.alternatives,
          combo: llm.combo,
          confidence: "high",
          isSurprise: false,
          pickIndex: 0,
          source: "groq",
          rationaleText: llm.rationaleText,
        });
        pushHistory({
          itemId: llm.main.item.id,
          titleBg: llm.main.item.title.bg ?? "",
          titleTr: llm.main.item.title.tr ?? "",
          titleEn: llm.main.item.title.en ?? "",
          at: Date.now(),
        });
        setHistory(loadHistory());
        setStep("result");
        return;
      }
      if (!local) {
        // Last-ditch: surprise pick
        const surprise = getSurprisePick(categories);
        if (!surprise) {
          setStep("result");
          setResult(null);
          return;
        }
        const combo = buildCombo(surprise.item, categories);
        setResult({ mainItem: surprise, alternatives: [], combo, confidence: "low", isSurprise: true, pickIndex: 0, source: "surprise" });
        setStep("result");
        return;
      }
      const combo = buildCombo(local.main.item, categories);
      setResult({
        mainItem: local.main,
        alternatives: local.alternatives,
        combo,
        confidence: local.confidence,
        isSurprise: false,
        pickIndex: 0,
        source: "local",
      });
      pushHistory({
        itemId: local.main.item.id,
        titleBg: local.main.item.title.bg ?? "",
        titleTr: local.main.item.title.tr ?? "",
        titleEn: local.main.item.title.en ?? "",
        at: Date.now(),
      });
      setHistory(loadHistory());
      setStep("result");
    });
  };

  const handleSurprise = () => {
    triggerClick();
    requestIdRef.current++; // invalidate any in-flight finishQuiz response
    const surprise = getSurprisePick(categories);
    if (!surprise) return;
    const combo = buildCombo(surprise.item, categories);
    setResult({ mainItem: surprise, alternatives: [], combo, confidence: "low", isSurprise: true, pickIndex: 0, source: "surprise" });
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
    setStep("intro");
    setAnswers({});
    setResult(null);
    setFreeTextResult(null);
    setFreeText("");
    setActiveTab("quiz");
  };

  const handleShowAnother = () => {
    if (!result || result.alternatives.length === 0) return;
    triggerClick();
    const next = result.alternatives[result.pickIndex] ?? result.alternatives[0];
    const newAlternatives = [result.mainItem, ...result.alternatives.filter((_, i) => i !== result.pickIndex)];
    const combo = buildCombo(next.item, categories);
    setResult({
      mainItem: next,
      alternatives: newAlternatives,
      combo,
      confidence: result.confidence,
      isSurprise: false,
      pickIndex: 0,
      // After "show another" the pick is local — we don't re-call the LLM
      // for the second result because the LLM's job was to pick the winner.
      source: "local",
    });
  };

  const handleRefine = () => {
    triggerClick();
    setRefining(true);
    setStep("q_mood");
    setResult(null);
  };

  const handleFreeTextSubmit = async () => {
    if (!freeText.trim()) return;
    triggerClick();
    setFreeTextLoading(true);
    try {
      const intent = await inferIntent({ text: freeText });
      setFreeTextResult(intent);
      const hasAnswers = intent.answers && Object.keys(intent.answers).length > 0;
      // Always pass the raw text + extracted budget to the LLM, even when the
      // lexicon produced no signals. Budget is sourced-of-truth regardless.
      const budgetEur = budgetInEur(freeText);
      if (hasAnswers || budgetEur != null) {
        const answers = intent.answers ?? {};
        setAnswers(answers);
        setStep("spinning");
        setTimeout(() => {
          finishQuiz(answers, { freetext: freeText, budgetEur });
          setFreeText("");
          setFreeTextResult(null);
        }, 800);
      } else {
        setFreeTextResult({ answers: {}, coverage: 0, source: "buttons-only", signals: [] });
      }
    } finally {
      setFreeTextLoading(false);
    }
  };

  const handleChipClick = (labelKey: string) => {
    triggerClick();
    const label = t(locale, labelKey);
    setFreeText((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return label;
      return `${trimmed} ${label}`;
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
            onClick={() => {
              triggerClick();
              setActiveTab("quiz");
            }}
          >
            <Sparkles size={16} />
            <span>{t(locale, "wizard_tab_quiz")}</span>
          </button>
          <button
            type="button"
            className={`${styles.wizardTabBtn} ${activeTab === "text" ? styles.wizardTabBtnActive : ""}`}
            onClick={() => {
              triggerClick();
              setActiveTab("text");
            }}
          >
            <MessageSquare size={16} />
            <span>{t(locale, "wizard_tab_text")}</span>
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
              <textarea
                id="wizardFreeTextInput"
                className={styles.wizardFreeTextInput}
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder={t(locale, "free_text_placeholder")}
                rows={3}
                disabled={freeTextLoading}
                autoFocus
              />
              
              {/* Suggestion Chips */}
              <div className={styles.wizardFreeTextSuggestions}>
                {SUGGESTION_CHIPS.map((chip) => (
                  <button
                    key={chip.labelKey}
                    type="button"
                    className={styles.wizardSuggestionChip}
                    onClick={() => handleChipClick(chip.labelKey)}
                    disabled={freeTextLoading}
                  >
                    <span className={styles.wizardSuggestionEmoji}>{chip.emoji}</span>
                    <span>{t(locale, chip.labelKey)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.wizardFreeTextActions}>
              <button
                type="button"
                className={styles.wizardBtnPrimary}
                onClick={handleFreeTextSubmit}
                disabled={freeTextLoading || !freeText.trim()}
              >
                {freeTextLoading ? t(locale, "free_text_loading_ai") : t(locale, "free_text_submit")}
              </button>
              <button
                type="button"
                className={styles.wizardBtnSecondary}
                onClick={() => {
                  triggerClick();
                  setFreeText("");
                  setFreeTextResult(null);
                }}
                disabled={freeTextLoading || !freeText.trim()}
              >
                {t(locale, "wizardRestart")}
              </button>
            </div>
            {freeTextResult && freeTextResult.source === "buttons-only" ? (
              <p className={styles.wizardFreeTextHint} style={{ marginTop: "10px" }}>{t(locale, "free_text_no_match")}</p>
            ) : null}
            {freeTextResult && freeTextResult.signals.length > 0 ? (
              <div className={styles.wizardFreeTextChips} style={{ marginTop: "10px" }}>
                {freeTextResult.signals.map((s, i) => (
                  <span key={`${s.dim}-${i}`} className={styles.wizardFreeTextChip}>
                    {s.dim}: {s.value}
                  </span>
                ))}
              </div>
            ) : null}
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
              {t(locale, "wizardRestart")}
            </button>
          </div>
        </div>
      );
    }
    const rationale = explainMatch(result.mainItem, answers, locale);
    const mainName = localized(result.mainItem.item.title, locale);
    // LLM-supplied rationale wins when present; otherwise the local chips
    // generated by explainMatch handle the "why this item" story.
    const showLlmRationale = result.source === "groq" && result.rationaleText && result.rationaleText.trim().length > 0;
    return (
      <div className={styles.wizardStep}>
        <div className={styles.wizardResultCard}>
          <div className={styles.wizardResultBadge}>{t(locale, "wizardResult")}</div>
          {result.source === "groq" ? (
            <div className={styles.wizardResultSurprise}>
              <Sparkles size={14} />
              <span>{t(locale, "wizard_ai_label")}</span>
            </div>
          ) : null}
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
          {showLlmRationale ? (
            <p className={styles.wizardResultDesc}>{result.rationaleText}</p>
          ) : null}
          {rationale.reasons.length > 0 ? (
            <div className={styles.wizardRationaleChips}>
              {rationale.reasons.map((r, i) => (
                <span key={i} className={styles.wizardRationaleChip}>{r}</span>
              ))}
            </div>
          ) : null}
          {result.mainItem.item.description && (() => {
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
                      <p className={styles.comboItemReason}>{t(locale, result.combo.side.reasonKey)}</p>
                    </div>
                  </div>
                ) : null}
                {result.combo.drink ? (
                  <div className={styles.wizardComboItem}>
                    <span className={styles.comboItemIcon}><Icon name="anchor_drink" size={18} /></span>
                    <div>
                      <p className={styles.comboItemTitle}>{localized(result.combo.drink.item.title, locale)}</p>
                      <p className={styles.comboItemPrice}>{formatPrice(result.combo.drink.item.price, currency, locale)}</p>
                      <p className={styles.comboItemReason}>{t(locale, result.combo.drink.reasonKey)}</p>
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
                {result.alternatives.slice(0, 3).map((alt) => (
                  <div key={alt.item.id} className={styles.wizardAltItem}>
                    <span className={styles.wizardAltTitle}>{localized(alt.item.title, locale)}</span>
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
            {result.alternatives.length > 0 ? (
              <button type="button" className={styles.wizardBtnSecondary} onClick={handleShowAnother}>
                <RotateCcw size={14} />
                <span>{t(locale, "result_show_another")}</span>
              </button>
            ) : null}
            <button type="button" className={styles.wizardBtnSecondary} onClick={handleRefine}>
              <ArrowLeft size={14} />
              <span>{t(locale, "result_refine")}</span>
            </button>
            <button type="button" className={styles.wizardBtnSecondary} onClick={handleRestart}>
              <Sparkles size={14} />
              <span>{t(locale, "wizardRestart")}</span>
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
            {activeCategory ? localized(activeCategory.title, locale) : ""}
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
