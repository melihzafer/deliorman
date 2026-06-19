import React from "react";
import { getTranslations } from "next-intl/server";

import PageBanner from "@components/PageBanner";
import QRMenuTool from "@components/menu/qr/QRMenuTool";

export async function generateMetadata() {
  const t = await getTranslations("qrMenu");
  return {
    title: t("title"),
    description: t("description"),
    // Internal staff tool — keep it out of search engines.
    robots: { index: false, follow: false },
  };
}

const QRMenuPage = async () => {
  const t = await getTranslations("qrMenu");

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner
          pageTitle={t("title")}
          description={t("description")}
          breadTitle={t("title")}
        />
      </div>

      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-0">
              <QRMenuTool tableLimit={Number(process.env.QR_TABLE_LIMIT) || 100} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QRMenuPage;
