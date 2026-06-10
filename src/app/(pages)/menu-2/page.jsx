import React from "react";

import AppData from "@data/app.json";
import MenuData from "@data/menu.json";

import ScrollHint from "@layouts/scroll-hint/Index";

import PageBanner from "@components/PageBanner";
import MenuFiltered from "@components/menu/MenuFiltered2";
import MenuAIAssistant from "@components/menu/ai/MenuAIAssistant";

export const metadata = {
  title: {
    default: "Меню",
  },
  description: AppData.settings.siteDescription,
  robots: { index: false, follow: false },
}

const Menu1 = () => {
  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner 
          pageTitle={"Открийте нашето меню"} 
          description={"Насладете се на автентична българска кухня и <br>международни специалитети в сърцето на Лудогоритето."} 
          breadTitle={"Меню"} 
        />
      </div>
      
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-0">
              <ScrollHint />

              <MenuAIAssistant />

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