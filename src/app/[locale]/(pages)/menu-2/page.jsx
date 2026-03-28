import React from "react";
import { getLocale } from "next-intl/server";

import AppData from "@data/app.json";
import MenuData from "@data/menu.json";

import ScrollHint from "@layouts/scroll-hint/Index";

import PageBanner from "@components/PageBanner";
import MenuFiltered from "@components/menu/MenuFiltered2";
import { buildAlternates } from "@/src/i18n/seo";

import { getLegacyPageCopy } from "../pageCopy";

export async function generateMetadata() {
  const locale = await getLocale();
  const copy = getLegacyPageCopy("menu2", locale);

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: buildAlternates("/menu-2", locale),
    robots: { index: false, follow: false },
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaDescription,
      type: "website",
    },
  };
}

const Menu1 = async () => {
  const locale = await getLocale();
  const copy = getLegacyPageCopy("menu2", locale);

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner 
          pageTitle={copy.pageTitle}
          description={copy.pageDescription}
          breadTitle={copy.breadTitle}
        />
      </div>
      
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-0">
              <ScrollHint />

              <MenuFiltered
                categories={MenuData.categories} 
              />

            </div>
          </div>
        </div>

      </div>
    </>
  );
};
export default Menu1;
