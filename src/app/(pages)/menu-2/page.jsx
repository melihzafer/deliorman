import React from "react";

import AppData from "@data/app.json";
import ProductsData from "@data/products.json";
import MenuData from "@data/menu.json";
import Specialties from "@data/specialties.json";

import ScrollHint from "@layouts/scroll-hint/Index";

import PageBanner from "@components/PageBanner";
import CallToActionTwoSection from "@components/sections/CallToActionTwo";
import MenuFiltered from "@components/menu/MenuFiltered2";
import ProductsSlider from "@components/sliders/Products";

export const metadata = {
  title: {
    default: "Меню",
  },
  description: AppData.settings.siteDescription,
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

              <MenuFiltered
                categories={MenuData.categories} 
              />

            </div>
          </div>
        </div>
        <br />
        <CallToActionTwoSection />
        <br />
        <br />
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              
              <ProductsSlider
                heading={
                  { 
                    "subtitle": "Специалитети", 
                    "title": "Новите Специалитети", 
                    "description": "Открийте нашите най-нови кулинарни творения, <br>приготвени с любов и традиционни рецепти." 
                  }
                } 
                items={Specialties.categories.find(cat => cat.slug === "specialties")?.items || []}
                button={
                  {
                    "link": "/menu",
                    "label": "Вижте цялото меню"
                  }
                }
              />

            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Menu1;