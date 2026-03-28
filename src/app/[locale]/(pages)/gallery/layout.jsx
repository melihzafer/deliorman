import { getLocale, getTranslations } from "next-intl/server";

import { buildAlternates } from "@/src/i18n/seo";

export async function generateMetadata() {
  const t = await getTranslations("meta");
  const locale = await getLocale();

  return {
    title: t("galleryPageTitle"),
    description: t("galleryPageDescription"),
    alternates: buildAlternates("/gallery", locale),
    openGraph: {
      title: t("galleryPageTitle"),
      description: t("galleryPageDescription"),
      type: "website",
    },
  };
}

export default function GalleryLayout({ children }) {
  return children;
}
