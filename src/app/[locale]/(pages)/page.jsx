import { getLocale, getTranslations } from "next-intl/server";

import HomePageContent from "@components/home/HomePageContent";
import { buildAlternates } from "@/src/i18n/seo";

export async function generateMetadata() {
  const t = await getTranslations("meta");
  const locale = await getLocale();

  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
    alternates: buildAlternates("/", locale),
    openGraph: {
      title: t("homeTitle"),
      description: t("homeDescription"),
      type: "website",
    },
  };
}

export default function LocalizedHomePage() {
  return <HomePageContent />;
}
