import baseCallToAction3Data from "./call-to-action-3.json";
import enCallToAction3Translations from "./call-to-action-3.translations.en";
import trCallToAction3Translations from "./call-to-action-3.translations.tr";

const localeCallToAction3Translations = {
  en: enCallToAction3Translations,
  tr: trCallToAction3Translations,
};

export function getLocalizedCallToAction3Data(locale = "bg") {
  const normalizedLocale = locale?.split?.("-")?.[0] ?? "bg";
  const callToAction3Translations = localeCallToAction3Translations[normalizedLocale];

  if (!callToAction3Translations) {
    return baseCallToAction3Data;
  }

  return {
    ...baseCallToAction3Data,
    subtitle: callToAction3Translations.subtitle ?? baseCallToAction3Data.subtitle,
    title: callToAction3Translations.title ?? baseCallToAction3Data.title,
    description: callToAction3Translations.description ?? baseCallToAction3Data.description,
    button: {
      ...baseCallToAction3Data.button,
      label: callToAction3Translations.button?.label ?? baseCallToAction3Data.button.label,
    },
  };
}

export default getLocalizedCallToAction3Data;
