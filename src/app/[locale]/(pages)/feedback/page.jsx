import { getLocale, getTranslations } from "next-intl/server";

import FeedbackPageContent from "@components/feedback/FeedbackPageContent";
import { buildAlternates } from "@/src/i18n/seo";

export async function generateMetadata() {
  const t = await getTranslations("meta");
  const locale = await getLocale();
  return {
    title: t("feedbackTitle"),
    description: t("feedbackDescription"),
    alternates: buildAlternates("/feedback", locale),
    openGraph: {
      title: t("feedbackTitle"),
      description: t("feedbackDescription"),
      type: "website",
    },
  };
}

export default function FeedbackPage() {
  return <FeedbackPageContent />;
}
