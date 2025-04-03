"use client";

import { SliderProps } from "@common/sliderProps";
import { Swiper, SwiperSlide } from "swiper/react";

import MenuItem from "@components/menu/MenuItem";

const MenuFiltered = ({ heading = 0, categories }) => {
    return (
      <>
        <div className="row" id="menu">

            <div className="col-lg-12">
            
            {heading != 0 &&
            <>
                {/* title */}
                <div className="text-center">
                    <div className="tst-suptitle tst-suptitle-center tst-mb-15">{heading.subtitle}</div>
                    <h3 className="tst-mb-30" dangerouslySetInnerHTML={{__html : heading.title}} />
                    <p className="tst-text tst-mb-30" dangerouslySetInnerHTML={{__html : heading.description}} />
                </div>
                {/* title end */}
            </>
            }

            </div>

            <div className="col-lg-12">

            <div className="swiper-menu-nav">
                {categories.map((category, key) => (
                <span key={`menu-category-item-${key}`} data-slug={`${category.slug}`}>{category.name}</span>
                ))}
            </div>

            <div className="tst-spacer tst-spacer-only-bottom-space"></div>

            </div>

            <div className="col-lg-12">

            {/* Slider main container */}
            <Swiper
              {...SliderProps.menuSlider}
              className="swiper-container swiper-menu"
            >
                
                {categories.map((category, category_key) => (
                <SwiperSlide className="swiper-slide" key={`menu-filtered-category-${category_key}`}>

                    <div className="row">

                    {category.items.map((item, key) => (
                    <div className="col-lg-6" key={`menu-filtered-item-${category_key}-${key}`}>
                        <MenuItem item={item} />
                    </div>
                    ))}

                    </div>

                </SwiperSlide>
                ))}

            </Swiper>
            {/* Slider main container end */}

            </div>

        </div>
      </>
    );
};
export default MenuFiltered;
  