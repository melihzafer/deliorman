import baseMenuData from "./menu.json";
import enMenuTranslations from "./menu.translations.en";
import trMenuTranslations from "./menu.translations.tr";

const localeMenuTranslations = {
  en: enMenuTranslations,
  tr: trMenuTranslations,
};

export function getLocalizedMenuData(locale = "bg") {
  const normalizedLocale = locale?.split?.("-")?.[0] ?? "bg";
  const menuTranslations = localeMenuTranslations[normalizedLocale];

  if (!menuTranslations) {
    return baseMenuData;
  }

  return {
    ...baseMenuData,
    categories: baseMenuData.categories.map((category) => {
      const categoryTranslations = menuTranslations[category.slug];

      if (
        process.env.NODE_ENV !== "production" &&
        categoryTranslations &&
        categoryTranslations.length !== category.items.length
      ) {
        console.warn(
          `[menu-i18n] Translation count mismatch for "${category.slug}": expected ${category.items.length}, received ${categoryTranslations.length}.`
        );
      }

      return {
        ...category,
        items: category.items.map((item, index) => {
          const translatedItem = categoryTranslations?.[index];

          if (!translatedItem) {
            return item;
          }

          return {
            ...item,
            title: translatedItem.title ?? item.title,
            text: translatedItem.text ?? item.text,
          };
        }),
      };
    }),
  };
}

export default getLocalizedMenuData;
