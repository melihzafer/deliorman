import React from "react";
import { getTranslations } from "next-intl/server";

import { buildAlternates } from "@/src/i18n/seo";

import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import PageBanner from "@components/PageBanner";
import ContactInfoSection from "@components/sections/ContactInfo";
import ContactFormSection from "@components/sections/ContactForm";

export async function generateMetadata() {
  const t = await getTranslations("meta");
  return {
    title: t("contactTitle"),
    description: t("contactDescription"),
    alternates: buildAlternates("/contact"),
    openGraph: {
      title: t("contactTitle"),
      description: t("contactDescription"),
      type: "website",
    },
  };
}

const Contact = async () => {
  const t = await getTranslations("contact");
  return (
    <>
        <div id="tst-dynamic-banner" className="tst-dynamic-banner">
            <PageBanner pageTitle={t("pageTitle")} description={t("pageDescription")} breadTitle={t("breadTitle")} showMap={1} />
        </div>
        <div id="tst-dynamic-content" className="tst-dynamic-content">
            <div className="tst-content-frame">
                <div className="tst-content-box">
                    <div className="container tst-p-60-60">
                        <ScrollHint />
                        <Divider />
                        <ContactInfoSection />
                        <Divider />
                        <ContactFormSection />
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};
export default Contact;
