"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Link, usePathname } from "@/src/i18n/navigation";
import { useSearchParams } from 'next/navigation';
import { useTranslations } from "next-intl";

import { ScrollAnimation } from "@common/scrollAnims";
import { mapboxInit } from "@common/mapboxInit";

const PageBanner = ({ pageTitle, pageSubTitle = false, description, breadTitle, showMap = 0 }) => {
  const asPath = usePathname();
  const searchParams = useSearchParams();
  const tn = useTranslations("nav");
  const tc = useTranslations("common");
  const [mapLock, setMapLock] = useState(false);
  const query = searchParams.get('key');
  const resolvedPageTitle =
    typeof pageTitle === "string" && pageTitle.includes("%s")
      ? pageTitle.replace("%s", query || "")
      : pageTitle;

  let clearBreadTitle;
  
  if(!pageSubTitle) {
    pageSubTitle = breadTitle;
  }

  if ( breadTitle != undefined ) {
    clearBreadTitle = breadTitle;
  } else {
    const regex = /(<([^>]+)>)/gi;
    clearBreadTitle = resolvedPageTitle ? resolvedPageTitle.replace(regex, "") : "";
  }
  
  useEffect(() => {
    // Defer ScrollAnimation to avoid blocking initial render
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => ScrollAnimation());
    } else {
      setTimeout(() => ScrollAnimation(), 100);
    }

    if ( showMap ) {
      mapboxInit().catch(console.error);
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
          <Image
            src="/img/outdoor_footage/IMG_9339.webp"
            alt={tc("bannerImageAlt")}
            fill
            priority
            sizes="100vw"
            className="tst-cover"
            style={{ objectFit: 'cover' }}
            suppressHydrationWarning
          />
          <div className="tst-overlay"></div>
        </div>
        )}
        <div className={showMap ? `tst-banner-content-frame tst-with-map ${mapLock ? "tst-active": ""}` : "tst-banner-content-frame"}>
          <div className="container">
            <div className="tst-main-title-frame">
              <div className={showMap ? "tst-main-title" : "tst-main-title text-center"} suppressHydrationWarning>
                <div className={`tst-suptitle ${showMap ? "": "tst-suptitle-center"} tst-suptitle-mobile-center tst-text-shadow tst-white-2 tst-mb-15`} dangerouslySetInnerHTML={{__html : pageSubTitle}} />
                <h1 className="tst-white-2 tst-text-shadow tst-mb-30" dangerouslySetInnerHTML={{__html : resolvedPageTitle}} />
                <div className="tst-text tst-text-shadow tst-text-lg tst-white-2 tst-mb-30" dangerouslySetInnerHTML={{__html : description}} />
                <ul className="tst-breadcrumbs">
                    <li><Link href="/" className="tst-anima-link">{tn("home")}</Link></li>
                    {asPath.indexOf('/blog/') != -1 && asPath.indexOf('/blog/page/') == -1 &&
                    <li>
                      <Link href="/blog">{tn("blog")}</Link>
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
