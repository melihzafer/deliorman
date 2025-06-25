"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

import { ScrollAnimation } from "@common/scrollAnims";
import { mapboxInit } from "@common/mapboxInit";

const PageBanner = ({ pageTitle, pageSubTitle = false, description, breadTitle, showMap = 0 }) => {
  const asPath = usePathname();
  const [mapLock, setMapLock] = useState(false);

  let clearBreadTitle;
  
  if(!pageSubTitle) {
    pageSubTitle = breadTitle;
  }

  if ( breadTitle != undefined ) {
    clearBreadTitle = breadTitle;
  } else {
    const regex = /(<([^>]+)>)/gi;
    clearBreadTitle = pageTitle ? pageTitle.replace(regex, "") : "";
  }

  if ( pageTitle == 'Search: %s' ) {
    const searchParams = useSearchParams();
    const query = searchParams.get('key');
    
    pageTitle = 'Search: '+query;
  }
  
  useEffect(() => {
    ScrollAnimation();

    if ( showMap ) {
      mapboxInit();
    }
  }, []);
  
  return (
    <>    
      {/* banner */}
      <div className="tst-banner tst-small-banner">
        {showMap ? (
        <div className="tst-cover-frame">
          <div className="tst-map-frame tst-parallax">
            <div id="map" className={`tst-map ${mapLock ? "tst-active": ""}`} />
          </div>
          <div className={`tst-overlay tst-with-map ${mapLock ? "tst-active": ""}`}></div>
          <div className={`tst-lock ${mapLock ? "tst-active": ""}`} onClick={() => setMapLock(!mapLock)}>
            <i className={`fas ${mapLock ? "fa-unlock": "fa-lock"}`} />
          </div>
        </div>
        ) : (
        <div className="tst-cover-frame"> 
          <img src="/img/banners/banner-sm-1.jpg" alt="cover" className="tst-cover tst-parallax" />
          <div className="tst-overlay"></div>
        </div>
        )}
        <div className={showMap ? `tst-banner-content-frame tst-with-map ${mapLock ? "tst-active": ""}` : "tst-banner-content-frame"}>
          <div className="container">
            <div className="tst-main-title-frame">
              <div className={showMap ? "tst-main-title" : "tst-main-title text-center"}>
                <div className={`tst-suptitle ${showMap ? "": "tst-suptitle-center"} tst-suptitle-mobile-center tst-text-shadow tst-white-2 tst-mb-15`} dangerouslySetInnerHTML={{__html : pageSubTitle}} />
                <h1 className="tst-white-2 tst-text-shadow tst-mb-30" dangerouslySetInnerHTML={{__html : pageTitle}} />
                <div className="tst-text tst-text-shadow tst-text-lg tst-white-2 tst-mb-30" dangerouslySetInnerHTML={{__html : description}} />
                <ul className="tst-breadcrumbs">
                    <li><Link href="/" className="tst-anima-link">Начало</Link></li>
                    {asPath.indexOf('/blog/') != -1 && asPath.indexOf('/blog/page/') == -1 &&
                    <li>
                      <Link href="/blog">Blog</Link>
                    </li>
                    }
                    {asPath.indexOf('/products') != -1 || asPath.indexOf('/cart') != -1 || asPath.indexOf('/checkout') != -1 &&
                    <li>
                      <Link href="/shop">Shop</Link>
                    </li>
                    }
                    {asPath.endsWith('/product') == 1 &&
                    <li>
                      <Link href="/products">Products</Link>
                    </li>
                    }
                    <li className="tst-active"><a dangerouslySetInnerHTML={{__html : clearBreadTitle}} /></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* banner end */}
    </>
  );
};
export default PageBanner;
