import React from "react";
import { getLocale } from "next-intl/server";

import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";
import ProductsData from "@data/products.json";

import PageBanner from "@components/PageBanner";
import SubscribeSection from "@components/sections/Subscribe";
import ProductsGrid from "@components/products/ProductsGrid";
import { buildAlternates } from "@/src/i18n/seo";

import { getLegacyPageCopy } from "../pageCopy";

export async function generateMetadata() {
  const locale = await getLocale();
  const copy = getLegacyPageCopy("products", locale);

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: buildAlternates("/products", locale),
    robots: { index: false, follow: false },
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaDescription,
      type: "website",
    },
  };
}

const Products = async () => {
  const locale = await getLocale();
  const copy = getLegacyPageCopy("products", locale);

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

                      <div className="row">

                        <div className="col-lg-12">

                          {/* title */}
                          <div className="text-center">
                            <div className="tst-suptitle tst-suptitle-center tst-mb-15">Menu</div>
                            <h3 className="tst-mb-30">Main Dishes</h3>
                            <p className="tst-text tst-mb-60">Porro eveniet, autem ipsam corrupti consectetur cum. <br/>Repudiandae dignissimos fugiat sit nam.</p>
                          </div>
                          {/* title end */}

                        </div>
                      </div>

                      <ProductsGrid items={ProductsData.items} />

                      <div>
                        <ul className="tst-pagination">
                          <li className="tst-active"><a href="#.">1</a></li>
                          <li><a href="#">2</a></li>
                          <li><a href="#">3</a></li>
                          <li><a href="#">4</a></li>
                          <li><a href="#">...</a></li>
                        </ul>
                      </div>

                      <Divider onlyBottom={0} />
                      <SubscribeSection />
                      
                  </div>
              </div>
          </div>
      </div>
    </>
  );
};
export default Products;
