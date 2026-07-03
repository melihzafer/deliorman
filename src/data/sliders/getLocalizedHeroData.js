import baseHeroData from "./hero.json";
import enHeroTranslations from "./hero.translations.en";
import trHeroTranslations from "./hero.translations.tr";

const localeHeroTranslations = {
  en: enHeroTranslations,
  tr: trHeroTranslations,
};

export function getLocalizedHeroData(locale = "bg") {
  const normalizedLocale = locale?.split?.("-")?.[0] ?? "bg";
  const heroTranslations = localeHeroTranslations[normalizedLocale];

  if (!heroTranslations) {
    return baseHeroData;
  }

  return {
    ...baseHeroData,
    items: baseHeroData.items.map((item, index) => {
      const translatedItem = heroTranslations.items?.[index];
      if (!translatedItem) return item;
      return {
        ...item,
        title: translatedItem.title ?? item.title,
        subtitle: translatedItem.subtitle ?? item.subtitle,
        text: translatedItem.text ?? item.text,
        button1: {
          ...item.button1,
          label: translatedItem.button1?.label ?? item.button1.label,
        },
        button2: {
          ...item.button2,
          label: translatedItem.button2?.label ?? item.button2.label,
        },
        image: {
          ...item.image,
          alt: translatedItem.image?.alt ?? item.image.alt,
        },
      };
    }),
  };
}

export default getLocalizedHeroData;
