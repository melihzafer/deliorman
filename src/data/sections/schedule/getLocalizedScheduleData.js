import baseScheduleData from "./schedule.json";
import enScheduleTranslations from "./schedule.translations.en";
import trScheduleTranslations from "./schedule.translations.tr";

const localeScheduleTranslations = {
  en: enScheduleTranslations,
  tr: trScheduleTranslations,
};

export function getLocalizedScheduleData(locale = "bg") {
  const normalizedLocale = locale?.split?.("-")?.[0] ?? "bg";
  const scheduleTranslations = localeScheduleTranslations[normalizedLocale];

  if (!scheduleTranslations) {
    return baseScheduleData;
  }

  return {
    ...baseScheduleData,
    subtitle: scheduleTranslations.subtitle ?? baseScheduleData.subtitle,
    title: scheduleTranslations.title ?? baseScheduleData.title,
    description: scheduleTranslations.description ?? baseScheduleData.description,
    button1: {
      ...baseScheduleData.button1,
      label: scheduleTranslations.button1?.label ?? baseScheduleData.button1.label,
    },
    button2: {
      ...baseScheduleData.button2,
      label: scheduleTranslations.button2?.label ?? baseScheduleData.button2.label,
    },
    image: {
      ...baseScheduleData.image,
      alt: scheduleTranslations.image?.alt ?? baseScheduleData.image.alt,
    },
    items: baseScheduleData.items.map((item, index) => {
      const translatedItem = scheduleTranslations.items?.[index];
      if (!translatedItem) return item;
      return {
        ...item,
        label: translatedItem.label ?? item.label,
      };
    }),
  };
}

export default getLocalizedScheduleData;
