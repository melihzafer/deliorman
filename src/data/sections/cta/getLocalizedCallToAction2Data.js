import baseCallToAction2Data from "./call-to-action-2.json";
import enCallToAction2Translations from "./call-to-action-2.translations.en";
import trCallToAction2Translations from "./call-to-action-2.translations.tr";

const localeCallToAction2Translations = {
  en: enCallToAction2Translations,
  tr: trCallToAction2Translations,
};

export function getLocalizedCallToAction2Data(locale = "bg") {
  const normalizedLocale = locale?.split?.("-")?.[0] ?? "bg";
  const callToAction2Translations = localeCallToAction2Translations[normalizedLocale];

  if (!callToAction2Translations) {
    return baseCallToAction2Data;
  }

  return {
    ...baseCallToAction2Data,
    subtitle: callToAction2Translations.subtitle ?? baseCallToAction2Data.subtitle,
    title: callToAction2Translations.title ?? baseCallToAction2Data.title,
    description: callToAction2Translations.description ?? baseCallToAction2Data.description,
    button1: {
      ...baseCallToAction2Data.button1,
      label: callToAction2Translations.button1?.label ?? baseCallToAction2Data.button1.label,
    },
    button2: {
      ...baseCallToAction2Data.button2,
      label: callToAction2Translations.button2?.label ?? baseCallToAction2Data.button2.label,
    },
  };
}

export default getLocalizedCallToAction2Data;
