import baseCallToActionData from "./call-to-action.json";
import enCallToActionTranslations from "./call-to-action.translations.en";
import trCallToActionTranslations from "./call-to-action.translations.tr";

const localeCallToActionTranslations = {
  en: enCallToActionTranslations,
  tr: trCallToActionTranslations,
};

export function getLocalizedCallToActionData(locale = "bg") {
  const normalizedLocale = locale?.split?.("-")?.[0] ?? "bg";
  const callToActionTranslations = localeCallToActionTranslations[normalizedLocale];

  if (!callToActionTranslations) {
    return baseCallToActionData;
  }

  return {
    ...baseCallToActionData,
    subtitle: callToActionTranslations.subtitle ?? baseCallToActionData.subtitle,
    title: callToActionTranslations.title ?? baseCallToActionData.title,
    description: callToActionTranslations.description ?? baseCallToActionData.description,
    button1: {
      ...baseCallToActionData.button1,
      label: callToActionTranslations.button1?.label ?? baseCallToActionData.button1.label,
    },
    button2: {
      ...baseCallToActionData.button2,
      label: callToActionTranslations.button2?.label ?? baseCallToActionData.button2.label,
    },
  };
}

export default getLocalizedCallToActionData;
