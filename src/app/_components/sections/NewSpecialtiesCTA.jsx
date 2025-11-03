"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper";
import Data from "@data/sections/new-specialties-cta.json";
import styles from "../../_styles/scss/NewSpecialtiesCTA.module.scss";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const NewSpecialtiesCTA = () => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <>
            {/* New Specialties Slider */}
            <div className={styles.specialtiesSlider}>
                <div className="container">
                    {/* Navigation Buttons */}
                    <div className={styles.navButtons}>
                        <button ref={prevRef} className={styles.navBtn} aria-label="Previous specialty">
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button ref={nextRef} className={styles.navBtn} aria-label="Next specialty">
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>

                    <Swiper
                        modules={[Navigation, Pagination, Autoplay, EffectFade]}
                        spaceBetween={30}
                        slidesPerView={1}
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        speed={800}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                            el: `.${styles.pagination}`,
                        }}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        onBeforeInit={(swiper) => {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                        }}
                        loop={true}
                        className={styles.swiperContainer}
                    >
                        {Data.slides.map((slide, slideIndex) => (
                            <SwiperSlide key={`slide-${slideIndex}`}>
                                <div className={styles.slideContent}>
                                    <div className="row align-items-center">
                                        <div className="col-lg-6 order-lg-2">
                                            {/* Text Content */}
                                            <div className={styles.textContent}>
                                                <div className={styles.badge}>
                                                    <i className="fas fa-star"></i>
                                                    <span dangerouslySetInnerHTML={{__html: slide.subtitle}} />
                                                </div>
                                                
                                                <h2 className={styles.title} dangerouslySetInnerHTML={{__html: slide.title}} />
                                                
                                                <p className={styles.description} dangerouslySetInnerHTML={{__html: slide.description}} />

                                                {/* Features */}
                                                <div className={styles.features}>
                                                    {slide.features.map((feature, featureIndex) => (
                                                        <div className={styles.feature} key={`feature-${slideIndex}-${featureIndex}`}>
                                                            <div className={styles.featureIcon}>
                                                                <i className={feature.icon}></i>
                                                            </div>
                                                            <div className={styles.featureContent}>
                                                                <h6 className={styles.featureTitle}>{feature.title}</h6>
                                                                <p className={styles.featureText}>{feature.text}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <a href={slide.button.link} className={styles.ctaBtn}>
                                                    <i className={slide.button.icon}></i>
                                                    {slide.button.label}
                                                </a>
                                            </div>
                                        </div>
                                        
                                        <div className="col-lg-6 order-lg-1">
                                            {/* Image */}
                                            <div className={styles.imageWrapper}>
                                                <img 
                                                    src={slide.image.url} 
                                                    alt={slide.image.alt}
                                                    className={styles.slideImage}
                                                    onError={(e) => {
                                                        e.target.src = '/img/bg.jpg';
                                                    }}
                                                />
                                                <div className={styles.imageOverlay}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Pagination */}
                    <div className={styles.pagination}></div>
                </div>
            </div>
            {/* New Specialties Slider end */}
        </>
    );
};

export default NewSpecialtiesCTA;
