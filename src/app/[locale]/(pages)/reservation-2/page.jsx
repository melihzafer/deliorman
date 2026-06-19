import React from "react";
import { getLocale } from "next-intl/server";

import AppData from "@data/app.json";

import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import PageBanner from "@components/PageBanner";
import ContactInfoSection from "@components/sections/ContactInfo";
import ReservationOpenTableSection from "@components/sections/ReservationOpenTable";
import { buildAlternates } from "@/src/i18n/seo";

import { getLegacyPageCopy } from "../pageCopy";

export async function generateMetadata() {
  const locale = await getLocale();
  const copy = getLegacyPageCopy("reservation2", locale);

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: buildAlternates("/reservation-2", locale),
    robots: { index: false, follow: false },
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaDescription,
      type: "website",
    },
  };
}

const Reservation2 = async () => {
  const locale = await getLocale();
  const copy = getLegacyPageCopy("reservation2", locale);

  return (
    <>
        <div id="tst-dynamic-banner" className="tst-dynamic-banner">
            <PageBanner
              pageTitle={copy.pageTitle}
              description={copy.pageDescription}
              breadTitle={copy.breadTitle}
              showMap={1}
            />
        </div>
        <div id="tst-dynamic-content" className="tst-dynamic-content">
            <div className="tst-content-frame">
                <div className="tst-content-box">
                    <div className="container tst-p-60-60">
                        <ScrollHint />

                        <ReservationOpenTableSection />
                        <Divider onlyBottom={0} />
                        <ContactInfoSection />
                        
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};
export default Reservation2;
