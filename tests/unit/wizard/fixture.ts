// Tiny test fixture for wizard unit tests — represents the real menu shape
// (subset) so we can test the scoring / pairing / rationale modules without
// needing to load the full /public/data/menu.json.

import type { QrMenuCategory, QrMenuItem, QrMenuData } from "../../../src/app/masa/masaTypes";

function item(id: string, bg: string, tr: string, en: string, price: number, desc = ""): QrMenuItem {
  return {
    id,
    title: { bg, tr, en },
    description: { bg: desc, tr: desc, en: desc },
    amount: "",
    price,
    allergens: [],
  };
}

export const TEST_CATEGORIES: QrMenuCategory[] = [
  {
    id: "hot-beverages",
    order: 10,
    title: { bg: "Топли", tr: "Sıcak", en: "Hot" },
    description: { bg: "", tr: "", en: "" },
    items: [
      item("espresso", "Еспресо", "Espresso", "Espresso", 1.95),
      item("cappuccino", "Капучино", "Cappuccino", "Cappuccino", 2.73),
      item("hot-chocolate", "Горещ шоколад", "Sıcak Çikolata", "Hot Chocolate", 2.73),
    ],
  },
  {
    id: "salads",
    order: 20,
    title: { bg: "Салати", tr: "Salatalar", en: "Salads" },
    description: { bg: "", tr: "", en: "" },
    items: [
      item("shopska", "Шопска", "Şopska", "Shopska", 7.82, "томати, краставици, сирене"),
      item("caesar", "Цезар", "Sezar", "Caesar", 11.73, "пиле, маруля, пармезан"),
    ],
  },
  {
    id: "grill",
    order: 60,
    title: { bg: "Скара", tr: "Izgara", en: "Grill" },
    description: { bg: "", tr: "", en: "" },
    items: [
      item("kebabche", "Кебапче", "Kebapçe", "Kebapche", 1.95),
      item("chicken-skewer", "Пилешки шиш", "Tavuk Şiş", "Chicken Skewer", 3.91),
      item("mixed-grill", "Мешена скара", "Karışık Izgara", "Mixed Grill", 34.22),
    ],
  },
  {
    id: "pizzas",
    order: 50,
    title: { bg: "Пици", tr: "Pizzalar", en: "Pizzas" },
    description: { bg: "", tr: "", en: "" },
    items: [
      item("margherita", "Маргарита", "Margarita", "Margherita", 7.62, "домат, моцарела"),
    ],
  },
  {
    id: "nuts-desserts",
    order: 110,
    title: { bg: "Десерти", tr: "Tatlılar", en: "Desserts" },
    description: { bg: "", tr: "", en: "" },
    items: [
      item("ice-cream", "Сладолед", "Dondurma", "Ice Cream", 5.67),
    ],
  },
  {
    id: "beer-cider-other-drinks",
    order: 140,
    title: { bg: "Бира", tr: "Bira", en: "Beer" },
    description: { bg: "", tr: "", en: "" },
    items: [
      item("carlsberg", "Carlsberg", "Carlsberg", "Carlsberg", 3.91),
      item("carlsberg-0-0", "Carlsberg 0.0%", "Carlsberg 0.0%", "Carlsberg 0.0%", 4.3),
    ],
  },
  {
    id: "rakia",
    order: 120,
    title: { bg: "Ракия", tr: "Rakı", en: "Rakia" },
    description: { bg: "", tr: "", en: "" },
    items: [
      item("peshterska", "Пещерска", "Peshterska", "Peshterska", 2.34),
    ],
  },
  {
    id: "wines",
    order: 130,
    title: { bg: "Вина", tr: "Şarap", en: "Wines" },
    description: { bg: "", tr: "", en: "" },
    items: [
      item("white-wine", "Бяло вино", "Beyaz Şarap", "White Wine", 14.66),
    ],
  },
];

export function makeMenu(): QrMenuData {
  return {
    version: 1,
    restaurantName: "Test",
    currency: "BGN",
    categories: TEST_CATEGORIES,
  };
}
