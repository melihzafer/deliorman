import React from "react";
import { getLocale } from "next-intl/server";

import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import Products from '@data/products';

import PageBanner from "@components/PageBanner";
import SubscribeSection from "@components/sections/Subscribe";
import TeamSection from "@components/sections/Team";
import ProductsSlider from "@components/sliders/Products";
import { buildAlternates } from "@/src/i18n/seo";

import { getLegacyPageCopy } from "../pageCopy";

export async function generateMetadata() {
  const locale = await getLocale();
  const copy = getLegacyPageCopy("shop", locale);

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: buildAlternates("/shop", locale),
    robots: { index: false, follow: false },
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaDescription,
      type: "website",
    },
  };
}

const Shop = async () => {
  const locale = await getLocale();
  const copy = getLegacyPageCopy("shop", locale);

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
          <PageBanner
            pageTitle={copy.pageTitle}
            description={copy.pageDescription}
            breadTitle={copy.breadTitle}
          />
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
