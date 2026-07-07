export interface MenuImageText {
  bg: string;
  tr: string;
  en: string;
}

export interface MenuImageCard {
  src: string;
  title: MenuImageText;
  note: MenuImageText;
}

const txt = (bg: string, tr: string, en: string): MenuImageText => ({ bg, tr, en });

export const categoryImageCards: Record<string, MenuImageCard[]> = {
  "hot-beverages": [
    {
      src: "/img/menuCategorised/Soft%20drinks%20%26%20Beverages/esspresso.webp",
      title: txt("Кафе еспресо", "Espresso", "Espresso"),
      note: txt("Топли напитки", "Sıcak içecekler", "Hot beverages"),
    },
    {
      src: "/img/menuCategorised/Soft%20drinks%20%26%20Beverages/cappuchino.webp",
      title: txt("Капучино", "Cappuccino", "Cappuccino"),
      note: txt("Топли напитки", "Sıcak içecekler", "Hot beverages"),
    },
    {
      src: "/img/menuCategorised/Soft%20drinks%20%26%20Beverages/hot_choclate.webp",
      title: txt("Горещ шоколад", "Sıcak çikolata", "Hot chocolate"),
      note: txt("Топли напитки", "Sıcak içecekler", "Hot beverages"),
    },
  ],
  salads: [
    {
      src: "/img/menuCategorised/Salads/sq_salad_shopska.webp",
      title: txt("Шопска салата", "Şopska salatası", "Shopska salad"),
      note: txt("Салати", "Salatalar", "Salads"),
    },
    {
      src: "/img/menuCategorised/Salads/sq_salad_deliorman.webp",
      title: txt("Салата Делиорман", "Deliorman salatası", "Deliorman salad"),
      note: txt("Салати", "Salatalar", "Salads"),
    },
    {
      src: "/img/menuCategorised/Salads/sq_salad_greece.webp",
      title: txt("Гръцка салата", "Yunan salatası", "Greek salad"),
      note: txt("Салати", "Salatalar", "Salads"),
    },
  ],
  "hot-appetizers": [
    {
      src: "/img/menuCategorised/QuickBites/sq_pileshki_kornflex.webp",
      title: txt("Пилешки филенца", "Tavuk filetoları", "Chicken fillets"),
      note: txt("Аламинути", "Sıcak yemekler", "Hot dishes"),
    },
    {
      src: "/img/menuCategorised/QuickBites/sq_baby_mozzarella.webp",
      title: txt("Бейби моцарела", "Baby mozzarella", "Baby mozzarella"),
      note: txt("Аламинути", "Sıcak yemekler", "Hot dishes"),
    },
    {
      src: "/img/menuCategorised/QuickBites/Бейби моцарела.webp",
      title: txt("Топли сирена", "Sıcak peynirler", "Warm cheeses"),
      note: txt("Аламинути", "Sıcak yemekler", "Hot dishes"),
    },
  ],
  "soups-sandwiches": [
    {
      src: "/img/menuCategorised/SoupsFIshSandwiches/Шкембе чорба.webp",
      title: txt("Шкембе чорба", "İşkembe çorbası", "Tripe soup"),
      note: txt("Супи", "Çorbalar", "Soups"),
    },
    {
      src: "/img/menuCategorised/SoupsFIshSandwiches/Сандвич с шунка и кашкавал.webp",
      title: txt("Сандвич", "Sandviç", "Sandwich"),
      note: txt("Сандвичи", "Sandviçler", "Sandwiches"),
    },
    {
      src: "/img/menuCategorised/SoupsFIshSandwiches/Скумрия с гарнитура.webp",
      title: txt("Скумрия", "Uskumru", "Mackerel"),
      note: txt("Риба", "Balık", "Fish"),
    },
  ],
  pizzas: [
    {
      src: "/img/menuCategorised/Pizzas/sq_pizza_deliorman.webp",
      title: txt("Пица Делиорман", "Deliorman pizza", "Deliorman pizza"),
      note: txt("Пици", "Pizzalar", "Pizzas"),
    },
    {
      src: "/img/menuCategorised/Pizzas/sq_pizza_karleona.webp",
      title: txt("Пица Карлеона", "Carleona pizza", "Carleona pizza"),
      note: txt("Пици", "Pizzalar", "Pizzas"),
    },
    {
      src: "/img/menuCategorised/Pizzas/Сайт Пица Делиорман.webp",
      title: txt("Пица от пещта", "Fırın pizzası", "Oven pizza"),
      note: txt("Пици", "Pizzalar", "Pizzas"),
    },
  ],
  grill: [
    {
      src: "/img/menuCategorised/Grill%26Specialties/sq_kyufte.webp",
      title: txt("Кюфте", "Köfte", "Meatball"),
      note: txt("Скара", "Izgara", "Grill"),
    },
    {
      src: "/img/menuCategorised/Grill%26Specialties/sq_kebabche.webp",
      title: txt("Кебапче", "Kebapçe", "Kebapche"),
      note: txt("Скара", "Izgara", "Grill"),
    },
    {
      src: "/img/menuCategorised/Grill%26Specialties/sq_tatarsko_kyufte.webp",
      title: txt("Татарско кюфте", "Tatar köfte", "Tatar meatball"),
      note: txt("Скара", "Izgara", "Grill"),
    },
  ],
  "saj-fish-specialties": [
    {
      src: "/img/menuCategorised/Grill%26Specialties/Специалитет Делиорман.webp",
      title: txt("Специалитет Делиорман", "Deliorman spesiyali", "Deliorman specialty"),
      note: txt("Специалитети", "Spesiyaller", "Specialties"),
    },
    {
      src: "/img/menuCategorised/Grill%26Specialties/sq_hapki_deliorman.webp",
      title: txt("Хапки Делиорман", "Deliorman lokmaları", "Deliorman bites"),
      note: txt("Специалитети", "Spesiyaller", "Specialties"),
    },
    {
      src: "/img/menuCategorised/SoupsFIshSandwiches/Скумрия с гарнитура 2.webp",
      title: txt("Риба", "Balık", "Fish"),
      note: txt("Риба", "Balık", "Fish"),
    },
  ],
  burgers: [
    {
      src: "/img/menuCategorised/Burgers/aphrodite_burger.webp",
      title: txt("Бургер Афродита", "Afrodit Burger", "Aphrodite Burger"),
      note: txt("хрупкаво пилешко филе, картофи", "çıtır tavuk fileto, patates", "crispy chicken fillet, fries"),
    },
    {
      src: "/img/menuCategorised/Burgers/olymp_burger.webp",
      title: txt("Олимп бургер", "Olimp Burger", "Olymp Burger"),
      note: txt("телешко месо, картофи", "dana eti, patates", "beef, fries"),
    },
    {
      src: "/img/menuCategorised/Burgers/royal_burger.webp",
      title: txt("Роял бургер", "Royal Burger", "Royal Burger"),
      note: txt("пилешко месо, картофи", "tavuk eti, patates", "chicken meat, fries"),
    },
  ],
  "new-specialties": [
    {
      src: "/img/menuCategorised/newSpecialties/shish_deliorman.webp",
      title: txt("Шиш Делиорман", "Deliorman şiş", "Deliorman skewer"),
      note: txt("Нови специалитети", "Yeni spesiyaller", "New specialties"),
    },
    {
      src: "/img/menuCategorised/newSpecialties/teleshko.webp",
      title: txt("Телешко печено", "Fırın dana", "Roast beef"),
      note: txt("Нови специалитети", "Yeni spesiyaller", "New specialties"),
    },
    {
      src: "/img/menuCategorised/newSpecialties/agneshki.webp",
      title: txt("Агнешки деликатес", "Kuzu lezzeti", "Lamb delicacy"),
      note: txt("Нови специалитети", "Yeni spesiyaller", "New specialties"),
    },
  ],
  "nuts-desserts": [
    {
      src: "/img/menuCategorised/Desserts/sq_baklava.webp",
      title: txt("Баклава", "Baklava", "Baklava"),
      note: txt("Десерти", "Tatlılar", "Desserts"),
    },
    {
      src: "/img/menuCategorised/Desserts/sq_krem_karamel.webp",
      title: txt("Крем карамел", "Krem karamel", "Creme caramel"),
      note: txt("Десерти", "Tatlılar", "Desserts"),
    },
    {
      src: "/img/menuCategorised/Desserts/Сладко.webp",
      title: txt("Сладко", "Tatlı", "Sweet preserve"),
      note: txt("Десерти", "Tatlılar", "Desserts"),
    },
  ],
  "beer-cider-other-drinks": [
    {
      src: "/img/menuCategorised/Beers/beer_lager.webp",
      title: txt("Светла бира", "Açık Bira / Lager", "Lager Beer"),
      note: txt("Студена бира с гъста пяна", "Soğuk lager bira", "Chilled lager beer"),
    },
    {
      src: "/img/menuCategorised/Beers/beer_wheat.webp",
      title: txt("Пшенична бира", "Buğday Birası", "Wheat Beer"),
      note: txt("1664 Бланк, Tuborg или подобни", "1664 Blanc, Tuborg vb.", "1664 Blanc, Tuborg or similar"),
    },
  ],
  "cold-appetizers-sides": [
    {
      src: "/img/menuCategorised/ColdAppetizers/lukanka_sudzhuk.webp",
      title: txt("Луканка и Суджук", "Lukanka Sucuğu & Sucuk", "Lukanka & Sudzhuk"),
      note: txt("Традиционни сурово-сушени деликатеси", "Geleneksel kuru etler", "Traditional dry-cured meats"),
    },
    {
      src: "/img/menuCategorised/ColdAppetizers/sirene_kashkaval.webp",
      title: txt("Сирене и Кашкавал", "Beyaz Peynir & Kaşar Peyniri", "White Cheese & Kashkaval"),
      note: txt("Подбрани млечни продукти", "Seçkin peynir tabağı", "Select Bulgarian cheese platter"),
    },
    {
      src: "/img/menuCategorised/ColdAppetizers/pastirma.webp",
      title: txt("Пастърма", "Pastırma", "Pastirma"),
      note: txt("Сушено говеждо месо с подправки", "Kuru dana eti", "Dry-cured beef pastirma"),
    },
  ],
  rakia: [
    {
      src: "/img/menuCategorised/Rakia/rakia_grape.webp",
      title: txt("Гроздова ракия", "Üzüm Rakısı", "Grape Rakia"),
      note: txt("Бургас 63, Пещерска или Кехлибар", "Burgas 63, Peşterska veya Kehlibar", "Burgas 63, Peshterska or Kehlibar"),
    },
    {
      src: "/img/menuCategorised/Rakia/rakia_aged.webp",
      title: txt("Отлежала ракия", "Yıllanmış Rakı", "Aged Rakia"),
      note: txt("Специална отлежала селекция", "Özel yıllanmış seri", "Special aged selection"),
    },
    {
      src: "/img/menuCategorised/Rakia/rakia_apricot.webp",
      title: txt("Кайсиева ракия", "Kayısı Rakısı", "Apricot Rakia"),
      note: txt("Ароматна Исперих кайсиева", "Aromatik İspirih kayısı rakısı", "Aromatic Isperih apricot rakia"),
    },
  ],
  wines: [
    {
      src: "/img/menuCategorised/Wines/wine_white.webp",
      title: txt("Бяло вино", "Beyaz Şarap", "White Wine"),
      note: txt("Охладено селектирано бяло вино", "Soğuk beyaz şarap", "Chilled select white wine"),
    },
    {
      src: "/img/menuCategorised/Wines/wine_red.webp",
      title: txt("Червено вино", "Kırmızı Şarap", "Red Wine"),
      note: txt("Ароматно селектирано червено вино", "Seçkin kırmızı şarap", "Select aromatic red wine"),
    },
    {
      src: "/img/menuCategorised/Wines/wine_rose.webp",
      title: txt("Розе", "Roze Şarap", "Rosé Wine"),
      note: txt("Свежо и плодово розе", "Taze ve meyvemsi roze şarap", "Fresh and fruity rosé wine"),
    },
  ],
  "whiskey-vodka": [
    {
      src: "/img/menuCategorised/Rakia/rakia_aged.webp",
      title: txt("Марково Уиски", "Kaliteli Viski", "Premium Whiskey"),
      note: txt("Джак Даниелс, Джеймсън или Чивас", "Jack Daniels, Jameson veya Chivas", "Jack Daniels, Jameson or Chivas"),
    },
    {
      src: "/img/menuCategorised/Rakia/rakia_grape.webp",
      title: txt("Класическа Водка", "Klasik Votka", "Classic Vodka"),
      note: txt("Абсолют, Финландия или Смирноф", "Absolut, Finlandia veya Smirnoff", "Absolut, Finlandia or Smirnoff"),
    },
  ],
};

export const heroImages = [
  "/img/outdoor_footage/IMG_9339.webp",
  "/img/indoor_footage/IMG_9344.webp",
  "/img/indoor_footage/IMG_9343.webp",
] as const;

export function getCategoryImageCards(activeKey: string | null | undefined): MenuImageCard[] {
  if (!activeKey) return [];
  return categoryImageCards[activeKey] ?? [];
}
