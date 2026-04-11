import baseTestimonialData from "./testimonial.json";
import enTestimonialTranslations from "./testimonial.translations.en";
import trTestimonialTranslations from "./testimonial.translations.tr";

const localeTestimonialTranslations = {
  en: enTestimonialTranslations,
  tr: trTestimonialTranslations,
};

export function getLocalizedTestimonialSliderData(locale = "bg") {
  const normalizedLocale = locale?.split?.("-")?.[0] ?? "bg";
  const testimonialTranslations = localeTestimonialTranslations[normalizedLocale];

  if (!testimonialTranslations) {
    return baseTestimonialData;
  }

  return {
    ...baseTestimonialData,
    subtitle: testimonialTranslations.subtitle ?? baseTestimonialData.subtitle,
    title: testimonialTranslations.title ?? baseTestimonialData.title,
    description: testimonialTranslations.description ?? baseTestimonialData.description,
    button: {
      ...baseTestimonialData.button,
      label: testimonialTranslations.button?.label ?? baseTestimonialData.button.label,
    },
    items: baseTestimonialData.items.map((item, index) => {
      const translatedItem = testimonialTranslations.items?.[index];
      if (!translatedItem) return item;
      return {
        ...item,
        title: translatedItem.title ?? item.title,
        text: translatedItem.text ?? item.text,
      };
    }),
  };
}

export default getLocalizedTestimonialSliderData;
