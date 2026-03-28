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

const Cart = () => {
  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner
          pageTitle={"Поръчка от менюто"}
          description={"Онлайн поръчките вече се правят директно от страницата с менюто."}
          breadTitle={"Поръчка"}
        />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <LegacyOrderNotice
                title="Количката вече не се използва"
                description="За да направите поръчка, добавете ястия от страницата с менюто и използвайте плаващата лента в долната част на екрана."
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Cart;
