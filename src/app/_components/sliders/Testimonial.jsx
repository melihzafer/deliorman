"use client";

import Image from "next/image";
import { SliderProps } from "@common/sliderProps";
import { Swiper, SwiperSlide } from "swiper/react";

import { getLocalizedTestimonialSliderData } from '@data/sliders/getLocalizedTestimonialSliderData';
import Link from "next/link";
import { useLocale } from "next-intl";
import { useMemo } from "react";

const TestimonialSlider = () => {
  const locale = useLocale();
  const localizedData = useMemo(() => getLocalizedTestimonialSliderData(locale), [locale]);

  return (
    <>
      {/* testimonials */}
      <div className="row">

          <div className="col-lg-12">

            {/* title */}
            <div className="text-center">
              <div className="tst-suptitle tst-suptitle-center tst-mb-15">{localizedData.subtitle}</div>
              <h3 className="tst-mb-30" dangerouslySetInnerHTML={{__html : localizedData.title}} />
              <p className="tst-text" dangerouslySetInnerHTML={{__html : localizedData.description}} />
            </div>
            {/* title end */}

          </div>
          <div className="col-lg-12">

            {/* testimonials slider */}
            <Swiper
              {...SliderProps.testimonialsSlider}
              className="swiper-container tst-testimonials-slider tst-cursor-scroll"
            >
              {localizedData.items.map((item, key) => (
                <SwiperSlide className="swiper-slide" key={`testimonial-slider-item-${key}`}>
                  <div className="tst-testimonial-card">
                    <div className="tst-quote">"</div>
                    <h5 className="tst-mb-30" dangerouslySetInnerHTML={{__html : item.title}} />
                    <p className="tst-text" dangerouslySetInnerHTML={{__html : item.text}} />
                    <div className="tst-spacer-sm"></div>
                    <div className="tst-testimonial-bottom">
                      <div className="tst-visitor">
                        <div style={{ position: "relative", width: 60, height: 60, borderRadius: "50%", overflow: "hidden" }}>
                          <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                        </div>
                        <h6>{item.name}</h6>
                      </div>
                      <div className="tst-date">{item.date}</div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {/* testimonials slider end */}

          </div>

          <div className="col-lg-12">

            {/* slider navigation */}
            <div className="tst-slider-navigation">
              <Link href={localizedData.button.link} className="tst-btn tst-anima-link light"><span>{localizedData.button.label}</span></Link>
              <div className="tst-slider-pagination tst-testi-pagination"></div>
              <div className="tst-nav tst-right">
                <div className="tst-label">Slider navigation</div>
                <div className="tst-slider-btn tst-testi-prev"><i className="fas fa-arrow-left"></i></div>
                <div className="tst-slider-btn tst-testi-next"><i className="fas fa-arrow-right"></i></div>
              </div>
            </div>
            {/* slider navigation end */}

          </div>
      </div>
      {/* testimonials end */}
    </>
  );
};
export default TestimonialSlider;
