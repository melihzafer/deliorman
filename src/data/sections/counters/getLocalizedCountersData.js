import baseCountersData from "./counters.json";
import enCountersTranslations from "./counters.translations.en";
import trCountersTranslations from "./counters.translations.tr";

const localeCountersTranslations = {
  en: enCountersTranslations,
  tr: trCountersTranslations,
};

export function getLocalizedCountersData(locale = "bg") {
  const normalizedLocale = locale?.split?.("-")?.[0] ?? "bg";
  const countersTranslations = localeCountersTranslations[normalizedLocale];

  if (!countersTranslations) {
    return baseCountersData;
  }

  return {
    ...baseCountersData,
    items: baseCountersData.items.map((item, index) => {
      const translatedItem = countersTranslations.items?.[index];
      if (!translatedItem) return item;
      return {
        ...item,
        label: translatedItem.label ?? item.label,
      };
    }),
  };
}

export default getLocalizedCountersData;
