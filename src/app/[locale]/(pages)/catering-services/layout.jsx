import { getLocale } from "next-intl/server";

import { buildAlternates } from "@/src/i18n/seo";

import { getCateringServicesContent } from "./content";

export async function generateMetadata() {
  const locale = await getLocale();
  const content = getCateringServicesContent(locale);

  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: buildAlternates("/catering-services", locale),
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      type: "website",
    },
  };
}

export default function CateringServicesLayout({ children }) {
  return children;
}
