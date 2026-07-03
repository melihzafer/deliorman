"use client";

import { SliderProps } from "@common/sliderProps";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useMemo } from "react";
import Image from "next/image";

import { getLocalizedHeroData } from '@data/sliders/getLocalizedHeroData';
import { Link } from "@/src/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";

import { ScrollAnimation } from "@common/scrollAnims";

const HeroSlider = () => {
  const locale = useLocale();
  const tMenu = useTranslations("menu");
  
  const localizedData = useMemo(() => getLocalizedHeroData(locale), [locale]);
  const slides = localizedData.items;

  useEffect(() => {
    // Defer ScrollAnimation to avoid blocking initial render
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => ScrollAnimation());
    } else {
      setTimeout(() => ScrollAnimation(), 100);
    }
  }, []);

  const getButtonLabel = (buttonLink, defaultLabel) => {
    if (buttonLink === "/menu") {
      return tMenu("orderFromMenuCta");
    }

    return defaultLabel;
  };
  
  return (
    <>
      {/* hero slider */}
      <Swiper
        {...SliderProps.heroSlider}
        className="swiper-container tst-main-slider"
        style={{"overflow": "visible"}}
      >
          {slides.map((item, key) => (
            <SwiperSlide className="swiper-slide" key={`hero-slider-item-${key}`}>

            {/* banner */}
            <div className="tst-banner">
              <div className="tst-cover-frame">
                <Image
                  src={item.image?.url || "/img/banners/hero-bg.webp"}
                  alt={item.image?.alt || "Hero background"}
                  fill
                  priority={key === 0}
                  quality={90}
                  sizes="100vw"
                  className="tst-cover"
                  style={{ objectFit: 'cover' }}
                />
                <div className="tst-overlay"></div>
              </div>
              <div className="tst-banner-content-frame">
                <div className="container">
                  <div className="tst-main-title-frame">
                    <div className="tst-main-title" suppressHydrationWarning>
                      <div className="tst-suptitle tst-suptitle-mobile-center tst-text-shadow tst-white-2 tst-mb-15" dangerouslySetInnerHTML={{__html : item.subtitle}}  />
                      <h1 className="tst-white-2 tst-text-shadow tst-mb-30" dangerouslySetInnerHTML={{__html : item.title}}  />
                      <div className="tst-text tst-text-shadow tst-text-lg tst-white-2 tst-mb-30" dangerouslySetInnerHTML={{__html : item.text}}  />
                      <Link href={item.button1?.link || "/menu"} className="tst-btn tst-btn-lg tst-btn-shadow tst-res-btn tst-mr-30"><span>{getButtonLabel(item.button1?.link, item.button1?.label)}</span></Link>
                      <Link href={item.button2?.link || "/reservation"} className="tst-label tst-white-2"><span>{getButtonLabel(item.button2?.link, item.button2?.label)}</span></Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* banner end */}

            </SwiperSlide>
          ))} 
          

          <div className="tst-main-slider-navigation">

            <div className="tst-main-pagination" suppressHydrationWarning></div>

            <div className="tst-main-slider-nav" suppressHydrationWarning>
              <button type="button" className="tst-slider-btn tst-main-prev" aria-label="Previous slide" style={{ background: 'none', border: 'none', padding: '12px', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><i className="fas fa-arrow-left"></i></button>
              <button type="button" className="tst-slider-btn tst-main-next" aria-label="Next slide" style={{ background: 'none', border: 'none', padding: '12px', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><i className="fas fa-arrow-right"></i></button>
            </div>

          </div>
      </Swiper>
      {/* hero slider end */}
    </>
  );
};
export default HeroSlider;
