"use client";

import { SliderProps } from "@common/sliderProps";
import { Swiper, SwiperSlide } from "swiper/react";

import Data from '@data/sliders/testimonial';
import Link from "next/link";

const TestimonialSlider = () => {
  return (
    <>
      {/* testimonials */}
      <div className="row">

          <div className="col-lg-12">

            {/* title */}
            <div className="text-center">
              <div className="tst-suptitle tst-suptitle-center tst-mb-15">{Data.subtitle}</div>
              <h3 className="tst-mb-30" dangerouslySetInnerHTML={{__html : Data.title}} />
              <p className="tst-text" dangerouslySetInnerHTML={{__html : Data.description}} />
            </div>
            {/* title end */}

          </div>
          <div className="col-lg-12">

            {/* testimonials slider */}
            <Swiper
              {...SliderProps.testimonialsSlider}
              className="swiper-container tst-testimonials-slider tst-cursor-scroll"
            >
              {Data.items.map((item, key) => (
                <SwiperSlide className="swiper-slide" key={`testimonial-slider-item-${key}`}>
                  <div className="tst-testimonial-card">
                    <div className="tst-quote">"</div>
                    <h5 className="tst-mb-30" dangerouslySetInnerHTML={{__html : item.title}} />
                    <p className="tst-text" dangerouslySetInnerHTML={{__html : item.text}} />
                    <div className="tst-spacer-sm"></div>
                    <div className="tst-testimonial-bottom">
                      <div className="tst-visitor">
                        <img src={item.image} alt={item.name} />
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
              <Link href={Data.button.link} className="tst-btn tst-anima-link light">{Data.button.label}</Link>
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
