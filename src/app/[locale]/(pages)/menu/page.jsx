import React from "react";
import { getLocale, getTranslations } from "next-intl/server";

import { getLocalizedMenuData } from "@data/getLocalizedMenuData";

import ScrollHint from "@layouts/scroll-hint/Index";

import PageBanner from "@components/PageBanner";
import NewSpecialtiesCTA from "@components/sections/NewSpecialtiesCTALazy";
import MenuFiltered from "@components/menu/MenuFiltered";
import MenuAIAssistant from "@components/menu/ai/MenuAIAssistant";
import { buildAlternates } from "@/src/i18n/seo";

export async function generateMetadata() {
  const t = await getTranslations("meta");
  const locale = await getLocale();
  return {
    title: t("menuTitle"),
    description: t("menuDescription"),
    alternates: buildAlternates("/menu", locale),
    openGraph: {
      title: t("menuTitle"),
      description: t("menuDescription"),
      type: 'website',
    },
  };
}

const Menu1 = async () => {
  const [t, locale] = await Promise.all([
    getTranslations("menu"),
    getLocale(),
  ]);
  const menuData = getLocalizedMenuData(locale);
  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner 
          pageTitle={t("pageTitle")} 
          description={t("pageDescription")} 
          breadTitle={t("breadTitle")} 
        />
      </div>
      
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-0">
              <ScrollHint />

              <MenuAIAssistant />

              <MenuFiltered
                categories={menuData.categories}
              />

            </div>
          </div>
        </div>
        <br />
        <br />
        <NewSpecialtiesCTA />
      </div>
    </>
  );
};
export default Menu1;
