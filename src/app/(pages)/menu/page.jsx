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
		default: "Menu",
	},
  description: AppData.settings.siteDescription,
}

const Menu1 = () => {
  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner pageTitle={"Discover Our menu"} description={"Quaerat debitis, vel, sapiente dicta sequi <br>labore porro pariatur harum expedita."} breadTitle={"Menu"} />
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
                    "subtitle": "Menu", 
                    "title": "Special proposals", 
                    "description": "Porro eveniet, autem ipsam corrupti consectetur cum. <br>Repudiandae dignissimos fugiat sit nam." 
                  }
                } 
                items={ProductsData.collection.special}
                button={
                  {
                    "link": "/shop",
                    "label": "Go to online store"
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