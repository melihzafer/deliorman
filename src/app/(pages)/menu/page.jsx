import React from "react";

import AppData from "@data/app.json";
import {getMenuCategories} from "../../../lib/sanity.adapters.js";

import ScrollHint from "@layouts/scroll-hint/Index";

import PageBanner from "@components/PageBanner";
import NewSpecialtiesCTA from "@components/sections/NewSpecialtiesCTA-Sanity";
import MenuFiltered from "@components/menu/MenuFiltered";

export const metadata = {
  title: {
		default: "Меню",
	},
  description: AppData.settings.siteDescription,
}

const Menu1 = async () => {
  // Fetch menu from Sanity (server-side)
  const categories = await getMenuCategories();

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
                categories={categories} 
              />

            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
        <NewSpecialtiesCTA />
      </div>
    </>
  );
};
export default Menu1;