import baseAboutData from "./about.json";
import enAboutTranslations from "./about.translations.en";
import trAboutTranslations from "./about.translations.tr";

const localeAboutTranslations = {
  en: enAboutTranslations,
  tr: trAboutTranslations,
};

export function getLocalizedAboutData(locale = "bg") {
  const normalizedLocale = locale?.split?.("-")?.[0] ?? "bg";
  const aboutTranslations = localeAboutTranslations[normalizedLocale];

  if (!aboutTranslations) {
    return baseAboutData;
  }

  return {
    ...baseAboutData,
    title: aboutTranslations.title ?? baseAboutData.title,
    subtitle: aboutTranslations.subtitle ?? baseAboutData.subtitle,
    description: aboutTranslations.description ?? baseAboutData.description,
    button: {
      ...baseAboutData.button,
      label: aboutTranslations.button?.label ?? baseAboutData.button.label,
    },
    image: {
      ...baseAboutData.image,
      alt: aboutTranslations.image?.alt ?? baseAboutData.image.alt,
    },
  };
}

export default getLocalizedAboutData;
