// A menu fixture built from REAL production item ids (see
// src/app/masa/wizard/menuTags.ts) so getItemTags() returns curated tags
// instead of the untagged fallback. fixture.ts intentionally uses fake ids
// to test the scoring engine's fallback path — this fixture is for tests
// that need real course/protein/state/vibe tags (candidate filtering,
// customer-mode driven scenarios, budget repair).

import type { QrMenuCategory, QrMenuItem } from "../../../src/app/masa/masaTypes";

function item(id: string, bg: string, tr: string, en: string, price: number): QrMenuItem {
  return { id, title: { bg, tr, en }, description: { bg: "", tr: "", en: "" }, amount: "", price, allergens: [] };
}

function cat(id: string, items: QrMenuItem[]): QrMenuCategory {
  return { id, order: 0, title: { bg: "", tr: "", en: "" }, description: { bg: "", tr: "", en: "" }, items };
}

export const REAL_MENU_CATEGORIES: QrMenuCategory[] = [
  cat("hot-beverages", [
    item("kafe-espreso", "Еспресо", "Espresso", "Espresso", 1.95),
    item("kapuchino", "Капучино", "Cappuccino", "Cappuccino", 2.73),
  ]),
  cat("salads", [
    item("shopska-salata", "Шопска салата", "Şopska Salata", "Shopska Salad", 7.82),
    item("salata-tsezar", "Салата Цезар", "Sezar Salata", "Caesar Salad", 11.73),
  ]),
  cat("hot-appetizers", [
    item("parzheni-kartofi", "Пържени картофи", "Kızarmış Patates", "French Fries", 4.5),
    item("pileshki-kriltsa", "Пилешки крилца", "Tavuk Kanat", "Chicken Wings", 7.5),
  ]),
  cat("soups-sandwiches", [
    item("shkembe-chorba", "Шкембе чорба", "İşkembe Çorbası", "Tripe Soup", 5.5),
  ]),
  cat("pizzas", [
    item("margarita", "Маргарита", "Margarita", "Margherita", 9.5),
  ]),
  cat("grill", [
    item("kyufte", "Кюфте", "Köfte", "Meatball", 3.5),
    item("kebapche", "Кебапче", "Kebapçe", "Kebapche", 3.5),
    item("meshena-skara", "Мешена скара", "Karışık Izgara", "Mixed Grill", 34.22),
  ]),
  cat("saj-fish-specialties", [
    item("skumriya", "Скумрия", "Uskumru", "Mackerel", 12.9),
  ]),
  cat("burgers", [
    item("royal-burger", "Роял бургер", "Royal Burger", "Royal Burger", 9.9),
  ]),
  cat("cold-appetizers-sides", [
    item("sirene", "Сирене", "Peynir", "Cheese", 6.5),
    item("studena-garnitura-domati", "Студена гарнитура домати", "Domates", "Tomato Side", 3.5),
  ]),
  cat("nuts-desserts", [
    item("kyunefe", "Кюнефе", "Künefe", "Kunefe", 6.5),
    item("sladoled", "Сладолед", "Dondurma", "Ice Cream", 5.67),
  ]),
  cat("rakia", [
    item("peshterska-grozdova-otlezhala", "Пещерска гроздова", "Peşterska", "Peshterska Rakia", 2.34),
  ]),
  cat("wines", [
    item("targovishte-kaberne", "Търговище Каберне", "Targovişte Kaberne", "Targovishte Cabernet", 4.5),
  ]),
  cat("beer-cider-other-drinks", [
    item("carlsberg", "Карлсберг", "Carlsberg", "Carlsberg", 3.91),
    item("carlsberg-0-0", "Карлсберг 0.0", "Carlsberg 0.0", "Carlsberg 0.0", 4.3),
  ]),
  cat("whiskey-vodka", [
    item("pasport", "Passport", "Passport", "Passport", 4.5),
  ]),
];
