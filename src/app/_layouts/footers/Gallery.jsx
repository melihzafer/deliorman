"use client";

import { SliderProps } from "@common/sliderProps";
import { Swiper, SwiperSlide } from "swiper/react";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import Link from "next/link";

const FooterGalleryModule = ( { items, button } ) => {
  const [img, setImg] = useState(false);
  const [imgValue, setImgValue] = useState([]);

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
                    <a data-fancybox="gal" href={item.image} className="tst-overlay" onClick={ (e) => { e.preventDefault(); setImg(true); setImgValue( [{ "src": item.image, "alt": item.alt }] ); }}>
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
            slides={imgValue}
            styles={{ container: { backgroundColor: "rgba(26, 47, 51, .85)" } }}
            render={{
                buttonPrev: imgValue.length <= 1 ? () => null : undefined,
                buttonNext: imgValue.length <= 1 ? () => null : undefined,
            }}
        />
        {/* footer gallery end */}
    </>
  );
};

export default FooterGalleryModule;