"use client";

import { useTranslations } from "next-intl";
import Data from "@data/sections/subscribe.json";
import AppData from "@data/app.json";

const SubscribeSection = () => {
  const t = useTranslations("components.subscribe");
  
  return (
    <>
        {/* subscribe */}
        <div className="tst-banner-sm">
            <div className="tst-cover-frame">
                <img src={Data.image.url} alt={Data.image.alt} className="tst-cover" />
                <div className="tst-overlay"></div>
            </div>
            <div className="row align-items-center">
                <div className="col-lg-12">
                    <div className="tst-text-frame text-center">
                        <div className="tst-suptitle tst-suptitle-mobile-center tst-suptitle-center tst-text-shadow tst-white-2 tst-mb-15">{t("subtitle")}</div>
                        <h2 className="tst-white-2 tst-text-shadow tst-mb-30">{t("title")}</h2>
                        <p className="tst-text tst-white-2 tst-text-shadow tst-mb-30">{t("description")}</p>
                        <form action={AppData.settings.mailchimp.url} method="post" target="_blank">
                            <input type="email" placeholder={t("emailPlaceholder")} name="EMAIL" required />
                            <button className="tst-btn" type="submit">{t("subscribeButton")}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        {/* subscribe end */}
    </>
  );
};

export default SubscribeSection;