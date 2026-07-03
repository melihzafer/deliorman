import baseTeamData from "./team.json";
import enTeamTranslations from "./team.translations.en";
import trTeamTranslations from "./team.translations.tr";

const localeTeamTranslations = {
  en: enTeamTranslations,
  tr: trTeamTranslations,
};

export function getLocalizedTeamData(locale = "bg") {
  const normalizedLocale = locale?.split?.("-")?.[0] ?? "bg";
  const teamTranslations = localeTeamTranslations[normalizedLocale];

  if (!teamTranslations) {
    return baseTeamData;
  }

  return {
    ...baseTeamData,
    subtitle: teamTranslations.subtitle ?? baseTeamData.subtitle,
    title: teamTranslations.title ?? baseTeamData.title,
    description: teamTranslations.description ?? baseTeamData.description,
    items: baseTeamData.items.map((item, index) => {
      const translatedItem = teamTranslations.items?.[index];
      if (!translatedItem) return item;
      return {
        ...item,
        role: translatedItem.role ?? item.role,
        social: item.social.map((socialItem, socialIndex) => {
          const translatedSocial = translatedItem.social?.[socialIndex];
          if (!translatedSocial) return socialItem;
          return {
            ...socialItem,
            title: translatedSocial.title ?? socialItem.title,
          };
        }),
      };
    }),
  };
}

export default getLocalizedTeamData;
