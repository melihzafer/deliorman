import React from "react";

import AppData from "@data/app.json";
import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import Products from '@data/products';

import PageBanner from "@components/PageBanner";
import SubscribeSection from "@components/sections/Subscribe";
import TeamSection from "@components/sections/Team";
import ProductsSlider from "@components/sliders/Products";

export const metadata = {
  title: {
		default: "Shop",
	},
  description: AppData.settings.siteDescription,
}

const Shop = () => {
  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
          <PageBanner pageTitle={"Shop"} description={"Quaerat debitis, vel, sapiente dicta sequi <br>labore porro pariatur harum expedita."} breadTitle={"Online Store"} />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
          <div className="tst-content-frame">
              <div className="tst-content-box">
                  <div className="container tst-p-60-60">
                      <ScrollHint />

                      <ProductsSlider 
                        items={Products.collection['popular']} 
                        heading={
                          { 
                            "subtitle": "Popular", 
                            "title": "Most popular dishes", 
                            "description": "Porro eveniet, autem ipsam corrupti consectetur cum. <br>Repudiandae dignissimos fugiat sit nam." 
                          }
                        }
                        button={
                          {
                            "link": "/products",
                            "label": "View all"
                          }
                        }
                      />
                      <Divider onlyBottom={0} />
                      <ProductsSlider 
                        items={Products.collection['bestseller']} 
                        heading={
                          { 
                            "subtitle": "Bestsellers", 
                            "title": "Our Bestsellers", 
                            "description": "Porro eveniet, autem ipsam corrupti consectetur cum. <br>Repudiandae dignissimos fugiat sit nam." 
                          }
                        }
                        button={
                          {
                            "link": "/products",
                            "label": "View all"
                          }
                        }
                      />
                      <Divider onlyBottom={0} />
                      <TeamSection />
                      <Divider onlyBottom={0} />
                      <SubscribeSection />
                      
                  </div>
              </div>
          </div>
      </div>
    </>
  );
};
export default Shop;