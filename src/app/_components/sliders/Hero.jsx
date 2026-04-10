"use client";

import { SliderProps } from "@common/sliderProps";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect } from "react";
import Image from "next/image";

import Data from '@data/sliders/hero';
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";

import { ScrollAnimation } from "@common/scrollAnims";

const HeroSlider = () => {
  const tMenu = useTranslations("menu");
  const tHero = useTranslations("hero");
  const slides = tHero.raw("slides");

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
                  src={Data.items[key]?.image?.url || "/img/banners/hero-bg.webp"}
                  alt={Data.items[key]?.image?.alt || "Hero background"}
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
                      <Link href={Data.items[key]?.button1?.link || "/menu"} className="tst-btn tst-btn-lg tst-btn-shadow tst-res-btn tst-mr-30">{getButtonLabel(Data.items[key]?.button1?.link, item.button1)}</Link>
                      <Link href={Data.items[key]?.button2?.link || "/reservation"} className="tst-label tst-white-2">{getButtonLabel(Data.items[key]?.button2?.link, item.button2)}</Link>
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
              <button type="button" className="tst-slider-btn tst-main-prev" aria-label="Previous slide" style={{ background: 'none', border: 'none', padding: '10px' }}><i className="fas fa-arrow-left"></i></button>
              <button type="button" className="tst-slider-btn tst-main-next" aria-label="Next slide" style={{ background: 'none', border: 'none', padding: '10px' }}><i className="fas fa-arrow-right"></i></button>
            </div>

          </div>
      </Swiper>
      {/* hero slider end */}
    </>
  );
};
export default HeroSlider;
