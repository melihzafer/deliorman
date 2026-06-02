"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Sparkles, X, RotateCcw } from "lucide-react";
import { formatPrice, localized } from "./masaMenuUtils";
import { t } from "./masaTranslations";
import type { Locale, MasaStyles, QrMenuCategory, QrMenuItem } from "./masaTypes";
import { playClick } from "./masaAudioUtils";

interface MasaTasteWizardProps {
  categories: QrMenuCategory[];
  activeCategory: QrMenuCategory | undefined;
  currency: string;
  locale: Locale;
  onClose: () => void;
  styles: MasaStyles;
  soundEnabled?: boolean;
}

type Step =
  | "intro"
  | "q_type"
  // Food path
  | "q_food_flavor"
  | "q_food_hunger"
  | "q_food_base"
  | "q_food_prep"
  | "q_food_diet"
  // Drink path
  | "q_drink_temp"
  | "q_drink_alcohol"
  | "q_drink_vibe"
  | "q_drink_texture"
  | "q_drink_sweet"
  | "spinning"
  | "result";

function getOptionIcon(type: string, size = 32) {
  const commonProps = {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    stroke: "currentColor",
    strokeWidth: 1.75,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style: { display: "block", flexShrink: 0 }
  };

  switch (type) {
    case "food":
      return (
        <svg {...commonProps}>
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
      );
    case "drink":
      return (
        <svg {...commonProps}>
          <path d="M21 22H3M6 12h12M12 12v10M18 2H6l6 10Z" />
        </svg>
      );
    case "savory":
      return (
        <svg {...commonProps}>
          <path d="M12 2c5.523 0 10 3.582 10 8 0 3.42-2.733 6.305-6.57 7.424A7.472 7.472 0 0 1 12 19c-5.523 0-10-3.582-10-8s4.477-8 10-8Z" />
          <path d="M11 7c2 0 3.5 1.5 3.5 3s-1.5 2-3.5 2-3.5-1.5-3.5-3S9 7 11 7Z" />
          <path d="M15 13a2.5 2.5 0 0 0 0 5" />
        </svg>
      );
    case "sweet":
      return (
        <svg {...commonProps}>
          <path d="M12 2v6M21 16H3l9-12 9 12Z" />
          <path d="M3 16c0 2.2 4 4 9 4s9-1.8 9-4M12 20v2" />
        </svg>
      );
    case "fresh":
      return (
        <svg {...commonProps}>
          <circle cx={12} cy={12} r={10} />
          <path d="M12 2v20M2 12h20M19 12a7 7 0 0 1-7 7M12 5a7 7 0 0 1 7 7M5 12a7 7 0 0 1 7-7M12 19a7 7 0 0 1-7-7" />
        </svg>
      );
    case "spicy":
      return (
        <svg {...commonProps}>
          <path d="M18 2c-1.5 0-3 1.5-4 3A12.7 12.7 0 0 0 4 15c0 3.9 3.1 7 7 7a12.7 12.7 0 0 0 10-10c1.5-1 3-2.5 3-4 0-2-2.5-6-6-6Z" />
          <path d="m14 5-2 3M17 8l-2 3" />
        </svg>
      );
    case "light":
      return (
        <svg {...commonProps}>
          <path d="M2 11h20a10 10 0 0 1-20 0Z" />
          <path d="M12 6V2M9 7 7 4M15 7l2-3M5 11c0-3 3-5 7-5s7 2 7 5" />
        </svg>
      );
    case "standard":
      return (
        <svg {...commonProps}>
          <path d="M3 11c0-4 4-6 9-6s9 2 9 6H3ZM2 15h20M3 18h18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
          <path d="M5 15a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
        </svg>
      );
    case "feast":
      return (
        <svg {...commonProps}>
          <path d="M16 16c2.5 0 4.5-2 4.5-4.5S18.5 7 16 7M8 16c-2.5 0-4.5-2-4.5-4.5S5.5 7 8 7" />
          <rect x={6} y={10} width={12} height={8} rx={4} />
          <path d="M12 10V4M9 5l3-3 3 3M3 21h18" />
        </svg>
      );
    case "meat":
      return (
        <svg {...commonProps}>
          <path d="M15.5 8.5C18.5 5.5 22 2 22 2s-3.5 3.5-6.5 6.5C13 11 9 10 7 12s-2 6-2 6 4 0 6-2 1-6 4.5-7.5Z" />
          <path d="M5 18a3 3 0 0 0-3 3 1.5 1.5 0 0 0 3 0 1.5 1.5 0 0 0 0-3 3 3 0 0 0-3 3M2 22l4-4" />
        </svg>
      );
    case "cheese":
      return (
        <svg {...commonProps}>
          <path d="M3 18v-4l18-7v11l-18 4Z" />
          <path d="M12 10.5v5M17 8.5v5M7 13.5v3" />
          <circle cx={6} cy={12} r={1.5} />
          <circle cx={14} cy={10} r={1} />
          <circle cx={10} cy={14} r={1.2} />
        </svg>
      );
    case "dough":
      return (
        <svg {...commonProps}>
          <path d="M15 3 3 15M21 21H3c0-10 8-18 18-18v18Z" />
          <circle cx={9} cy={15} r={1.5} />
          <circle cx={14} cy={10} r={1} />
          <circle cx={15} cy={16} r={1.2} />
        </svg>
      );
    case "grill":
      return (
        <svg {...commonProps}>
          <path d="M12 2v6M8 3v4M16 3v4M4 12h16a8 8 0 0 1-16 0ZM7 20l-2 3M17 20l2 3" />
        </svg>
      );
    case "fried":
      return (
        <svg {...commonProps}>
          <rect x={3} y={7} width={12} height={12} rx={6} />
          <path d="m13 15 8-8M9.5 10a1.5 1.5 0 0 1-1.5 1.5" />
        </svg>
      );
    case "raw":
      return (
        <svg {...commonProps}>
          <path d="M2 22c0-5.5 4.5-10 10-10h10M12 12c0-5.5 4.5-10 10-10v10Z" />
          <path d="M12 12V22" />
        </svg>
      );
    case "traditional":
      return (
        <svg {...commonProps}>
          <path d="M4 22V10a8 8 0 0 1 16 0v12M12 2v4M12 10v12M8 12l8 4M16 12 8 16" />
        </svg>
      );
    case "bold":
      return (
        <svg {...commonProps}>
          <path d="m13 2-2 10h9L9 22l2-10H3L13 2Z" />
        </svg>
      );
    case "hot":
      return (
        <svg {...commonProps}>
          <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8ZM6 2v2M10 2v2M14 2v2" />
        </svg>
      );
    case "cold":
      return (
        <svg {...commonProps}>
          <path d="m2 12 10-10 10 10-10 10L2 12ZM12 2v20M2 12h20M8 8l8 8M16 8 8 16" />
        </svg>
      );
    case "virgin":
      return (
        <svg {...commonProps}>
          <path d="M5 22h14l1-15H4l1 15Z" />
          <path d="M17 7 19 2h-3" />
          <path d="M9 11v6M13 11v4" />
        </svg>
      );
    case "kick":
      return (
        <svg {...commonProps}>
          <path d="M6 21h11a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H6v18ZM20 8h1a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1M6 7H3M6 12H3M6 17H3" />
        </svg>
      );
    case "caffeine":
      return (
        <svg {...commonProps}>
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
          <path d="M7 17S10 14 12 12s5-3 5-3M7 7s5 2 7 5 3 5 3 5" />
        </svg>
      );
    case "fruity":
      return (
        <svg {...commonProps}>
          <circle cx={6} cy={18} r={4} />
          <circle cx={18} cy={16} r={4} />
          <path d="M6 14V4c0-1.1.9-2 2-2h10v10" />
          <path d="m13 2 5 3" />
        </svg>
      );
    case "herbal":
      return (
        <svg {...commonProps}>
          <path d="M12 22C12 12 22 12 22 12s-10 0-10 10ZM12 22C12 12 2 12 2 12s10 0 10 10ZM12 2c0 10 10 10 10 10s-10 0-10-10ZM12 2C12 12 2 12 2 12s10 0 10-10Z" />
        </svg>
      );
    case "fizzy":
      return (
        <svg {...commonProps}>
          <circle cx={6} cy={8} r={2} />
          <circle cx={14} cy={6} r={3} />
          <circle cx={18} cy={14} r={1.5} />
          <circle cx={8} cy={18} r={2.5} />
          <circle cx={13} cy={13} r={2} />
        </svg>
      );
    case "still":
      return (
        <svg {...commonProps}>
          <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7Z" />
        </svg>
      );
    case "sweet_rich":
      return (
        <svg {...commonProps}>
          <path d="M12 2v6M8 8h8M7 11h10M6 14h12M8 17h8M12 17v5" />
          <path d="M19 14a2 2 0 0 1-2 2h-1M5 14a2 2 0 0 0 2 2h1" />
        </svg>
      );
    case "crisp":
      return (
        <svg {...commonProps}>
          <circle cx={12} cy={12} r={10} />
          <path d="m12 12-4-8M12 12l6-4M12 12l4 8" />
        </svg>
      );
    default:
      return null;
  }
}

export function MasaTasteWizard({
  categories,
  activeCategory,
  currency,
  locale,
  onClose,
  styles,
  soundEnabled = true,
}: MasaTasteWizardProps) {
  const [step, setStep] = useState<Step>("intro");
  
  // Quiz Answers State
  const [typeChoice, setTypeChoice] = useState<"food" | "drink">("food");
  
  // Food Quiz State
  const [foodFlavor, setFoodFlavor] = useState<"savory" | "sweet" | "fresh" | "spicy">("savory");
  const [foodHunger, setFoodHunger] = useState<"light" | "standard" | "feast">("standard");
  const [foodBase, setFoodBase] = useState<"meat" | "cheese" | "dough">("meat");
  const [foodPrep, setFoodPrep] = useState<"grill" | "fried" | "raw">("grill");
  const [foodDiet, setFoodDiet] = useState<"traditional" | "bold">("traditional");

  // Drink Quiz State
  const [drinkTemp, setDrinkTemp] = useState<"hot" | "cold">("cold");
  const [drinkAlcohol, setDrinkAlcohol] = useState<"virgin" | "kick">("virgin");
  const [drinkVibe, setDrinkVibe] = useState<"caffeine" | "fruity" | "herbal">("herbal");
  const [drinkTexture, setDrinkTexture] = useState<"fizzy" | "still">("still");
  const [drinkSweet, setDrinkSweet] = useState<"sweet" | "crisp">("crisp");

  const [spinningItemName, setSpinningItemName] = useState("");
  const [resultItem, setResultItem] = useState<(QrMenuItem & { categoryId?: string }) | null>(null);
  const [comboSide, setComboSide] = useState<QrMenuItem | null>(null);
  const [comboDrink, setComboDrink] = useState<QrMenuItem | null>(null);

  const triggerClick = () => {
    playClick(soundEnabled);
  };

  // Flatten all items across all categories
  const allItems = useMemo(() => {
    return categories.flatMap((cat) =>
      cat.items.map((item) => ({
        ...item,
        categoryId: cat.id,
      }))
    );
  }, [categories]);

  // Weighted profiling recommendation algorithm
  const getFilteredItemsByScore = () => {
    if (allItems.length === 0) return [];

    const scoredItems = allItems.map((item) => {
      const catId = item.categoryId || "";
      const isDrinkCat = catId === "hot-beverages" || catId === "beer-cider-other-drinks";
      
      // Filter out items of the wrong main category type (Hard Filter)
      if (typeChoice === "food" && isDrinkCat) return { item, score: -9999 };
      if (typeChoice === "drink" && !isDrinkCat) return { item, score: -9999 };

      let score = 0;
      const titleLower = localized(item.title, locale).toLowerCase();
      const descLower = localized(item.description, locale).toLowerCase();

      if (typeChoice === "food") {
        // 1. Flavor Profile Match (Sweet vs Savory vs Fresh vs Spicy)
        const isSweet = catId === "nuts-desserts" || ["шоколад", "крем", "десерт", "торта", "мед", "захар", "малина", "баклава", "палачинка", "сладък", "сладолед", "fruit", "cake", "sweet", "dessert"].some(kw => titleLower.includes(kw) || descLower.includes(kw));
        const isFresh = catId === "salads" || ["салата", "пресен", "домат", "краставица", "кисело", "свеж", "лимон", "зелена", "salad", "fresh", "lemon"].some(kw => titleLower.includes(kw) || descLower.includes(kw));
        const isSpicy = ["лют", "люто", "пикант", "чили", "пикантна", "пикантно", "суджук", "spicy", "chili", "hot"].some(kw => titleLower.includes(kw) || descLower.includes(kw));
        
        let itemFlavor: "sweet" | "fresh" | "spicy" | "savory" = "savory";
        if (isSweet) itemFlavor = "sweet";
        else if (isFresh) itemFlavor = "fresh";
        else if (isSpicy) itemFlavor = "spicy";

        if (foodFlavor === itemFlavor) score += 30;

        // 2. Hunger Match (Light/Snack vs Standard vs Feast)
        const priceNum = Number(item.price) || 0;
        let itemHunger: "light" | "standard" | "feast" = "standard";
        if (priceNum < 6.00 || catId === "hot-appetizers" || catId === "salads") {
          itemHunger = "light";
        } else if (priceNum >= 12.00 || catId === "grill" || catId === "saj-fish-specialties" || ["плата", "мешана", "сач", "ребра"].some(kw => titleLower.includes(kw))) {
          itemHunger = "feast";
        }
        if (foodHunger === itemHunger) score += 25;

        // 3. Base Ingredient Match (Meat vs Cheese/Veg vs Dough)
        const isMeat = ["телешко", "свинско", "агнешко", "пиле", "месо", "шунка", "филе", "скара", "грил", "бургер", "кайма", "крилца", "дробчета", "дюнер", "суджук", "луканка", "beef", "pork", "grill", "chicken", "burger", "meat", "ham", "wing"].some(kw => titleLower.includes(kw) || descLower.includes(kw)) || catId === "grill" || catId === "burgers";
        const isDough = ["пица", "тесто", "пърленка", "питка", "хляб", "сандвич", "pizza", "bread", "dough"].some(kw => titleLower.includes(kw) || descLower.includes(kw)) || catId === "pizzas";
        
        let itemBase: "meat" | "cheese" | "dough" = "cheese";
        if (isMeat) itemBase = "meat";
        else if (isDough) itemBase = "dough";

        if (foodBase === itemBase) score += 20;

        // 4. Prep Style Match (Grill/Baked vs Fried/Crispy vs Raw/Cold)
        const isGrill = ["скара", "грил", "пещ", "запечен", "печен", "grill", "baked"].some(kw => titleLower.includes(kw) || descLower.includes(kw)) || catId === "grill" || catId === "pizzas";
        const isFried = ["пържени", "пане", "чипс", "флейкс", "крилца", "fried", "crispy"].some(kw => titleLower.includes(kw) || descLower.includes(kw)) || catId === "hot-appetizers";
        const isRaw = ["суров", "салата", "таратор", "студено", "пресен", "salad", "raw", "cold"].some(kw => titleLower.includes(kw) || descLower.includes(kw)) || catId === "salads";

        let itemPrep: "grill" | "fried" | "raw" = "grill";
        if (isFried) itemPrep = "fried";
        else if (isRaw) itemPrep = "raw";

        if (foodPrep === itemPrep) score += 15;

        // 5. Dietary Style Match (Traditional vs Bold/Modern)
        const isTraditional = ["шопска", "овчарска", "боб", "шкембе", "питка", "домашна", "мешана", "наденица", "кавърма", "самуил", "разград"].some(kw => titleLower.includes(kw));
        let itemDiet: "traditional" | "bold" = isTraditional ? "traditional" : "bold";

        if (foodDiet === itemDiet) score += 10;

      } else {
        // 1. Temperature Match (Hot vs Cold)
        const isHot = catId === "hot-beverages";
        const itemTemp: "hot" | "cold" = isHot ? "hot" : "cold";
        if (drinkTemp === itemTemp) score += 40;

        // 2. Alcohol Match (Virgin vs Kick)
        const isAlcohol = ["бира", "вино", "ракия", "сайдер", "уиски", "водка", "джин", "beer", "wine", "cider", "alcohol"].some(kw => titleLower.includes(kw) || descLower.includes(kw));
        const itemAlcohol: "virgin" | "kick" = isAlcohol ? "kick" : "virgin";
        if (drinkAlcohol === itemAlcohol) score += 30;

        // 3. Vibe Effect Match (Caffeine vs Fruity vs Herbal/Malt)
        const isCaffeine = ["кафе", "еспресо", "нес", "капучино", "мокачино", "energy", "еспресо", "coffee", "caffeine"].some(kw => titleLower.includes(kw));
        const isFruity = ["плодов", "малина", "лимон", "сок", "cider", "сайдер", "вино", "fanta", "фанта", "fruit", "juice"].some(kw => titleLower.includes(kw) || descLower.includes(kw));
        
        let itemVibe: "caffeine" | "fruity" | "herbal" = "herbal";
        if (isCaffeine) itemVibe = "caffeine";
        else if (isFruity) itemVibe = "fruity";

        if (drinkVibe === itemVibe) score += 20;

        // 4. Texture Match (Fizzy vs Still)
        const isFizzy = ["кола", "газирана", "сода", "бира", "швепс", "спрайт", "fanta", "sprite", "soda", "fizzy", "carbonated", "beer"].some(kw => titleLower.includes(kw) || descLower.includes(kw));
        const itemTexture: "fizzy" | "still" = isFizzy ? "fizzy" : "still";
        if (drinkTexture === itemTexture) score += 15;

        // 5. Sweetness Match (Sweet vs Crisp/Dry)
        const isSweetDrink = ["шоколад", "какао", "сок", "кола", "кока", "мед", "захар", "сладка", "sweet", "juice", "cola"].some(kw => titleLower.includes(kw) || descLower.includes(kw));
        const itemSweet: "sweet" | "crisp" = isSweetDrink ? "sweet" : "crisp";
        if (drinkSweet === itemSweet) score += 15;
      }

      return { item, score };
    });

    // Remove filtered out items, sort descending, and return
    return scoredItems
      .filter((res) => res.score > -1000)
      .sort((a, b) => b.score - a.score)
      .map((res) => res.item);
  };

  // Combo Pairing recommendation algorithm
  const findPairings = (mainItem: QrMenuItem & { categoryId?: string }) => {
    let side: QrMenuItem | null = null;
    let drink: QrMenuItem | null = null;

    const mainCat = mainItem.categoryId || "";
    const isDrink = mainCat === "hot-beverages" || mainCat === "beer-cider-other-drinks";

    if (!isDrink) {
      // Recommend drink
      if (mainCat === "nuts-desserts") {
        const hotDrinks = allItems.filter(item => item.categoryId === "hot-beverages");
        if (hotDrinks.length > 0) {
          drink = hotDrinks.find(d => d.id === "kafe-espreso") || hotDrinks[Math.floor(Math.random() * hotDrinks.length)];
        }
      } else {
        const coldDrinks = allItems.filter(item => item.categoryId === "beer-cider-other-drinks");
        if (coldDrinks.length > 0) {
          const isGrillOrBurger = mainCat === "grill" || mainCat === "burgers" || mainCat === "pizzas";
          if (isGrillOrBurger) {
            drink = coldDrinks.find(d => d.id.includes("kamenitza") || d.id.includes("beer")) ||
                    coldDrinks.find(d => d.id.includes("kola") || d.id.includes("cola")) ||
                    coldDrinks[Math.floor(Math.random() * coldDrinks.length)];
          } else {
            drink = coldDrinks.find(d => d.id.includes("kola") || d.id.includes("cola") || d.id.includes("voda") || d.id.includes("water")) ||
                    coldDrinks[Math.floor(Math.random() * coldDrinks.length)];
          }
        }

        // Recommend side (fries / appetizers)
        const sides = allItems.filter(item => item.categoryId === "hot-appetizers");
        if (sides.length > 0) {
          side = sides.find(s => s.id === "parzheni-kartofi" || s.id === "parzheni-kartofi-sas-sirene") ||
                 sides.find(s => s.id === "gratska-chesnova-pitka") ||
                 sides[Math.floor(Math.random() * sides.length)];
        }
      }
    } else {
      // It is a drink! Recommend food sides/snacks
      const foods = allItems.filter(item => item.categoryId !== "hot-beverages" && item.categoryId !== "beer-cider-other-drinks");
      if (foods.length > 0) {
        if (mainCat === "hot-beverages") {
          const desserts = foods.filter(item => item.categoryId === "nuts-desserts");
          if (desserts.length > 0) {
            side = desserts[Math.floor(Math.random() * desserts.length)];
          }
        } else {
          const appetizers = foods.filter(item => item.categoryId === "hot-appetizers" || item.categoryId === "burgers" || item.categoryId === "pizzas");
          if (appetizers.length > 0) {
            side = appetizers.find(a => a.id === "lucheni-kragcheta" || a.id === "pileshki-filentsa-s-kornfleyks") ||
                   appetizers[Math.floor(Math.random() * appetizers.length)];
          }
        }
      }
    }

    setComboSide(side);
    setComboDrink(drink);
  };

  const startSpinning = (filtered: QrMenuItem[]) => {
    triggerClick();
    setStep("spinning");

    // Take top 6 matched items for higher relevance, or fallback to all
    const pool = filtered.length > 0 ? filtered.slice(0, 6) : allItems;
    if (pool.length === 0) {
      setResultItem(null);
      setStep("result");
      return;
    }

    let ticks = 0;
    const maxTicks = 18;
    const interval = setInterval(() => {
      ticks++;
      const randomIdx = Math.floor(Math.random() * pool.length);
      const chosenItem = pool[randomIdx];
      setSpinningItemName(localized(chosenItem.title, locale));
      triggerClick();

      if (ticks >= maxTicks) {
        clearInterval(interval);
        setResultItem(chosenItem);
        findPairings(chosenItem);
        setStep("result");
      }
    }, 100);
  };

  const handleRestart = () => {
    triggerClick();
    setStep("intro");
    setResultItem(null);
    setComboSide(null);
    setComboDrink(null);
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
          {step === "intro" ? (
            <div className={styles.wizardStep}>
              <p className={styles.wizardIntroText}>{t(locale, "wizardIntro")}</p>
              <button
                type="button"
                className={styles.wizardBtnPrimary}
                onClick={() => {
                  triggerClick();
                  setStep("q_type");
                }}
              >
                {locale === "bg" ? "Започни" : locale === "tr" ? "Başla" : "Start"}
              </button>
            </div>
          ) : null}

          {/* Q1: Eat vs Drink */}
          {step === "q_type" ? (
            <div className={styles.wizardStep}>
              <h3>{t(locale, "q_type")}</h3>
              <div className={styles.wizardOptions}>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setTypeChoice("food");
                    triggerClick();
                    setStep("q_food_flavor");
                  }}
                >
                  {getOptionIcon("food")}
                  <span>{t(locale, "q_type_food")}</span>
                </button>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setTypeChoice("drink");
                    triggerClick();
                    setStep("q_drink_temp");
                  }}
                >
                  {getOptionIcon("drink")}
                  <span>{t(locale, "q_type_drink")}</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* FOOD BRANCH: Q2 Flavor */}
          {step === "q_food_flavor" ? (
            <div className={styles.wizardStep}>
              <h3>{t(locale, "q_food_flavor")}</h3>
              <div className={styles.wizardOptions} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setFoodFlavor("savory");
                    triggerClick();
                    setStep("q_food_hunger");
                  }}
                >
                  {getOptionIcon("savory")}
                  <span>{t(locale, "q_flavor_savory")}</span>
                </button>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setFoodFlavor("sweet");
                    triggerClick();
                    setStep("q_food_hunger");
                  }}
                >
                  {getOptionIcon("sweet")}
                  <span>{t(locale, "q_flavor_sweet")}</span>
                </button>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setFoodFlavor("fresh");
                    triggerClick();
                    setStep("q_food_hunger");
                  }}
                >
                  {getOptionIcon("fresh")}
                  <span>{t(locale, "q_flavor_fresh")}</span>
                </button>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setFoodFlavor("spicy");
                    triggerClick();
                    setStep("q_food_hunger");
                  }}
                >
                  {getOptionIcon("spicy")}
                  <span>{t(locale, "q_flavor_spicy")}</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* FOOD BRANCH: Q3 Hunger */}
          {step === "q_food_hunger" ? (
            <div className={styles.wizardStep}>
              <h3>{t(locale, "q_food_hunger")}</h3>
              <div className={styles.wizardOptions} style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setFoodHunger("light");
                    triggerClick();
                    setStep("q_food_base");
                  }}
                >
                  {getOptionIcon("light")}
                  <span>{t(locale, "q_hunger_light")}</span>
                </button>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setFoodHunger("standard");
                    triggerClick();
                    setStep("q_food_base");
                  }}
                >
                  {getOptionIcon("standard")}
                  <span>{t(locale, "q_hunger_standard")}</span>
                </button>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setFoodHunger("feast");
                    triggerClick();
                    setStep("q_food_base");
                  }}
                >
                  {getOptionIcon("feast")}
                  <span>{t(locale, "q_hunger_feast")}</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* FOOD BRANCH: Q4 Base */}
          {step === "q_food_base" ? (
            <div className={styles.wizardStep}>
              <h3>{t(locale, "q_food_base")}</h3>
              <div className={styles.wizardOptions} style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setFoodBase("meat");
                    triggerClick();
                    setStep("q_food_prep");
                  }}
                >
                  {getOptionIcon("meat")}
                  <span>{t(locale, "q_base_meat")}</span>
                </button>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setFoodBase("cheese");
                    triggerClick();
                    setStep("q_food_prep");
                  }}
                >
                  {getOptionIcon("cheese")}
                  <span>{t(locale, "q_base_cheese")}</span>
                </button>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setFoodBase("dough");
                    triggerClick();
                    setStep("q_food_prep");
                  }}
                >
                  {getOptionIcon("dough")}
                  <span>{t(locale, "q_base_dough")}</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* FOOD BRANCH: Q5 Prep */}
          {step === "q_food_prep" ? (
            <div className={styles.wizardStep}>
              <h3>{t(locale, "q_food_prep")}</h3>
              <div className={styles.wizardOptions} style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setFoodPrep("grill");
                    triggerClick();
                    setStep("q_food_diet");
                  }}
                >
                  {getOptionIcon("grill")}
                  <span>{t(locale, "q_prep_grill")}</span>
                </button>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setFoodPrep("fried");
                    triggerClick();
                    setStep("q_food_diet");
                  }}
                >
                  {getOptionIcon("fried")}
                  <span>{t(locale, "q_prep_fried")}</span>
                </button>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setFoodPrep("raw");
                    triggerClick();
                    setStep("q_food_diet");
                  }}
                >
                  {getOptionIcon("raw")}
                  <span>{t(locale, "q_prep_raw")}</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* FOOD BRANCH: Q6 Diet */}
          {step === "q_food_diet" ? (
            <div className={styles.wizardStep}>
              <h3>{t(locale, "q_food_diet")}</h3>
              <div className={styles.wizardOptions}>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setFoodDiet("traditional");
                    const filtered = getFilteredItemsByScore();
                    startSpinning(filtered);
                  }}
                >
                  {getOptionIcon("traditional")}
                  <span>{t(locale, "q_diet_traditional")}</span>
                </button>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setFoodDiet("bold");
                    const filtered = getFilteredItemsByScore();
                    startSpinning(filtered);
                  }}
                >
                  {getOptionIcon("bold")}
                  <span>{t(locale, "q_diet_bold")}</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* DRINK BRANCH: Q2 Temp */}
          {step === "q_drink_temp" ? (
            <div className={styles.wizardStep}>
              <h3>{t(locale, "q_drink_temp")}</h3>
              <div className={styles.wizardOptions}>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setDrinkTemp("hot");
                    triggerClick();
                    setStep("q_drink_alcohol");
                  }}
                >
                  {getOptionIcon("hot")}
                  <span>{t(locale, "q_temp_hot")}</span>
                </button>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setDrinkTemp("cold");
                    triggerClick();
                    setStep("q_drink_alcohol");
                  }}
                >
                  {getOptionIcon("cold")}
                  <span>{t(locale, "q_temp_cold")}</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* DRINK BRANCH: Q3 Alcohol */}
          {step === "q_drink_alcohol" ? (
            <div className={styles.wizardStep}>
              <h3>{t(locale, "q_drink_alcohol")}</h3>
              <div className={styles.wizardOptions}>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setDrinkAlcohol("virgin");
                    triggerClick();
                    setStep("q_drink_vibe");
                  }}
                >
                  {getOptionIcon("virgin")}
                  <span>{t(locale, "q_alcohol_virgin")}</span>
                </button>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setDrinkAlcohol("kick");
                    triggerClick();
                    setStep("q_drink_vibe");
                  }}
                >
                  {getOptionIcon("kick")}
                  <span>{t(locale, "q_alcohol_kick")}</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* DRINK BRANCH: Q4 Vibe */}
          {step === "q_drink_vibe" ? (
            <div className={styles.wizardStep}>
              <h3>{t(locale, "q_drink_vibe")}</h3>
              <div className={styles.wizardOptions} style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px" }}>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setDrinkVibe("caffeine");
                    triggerClick();
                    setStep("q_drink_texture");
                  }}
                >
                  {getOptionIcon("caffeine")}
                  <span>{t(locale, "q_vibe_caffeine")}</span>
                </button>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setDrinkVibe("fruity");
                    triggerClick();
                    setStep("q_drink_texture");
                  }}
                >
                  {getOptionIcon("fruity")}
                  <span>{t(locale, "q_vibe_fruity")}</span>
                </button>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setDrinkVibe("herbal");
                    triggerClick();
                    setStep("q_drink_texture");
                  }}
                >
                  {getOptionIcon("herbal")}
                  <span>{t(locale, "q_vibe_herbal")}</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* DRINK BRANCH: Q5 Texture */}
          {step === "q_drink_texture" ? (
            <div className={styles.wizardStep}>
              <h3>{t(locale, "q_drink_texture")}</h3>
              <div className={styles.wizardOptions}>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setDrinkTexture("fizzy");
                    triggerClick();
                    setStep("q_drink_sweet");
                  }}
                >
                  {getOptionIcon("fizzy")}
                  <span>{t(locale, "q_texture_fizzy")}</span>
                </button>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setDrinkTexture("still");
                    triggerClick();
                    setStep("q_drink_sweet");
                  }}
                >
                  {getOptionIcon("still")}
                  <span>{t(locale, "q_texture_still")}</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* DRINK BRANCH: Q6 Sweet */}
          {step === "q_drink_sweet" ? (
            <div className={styles.wizardStep}>
              <h3>{t(locale, "q_drink_sweet")}</h3>
              <div className={styles.wizardOptions}>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setDrinkSweet("sweet");
                    const filtered = getFilteredItemsByScore();
                    startSpinning(filtered);
                  }}
                >
                  {getOptionIcon("sweet_rich")}
                  <span>{t(locale, "q_sweet_rich")}</span>
                </button>
                <button
                  type="button"
                  className={styles.wizardOptionBtn}
                  onClick={() => {
                    setDrinkSweet("crisp");
                    const filtered = getFilteredItemsByScore();
                    startSpinning(filtered);
                  }}
                >
                  {getOptionIcon("crisp")}
                  <span>{t(locale, "q_sweet_crisp")}</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* Spinning state */}
          {step === "spinning" ? (
            <div className={styles.wizardStep}>
              <div className={styles.wizardLoader}>
                <div className={styles.wizardWheelOuter}>
                  <div className={styles.wizardWheelInner}>
                    <p className={styles.wizardSpinningText}>{spinningItemName}</p>
                  </div>
                </div>
                <p className={styles.wizardLoaderSub}>{t(locale, "wizardSpinning")}</p>
              </div>
            </div>
          ) : null}

          {/* Final recommendation result screen */}
          {step === "result" ? (
            <div className={styles.wizardStep}>
              {resultItem ? (
                <div className={styles.wizardResultCard}>
                  <div className={styles.wizardResultBadge}>{t(locale, "wizardResult")}</div>
                  <h4 className={styles.wizardResultTitle}>{localized(resultItem.title, locale)}</h4>
                  <p className={styles.wizardResultPrice}>
                    {formatPrice(resultItem.price, currency, locale)}
                  </p>
                  {resultItem.description ? (
                    <p className={styles.wizardResultDesc}>
                      {localized(resultItem.description, locale)}
                    </p>
                  ) : null}

                  {/* Combos Matching Recommendations */}
                  {comboSide || comboDrink ? (
                    <div className={styles.wizardComboSection}>
                      <h5>
                        {locale === "bg"
                          ? "С какво да комбинирате (Препоръчано комбо):"
                          : locale === "tr"
                            ? "Harika Bir Menü İçin Eşleştirin:"
                            : "Complete Your Meal (Perfect Combo):"}
                      </h5>
                      <div className={styles.wizardComboGrid}>
                        {comboSide ? (
                          <div className={styles.wizardComboItem}>
                            <span className={styles.comboItemIcon}>{getOptionIcon("food", 20)}</span>
                            <div>
                              <p className={styles.comboItemTitle}>{localized(comboSide.title, locale)}</p>
                              <p className={styles.comboItemPrice}>
                                {formatPrice(comboSide.price, currency, locale)}
                              </p>
                            </div>
                          </div>
                        ) : null}
                        {comboDrink ? (
                          <div className={styles.wizardComboItem}>
                            <span className={styles.comboItemIcon}>{getOptionIcon("drink", 20)}</span>
                            <div>
                              <p className={styles.comboItemTitle}>{localized(comboDrink.title, locale)}</p>
                              <p className={styles.comboItemPrice}>
                                {formatPrice(comboDrink.price, currency, locale)}
                              </p>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  <div className={styles.wizardResultActions}>
                    <button type="button" className={styles.wizardBtnPrimary} onClick={onClose}>
                      {locale === "bg" ? "Виж в менюто" : locale === "tr" ? "Menüde Gör" : "Show in Menu"}
                    </button>
                    <button type="button" className={styles.wizardBtnSecondary} onClick={handleRestart}>
                      <RotateCcw size={14} />
                      <span>{t(locale, "wizardRestart")}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.wizardResultCard}>
                  <p>
                    {locale === "bg"
                      ? "Вълшебникът не откри съвпадение. Опитайте с други въпроси!"
                      : "No matches found. Try again!"}
                  </p>
                  <button type="button" className={styles.wizardBtnPrimary} onClick={handleRestart}>
                    {t(locale, "wizardRestart")}
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
