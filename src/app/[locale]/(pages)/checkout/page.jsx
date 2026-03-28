import React from "react";
import { getLocale, getTranslations } from "next-intl/server";

import PageBanner from "@components/PageBanner";
import LegacyOrderNotice from "@components/order/LegacyOrderNotice";
import { buildAlternates } from "@/src/i18n/seo";

export async function generateMetadata() {
  const t = await getTranslations("orderFlow");
  const locale = await getLocale();

  return {
    title: t("pageTitle"),
    description: t("checkoutPageDescription"),
    alternates: buildAlternates("/checkout", locale),
    robots: { index: false, follow: false },
  };
}

const Checkout = async () => {
  const t = await getTranslations("orderFlow");

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner
          pageTitle={t("pageTitle")}
          description={t("checkoutPageDescription")}
          breadTitle={t("breadTitle")}
        />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <LegacyOrderNotice
                title={t("checkoutNoticeTitle")}
                description={t("checkoutNoticeDescription")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Checkout;
