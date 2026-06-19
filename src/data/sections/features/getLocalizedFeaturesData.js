import baseFeaturesData from "./features.json";
import enFeaturesTranslations from "./features.translations.en";
import trFeaturesTranslations from "./features.translations.tr";

const localeFeaturesTranslations = {
  en: enFeaturesTranslations,
  tr: trFeaturesTranslations,
};

export function getLocalizedFeaturesData(locale = "bg") {
  const normalizedLocale = locale?.split?.("-")?.[0] ?? "bg";
  const featuresTranslations = localeFeaturesTranslations[normalizedLocale];

  if (!featuresTranslations) {
    return baseFeaturesData;
  }

  return {
    ...baseFeaturesData,
    subtitle: featuresTranslations.subtitle ?? baseFeaturesData.subtitle,
    title: featuresTranslations.title ?? baseFeaturesData.title,
    description: featuresTranslations.description ?? baseFeaturesData.description,
    items: baseFeaturesData.items.map((item, index) => {
      const translatedItem = featuresTranslations.items?.[index];
      if (!translatedItem) return item;
      return {
        ...item,
        title: translatedItem.title ?? item.title,
        text: translatedItem.text ?? item.text,
      };
    }),
  };
}

export default getLocalizedFeaturesData;
