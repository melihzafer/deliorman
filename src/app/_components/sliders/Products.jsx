"use client";

import { SliderProps } from "@common/sliderProps";
import { Swiper, SwiperSlide } from "swiper/react";

import Link from "next/link";

import ProductItem from "@components/products/ProductItem";

const ProductsSlider = ( { heading = {}, items, button = {} } ) => {  
  return (
    <>
        {/* products slider */}
        <div className="row align-items-center">
            {heading != 0 &&
            <div className="col-lg-12">

                {/* title */}
                <div className="text-center">
                    <div className="tst-suptitle tst-suptitle-center tst-mb-15" dangerouslySetInnerHTML={{__html : heading.subtitle}} />
                    <h3 className="tst-mb-30" dangerouslySetInnerHTML={{__html : heading.title}} />
                    <p className="tst-text" dangerouslySetInnerHTML={{__html : heading.description}} />
                </div>
                {/* title end */}

            </div>
            }

            <div className="col-lg-12">

                {/* slider */}
                <Swiper
                    {...SliderProps.slider}
                    className={`swiper-container tst-slider`}
                >
                    {items.slice(0, 6).map((item, key) => (
                    <SwiperSlide className="swiper-slide" key={`products-slider-item-${key}`}>
                        <ProductItem item={item} index={key} />
                    </SwiperSlide>
                    ))}
                </Swiper>
                {/* slider */}

            </div>

            <div className="col-lg-12">

            {/* slider navigation */}
            <div className="tst-slider-navigation">
                {button != 0 &&
                <Link href={button.link} className="tst-btn">{button.label}</Link>
                }
                <div className="tst-slider-pagination tst-testi-pagination"></div>
                <div className="tst-nav tst-right">
                    <div className="tst-label">Навигация на слайдера</div>
                    <div className="tst-slider-btn tst-prev"><i className="fas fa-arrow-left"></i></div>
                    <div className="tst-slider-btn tst-next"><i className="fas fa-arrow-right"></i></div>
                </div>
            </div>
            {/* slider navigation end */}

            </div>

        </div>
        {/* products slider end */}
    </>
  );
};
export default ProductsSlider;
