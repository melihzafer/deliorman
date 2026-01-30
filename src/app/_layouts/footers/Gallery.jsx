"use client";

import { SliderProps } from "@common/sliderProps";
import { Swiper, SwiperSlide } from "swiper/react";

import { useState, useMemo, useCallback } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import Link from "next/link";

const FooterGalleryModule = ( { items, button } ) => {
  const [img, setImg] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  // Monomorphic: derive slides from props using useMemo (no empty→filled transition)
  const slides = useMemo(() => items.map(item => ({ src: item.image, alt: item.alt })), [items]);

  const handleImageClick = useCallback((e, index) => {
    e.preventDefault();
    setInitialIndex(index);
    setImg(true);
  }, []);

  return (
    <>
        {/* footer gallery */}
        <Swiper
            {...SliderProps.footerGallerySlider}
            className={`swiper-container tst-footer-gallery tst-cursor-zoom`}
        >
            {items.map((item, key) => (
            <SwiperSlide key={`footer-gallery-item-${key}`}>
                <div className="tst-footer-gal-item">
                    <img src={item.image} alt={item.alt} />
                    <a data-fancybox="gal" href={item.image} className="tst-overlay" onClick={(e) => handleImageClick(e, key)}>
                        <i className="fas fa-search-plus"></i>
                    </a>
                </div>
            </SwiperSlide>
            ))}
        </Swiper>
        <div className="tst-gallery-nav">
            <Link href={button.link} className="tst-label tst-color tst-anima-link">{button.label}</Link>
            <div className="tst-fg-nav">
                <div className="tst-slider-btn tst-fg-prev"><i className="fas fa-arrow-left"></i></div>
                <div className="tst-slider-btn tst-fg-next"><i className="fas fa-arrow-right"></i></div>
            </div>
        </div>
        <Lightbox
            open={img}
            close={() => setImg(false)}
            slides={slides}
            index={initialIndex}
            styles={{ container: { backgroundColor: "rgba(26, 47, 51, .85)" } }}
            controller={{ closeOnBackdropClick: true }}
        />
        {/* footer gallery end */}
    </>
  );
};

export default FooterGalleryModule;