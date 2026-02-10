import React from "react";

import AppData from "@data/app.json";
import ProductsData from "@data/products.json";
import MenuData from "@data/menu.json";
import Specialties from "@data/specialties.json";

import Link from "next/link";
import ScrollHint from "@layouts/scroll-hint/Index";

import PageBanner from "@components/PageBanner";
import CallToActionTwoSection from "@components/sections/CallToActionTwo";
import NewSpecialtiesCTA from "@components/sections/NewSpecialtiesCTALazy";
import MenuFiltered from "@components/menu/MenuFiltered";
import ProductsSlider from "@components/sliders/Products";

export const metadata = {
  title: {
		default: "Меню",
	},
  description: "Разгледайте менюто на ресторант Делиорман - традиционни български ястия, грил специалитети, пици, салати и десерти в село Самуил, Разград.",
  openGraph: {
    title: "Меню | Ресторант Делиорман",
    description: "Открийте автентична българска кухня и международни специалитети в ресторант Делиорман.",
    type: "website",
  },
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
              <div className="text-center mb-4">
                <Link
                  href="/menu/qr"
                  className="tst-btn"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                >
                  <i className="fas fa-qrcode" />
                  <span>QR Меню</span>
                </Link>
              </div>

              <ScrollHint />

              <MenuFiltered
                categories={MenuData.categories} 
              />

            </div>
          </div>
        </div>
        <br />
        {/* <CallToActionTwoSection /> */}
        <br />
        <br />
        <NewSpecialtiesCTA />
        {/* <br />
        <br /> */}
        {/* <div className="tst-content-frame">
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
        </div> */}
      </div>
    </>
  );
};
export default Menu1;