import React from "react";

import MenuData from "@data/menu.json";

import ScrollHint from "@layouts/scroll-hint/Index";

import PageBanner from "@components/PageBanner";
import NewSpecialtiesCTA from "@components/sections/NewSpecialtiesCTALazy";
import MenuFiltered from "@components/menu/MenuFiltered";

export const metadata = {
  title: 'Меню | Традиционна Българска Кухня',
  description: 'Разгледайте менюто на Ресторант Делиорман в Разград. Традиционни български ястия, салати, грил специалитети, пици, сач и десерти на достъпни цени.',
  openGraph: {
    title: 'Меню | Ресторант Делиорман',
    description: 'Традиционна българска кухня — салати, скара, пици, сач, десерти. Свежи продукти и автентични рецепти в село Самуил.',
    type: 'website',
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
              <ScrollHint />

              <MenuFiltered
                categories={MenuData.categories} 
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