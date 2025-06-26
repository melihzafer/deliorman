import React from "react";
import dynamic from "next/dynamic";

import AppData from "@data/app.json";
import MenuData from "@data/menu.json";
import ProductsData from "@data/products.json";

import ScrollHint from "@layouts/scroll-hint/Index";

import PageBanner from "@components/PageBanner";
import CallToActionTwoSection from "@components/sections/CallToActionTwo";

const MenuFiltered = dynamic( () => import("@components/menu/MenuFiltered"), { ssr: false } );
const ProductsSlider = dynamic( () => import("@components/sliders/Products"), { ssr: false } );

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
          description={"Насладете се на автентична българска кухня и <br>международни специалитети в сърцето на Силистра."} 
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
        <CallToActionTwoSection />
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
                items={MenuData.categories.find(cat => cat.slug === "specialties")?.items || []}
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