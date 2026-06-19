import React from "react";
import { getTranslations } from "next-intl/server";

import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import PageBanner from "@components/PageBanner";
import ContactInfoSection from "@components/sections/ContactInfo";
import ReservationFormSection from "@components/sections/ReservationForm";

export async function generateMetadata() {
  const t = await getTranslations("meta");
  return {
    title: t("reservationTitle"),
    description: t("reservationDescription"),
    openGraph: {
      title: t("reservationTitle"),
      description: t("reservationDescription"),
      type: 'website',
    },
  };
}

const Reservation = async () => {
  const t = await getTranslations("reservation");
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

                        <Divider onlyBottom={0} />
                        <ReservationFormSection />
                        <Divider onlyBottom={0} />
                        <ContactInfoSection />
                        
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};
export default Reservation;
