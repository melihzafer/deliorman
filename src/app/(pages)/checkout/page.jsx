import React from "react";

import AppData from "@data/app.json";

import PageBanner from "@components/PageBanner";
import LegacyOrderNotice from "@components/order/LegacyOrderNotice";

export const metadata = {
  title: {
    default: "Поръчка от менюто",
  },
  description: AppData.settings.siteDescription,
  robots: { index: false, follow: false },
};

const Checkout = () => {
  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner
          pageTitle={"Поръчка от менюто"}
          description={"Изберете ястия от менюто и завършете поръчката чрез WhatsApp или телефон."}
          breadTitle={"Поръчка"}
        />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <LegacyOrderNotice
                title="Checkout формата е заменена с директна поръчка"
                description="Поръчките вече се финализират от страницата с менюто чрез плаващата лента за WhatsApp или обаждане."
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Checkout;
