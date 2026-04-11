import baseAppData from "./app.json";
import enAppTranslations from "./app.translations.en";
import trAppTranslations from "./app.translations.tr";

const localeAppTranslations = {
  en: enAppTranslations,
  tr: trAppTranslations,
};

export function getLocalizedAppData(locale = "bg") {
  const normalizedLocale = locale?.split?.("-")?.[0] ?? "bg";
  const appTranslations = localeAppTranslations[normalizedLocale];

  if (!appTranslations) {
    return baseAppData;
  }

  return {
    ...baseAppData,
    settings: {
      ...baseAppData.settings,
      siteName: appTranslations.settings?.siteName ?? baseAppData.settings.siteName,
      siteDescription: appTranslations.settings?.siteDescription ?? baseAppData.settings.siteDescription,
    },
    header: {
      ...baseAppData.header,
      menu: baseAppData.header.menu.map((item, index) => {
        const translatedItem = appTranslations.header?.menu?.[index];
        if (!translatedItem) return item;
        return {
          ...item,
          label: translatedItem.label ?? item.label,
          children: item.children?.map((child, childIndex) => {
            const translatedChild = translatedItem.children?.[childIndex];
            if (!translatedChild) return child;
            return {
              ...child,
              label: translatedChild.label ?? child.label,
            };
          }),
        };
      }),
      onepage: baseAppData.header.onepage.map((item, index) => {
        const translatedItem = appTranslations.header?.onepage?.[index];
        if (!translatedItem) return item;
        return {
          ...item,
          label: translatedItem.label ?? item.label,
        };
      }),
    },
    footer: {
      ...baseAppData.footer,
      about: {
        ...baseAppData.footer.about,
        title: appTranslations.footer?.about?.title ?? baseAppData.footer.about.title,
        text: appTranslations.footer?.about?.text ?? baseAppData.footer.about.text,
        button: {
          ...baseAppData.footer.about.button,
          label: appTranslations.footer?.about?.button?.label ?? baseAppData.footer.about.button.label,
        },
      },
      contact: {
        ...baseAppData.footer.contact,
        title: appTranslations.footer?.contact?.title ?? baseAppData.footer.contact.title,
        items: baseAppData.footer.contact.items.map((item, index) => {
          const translatedItem = appTranslations.footer?.contact?.items?.[index];
          if (!translatedItem) return item;
          return {
            ...item,
            label: translatedItem.label ?? item.label,
          };
        }),
        button: {
          ...baseAppData.footer.contact.button,
          label: appTranslations.footer?.contact?.button?.label ?? baseAppData.footer.contact.button.label,
        },
      },
      gallery: {
        ...baseAppData.footer.gallery,
        title: appTranslations.footer?.gallery?.title ?? baseAppData.footer.gallery.title,
        button: {
          ...baseAppData.footer.gallery.button,
          label: appTranslations.footer?.gallery?.button?.label ?? baseAppData.footer.gallery.button.label,
        },
      },
      legal: {
        ...baseAppData.footer.legal,
        links: baseAppData.footer.legal.links.map((link, index) => {
          const translatedLink = appTranslations.footer?.legal?.links?.[index];
          if (!translatedLink) return link;
          return {
            ...link,
            label: translatedLink.label ?? link.label,
          };
        }),
      },
    },
  };
}

export default getLocalizedAppData;
