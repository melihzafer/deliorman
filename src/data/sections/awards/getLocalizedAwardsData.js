import baseAwardsData from "./awards.json";
import enAwardsTranslations from "./awards.translations.en";
import trAwardsTranslations from "./awards.translations.tr";

const localeAwardsTranslations = {
  en: enAwardsTranslations,
  tr: trAwardsTranslations,
};

export function getLocalizedAwardsData(locale = "bg") {
  const normalizedLocale = locale?.split?.("-")?.[0] ?? "bg";
  const awardsTranslations = localeAwardsTranslations[normalizedLocale];

  if (!awardsTranslations) {
    return baseAwardsData;
  }

  return {
    ...baseAwardsData,
    items: baseAwardsData.items.map((item, index) => {
      const translatedItem = awardsTranslations.items?.[index];
      if (!translatedItem) return item;
      return {
        ...item,
        title: translatedItem.title ?? item.title,
      };
    }),
  };
}

export default getLocalizedAwardsData;
