"use client";

import { useState, useRef } from "react";
import { SliderProps } from "@common/sliderProps";
import { Swiper, SwiperSlide } from "swiper/react";
import MenuItem from "@components/menu/MenuItem";
import styles from "./MenuFiltered.module.scss";

const MenuFiltered = ({ heading = 0, categories }) => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const swiperRef = useRef(null);
  const navRef = useRef(null);

  // Handle category click
  const handleCategoryClick = (index) => {
    setActiveCategory(index);
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  // Handle slide change
  const handleSlideChange = (swiper) => {
    setActiveCategory(swiper.activeIndex);
    scrollNavToActive(swiper.activeIndex);
  };

  // Auto-scroll nav bar to show active category
  const scrollNavToActive = (index) => {
    if (!navRef.current) return;
    const navContainer = navRef.current;
    const activeButton = navContainer.children[index];
    
    if (activeButton) {
      const containerWidth = navContainer.offsetWidth;
      const buttonLeft = activeButton.offsetLeft;
      const buttonWidth = activeButton.offsetWidth;
      const scrollLeft = navContainer.scrollLeft;

      // Center the button in the nav container
      const targetScroll = buttonLeft - containerWidth / 2 + buttonWidth / 2;
      
      navContainer.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className="row" id="menu">
        {/* Title Section */}
        <div className="col-lg-12">
          {heading != 0 && (
            <>
              <div className="text-center">
                <div className="tst-suptitle tst-suptitle-center tst-mb-15">
                  {heading.subtitle}
                </div>
                <h3
                  className="tst-mb-30"
                  dangerouslySetInnerHTML={{ __html: heading.title }}
                />
                <p
                  className="tst-text tst-mb-30"
                  dangerouslySetInnerHTML={{ __html: heading.description }}
                />
              </div>
            </>
          )}
        </div>

            <div className="col-lg-12">
              <div className={styles.menuNavContainer}>
                <div className={styles.menuNav} ref={navRef}>
                  {categories.map((category, key) => (
                <button
                  key={`menu-nav-btn-${key}`}
                  className={`${styles.menuNavBtn} ${
                    activeCategory === key ? styles.active : ""
                  }`}
                  onClick={() => handleCategoryClick(key)}
                  data-category={category.slug}
                >
                  <span className={styles.categoryName}>{category.name}</span>
                </button>
                  ))}
                </div>
              </div>
              <p className="tst-text tst-mb-15" style={{ textAlign: 'center', fontSize: '14px', opacity: 0.7 }}>
                Плъзни за да разгледаш категориите
              </p>
              <div className="tst-spacer tst-spacer-only-bottom-space"></div>
            </div>

            {/* Menu Items Slider */}
        <div className="col-lg-12">
          <Swiper
            ref={swiperRef}
            {...SliderProps.menuSlider}
            className="swiper-container swiper-menu"
            onSlideChange={handleSlideChange}
          >
            {categories.map((category, category_key) => (
              <SwiperSlide
                className={`menuitem ${activeCategory === category_key ? styles.activeSlide : styles.inactiveSlide}`}
                key={`menu-filtered-category-${category_key}`}
              >
                <div className={styles.menuGrid}>
                  {category.items.map((item, key) => (
                    <div
                      className={styles.menuGridItem}
                      key={`menu-filtered-item-${category_key}-${key}`}
                    >
                      <MenuItem item={item} />
                    </div>
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default MenuFiltered;
  