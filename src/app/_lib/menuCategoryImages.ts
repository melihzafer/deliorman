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
      src: "/img/burger.webp",
      title: txt("Бургер", "Burger", "Burger"),
      note: txt("Бургери", "Burgerler", "Burgers"),
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
      src: "/img/menuCategorised/Soft%20drinks%20%26%20Beverages/cola.webp",
      title: txt("Кола", "Kola", "Cola"),
      note: txt("Напитки", "İçecekler", "Drinks"),
    },
    {
      src: "/img/menuCategorised/Soft%20drinks%20%26%20Beverages/sprite.webp",
      title: txt("Спрайт", "Sprite", "Sprite"),
      note: txt("Напитки", "İçecekler", "Drinks"),
    },
    {
      src: "/img/menuCategorised/Soft%20drinks%20%26%20Beverages/Ayran-WEB-10.webp",
      title: txt("Айрян", "Ayran", "Ayran"),
      note: txt("Напитки", "İçecekler", "Drinks"),
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
