import baseTestimonialsData from "./testimonials.json";
import enTestimonialsTranslations from "./testimonials.translations.en";
import trTestimonialsTranslations from "./testimonials.translations.tr";

const localeTestimonialsTranslations = {
  en: enTestimonialsTranslations,
  tr: trTestimonialsTranslations,
};

export function getLocalizedTestimonialsData(locale = "bg") {
  const normalizedLocale = locale?.split?.("-")?.[0] ?? "bg";
  const testimonialsTranslations = localeTestimonialsTranslations[normalizedLocale];

  if (!testimonialsTranslations) {
    return baseTestimonialsData;
  }

  return {
    ...baseTestimonialsData,
    subtitle: testimonialsTranslations.subtitle ?? baseTestimonialsData.subtitle,
    title: testimonialsTranslations.title ?? baseTestimonialsData.title,
    description: testimonialsTranslations.description ?? baseTestimonialsData.description,
    items: baseTestimonialsData.items.map((item, index) => {
      const translatedItem = testimonialsTranslations.items?.[index];
      if (!translatedItem) return item;
      return {
        ...item,
        name: translatedItem.name ?? item.name,
        text: translatedItem.text ?? item.text,
        date: translatedItem.date ?? item.date,
      };
    }),
  };
}

export default getLocalizedTestimonialsData;
