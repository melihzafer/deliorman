import React from "react";
import { getLocale, getTranslations } from "next-intl/server";

import PageBanner from "@components/PageBanner";
import DarkSection from "@components/DarkSection";
import NewSpecialtiesCTA from "@components/sections/NewSpecialtiesCTALazy";
import { getRestaurantPhoneDisplay, getRestaurantPhoneHref } from "@library/siteContact";
import { buildAlternates } from "@/src/i18n/seo";

export async function generateMetadata() {
  const locale = await getLocale();
  const t = await getTranslations("components.lunchMenu");

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    alternates: buildAlternates("/lunch-menu", locale),
    openGraph: {
      title: t("pageTitle"),
      description: t("pageDescription"),
      type: "website",
    },
  };
}

const LunchMenu = async () => {
  const t = await getTranslations("components.lunchMenu");
  const restaurantPhone = getRestaurantPhoneDisplay();
  const restaurantPhoneHref = getRestaurantPhoneHref();

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
            <div className="container tst-p-60-60">
              
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="text-center tst-mb-60">
                    <div className="tst-suptitle tst-suptitle-center tst-mb-15">{t("subtitle")}</div>
                    <h3 className="tst-mb-30">{t("title")}</h3>
                    <p className="tst-text tst-mb-30">
                      {t("description")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="row justify-content-center tst-mb-60">
                <div className="col-lg-10">
                  <DarkSection>
                    <div className="row align-items-center">
                      <div className="col-lg-8">
                        <div className="tst-cta-frame">
                          <div className="tst-cta">
                            <div className="tst-fade-up tst-active">
                              <div className="tst-suptitle tst-white-2 tst-mb-15">
                                <i className="fab fa-facebook" style={{marginRight: '10px'}}></i>
                                {t("facebookSubtitle")}
                              </div>
                            </div>
                            <h3 className="tst-white-2 tst-mb-20 tst-fade-up tst-active">{t("facebookTitle")}</h3>
                            <div className="tst-fade-up tst-active">
                              <p className="tst-text tst-text-lg tst-white-2 tst-mb-30">
                                {t("facebookDescription")}
                              </p>
                            </div>
                            <a 
                              href="https://www.facebook.com/profile.php?id=100078695683893" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="tst-btn tst-btn-lg tst-btn-shadow tst-fade-up tst-active"
                              style={{backgroundColor: 'white', color: '#1877f2'}}
                            >
                              <i className="fab fa-facebook" style={{marginRight: '8px'}}></i>
                              <span>{t("facebookButton")}</span>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="text-center tst-fade-up tst-active">
                          <i className="fab fa-facebook" style={{fontSize: '120px', color: 'white', opacity: '0.3'}}></i>
                        </div>
                      </div>
                    </div>
                  </DarkSection>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4">
                  <div className="tst-icon-box tst-mb-60 text-center">
                    <div className="tst-icon-frame tst-mb-15">
                      <i className="fas fa-calendar-day" style={{fontSize: '48px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15">{t("dailyUpdate")}</h5>
                    <p className="tst-text">
                      {t("dailyUpdateDesc")}
                    </p>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="tst-icon-box tst-mb-60 text-center">
                    <div className="tst-icon-frame tst-mb-15">
                      <i className="fas fa-utensils" style={{fontSize: '48px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15">{t("freshlyMade")}</h5>
                    <p className="tst-text">
                      {t("freshlyMadeDesc")}
                    </p>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="tst-icon-box tst-mb-60 text-center">
                    <div className="tst-icon-frame tst-mb-15">
                      <i className="fas fa-tags" style={{fontSize: '48px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15">{t("specialPrices")}</h5>
                    <p className="tst-text">
                      {t("specialPricesDesc")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="text-center">
                    <div className="tst-separator tst-mb-30"></div>
                    <h5 className="tst-mb-15">{t("lunchHoursTitle")}</h5>
                    <p className="tst-text tst-mb-15">
                      {t("lunchHoursValue")}
                    </p>
                    <p className="tst-text">
                      {t("reservations")} <a href={restaurantPhoneHref} style={{color: '#05232B', fontWeight: '600'}}>{restaurantPhone}</a>
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <NewSpecialtiesCTA />
      </div>
    </>
  );
};

export default LunchMenu;
