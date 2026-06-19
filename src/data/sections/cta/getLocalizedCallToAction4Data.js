import baseCallToAction4Data from "./call-to-action-4.json";
import enCallToAction4Translations from "./call-to-action-4.translations.en";
import trCallToAction4Translations from "./call-to-action-4.translations.tr";

const localeCallToAction4Translations = {
  en: enCallToAction4Translations,
  tr: trCallToAction4Translations,
};

export function getLocalizedCallToAction4Data(locale = "bg") {
  const normalizedLocale = locale?.split?.("-")?.[0] ?? "bg";
  const callToAction4Translations = localeCallToAction4Translations[normalizedLocale];

  if (!callToAction4Translations) {
    return baseCallToAction4Data;
  }

  return {
    ...baseCallToAction4Data,
    subtitle: callToAction4Translations.subtitle ?? baseCallToAction4Data.subtitle,
    title: callToAction4Translations.title ?? baseCallToAction4Data.title,
    description: callToAction4Translations.description ?? baseCallToAction4Data.description,
    button1: {
      ...baseCallToAction4Data.button1,
      label: callToAction4Translations.button1?.label ?? baseCallToAction4Data.button1.label,
    },
    button2: {
      ...baseCallToAction4Data.button2,
      label: callToAction4Translations.button2?.label ?? baseCallToAction4Data.button2.label,
    },
    image: {
      ...baseCallToAction4Data.image,
      alt: callToAction4Translations.image?.alt ?? baseCallToAction4Data.image.alt,
    },
  };
}

export default getLocalizedCallToAction4Data;
