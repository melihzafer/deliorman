"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Link } from "@/src/i18n/navigation";
import styles from "../../_styles/scss/NewSpecialtiesCTA.module.scss";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const NewSpecialtiesCTA = () => {
    const t = useTranslations("menu");
    const slides = t.raw("specialtiesSlides");
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [failedImages, setFailedImages] = useState(new Set());

    const handleSwiper = (swiper) => {
        if (swiper.params.navigation && prevRef.current && nextRef.current) {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
        }
    };

    return (
        <>
            <div className={styles.specialtiesSlider}>
                <div className="container">
                    <div className={styles.navButtons}>
                        <button ref={prevRef} className={styles.navBtn} aria-label={t("previousSpecialty")}>
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button ref={nextRef} className={styles.navBtn} aria-label={t("nextSpecialty")}>
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
                        onSwiper={handleSwiper}
                        loop={true}
                        className={styles.swiperContainer}
                    >
                        {slides.map((slide, slideIndex) => (
                            <SwiperSlide key={`slide-${slideIndex}`}>
                                <div className={styles.slideContent}>
                                    <div className="row align-items-center">
                                        <div className="col-lg-6 order-lg-2">
                                            <div className={styles.textContent}>
                                                <div className={styles.badge}>
                                                    <i className="fas fa-star"></i>
                                                    <span dangerouslySetInnerHTML={{__html: slide.subtitle}} />
                                                </div>
                                                
                                                <h2 className={styles.title} dangerouslySetInnerHTML={{__html: slide.title}} />
                                                
                                                <p className={styles.description} dangerouslySetInnerHTML={{__html: slide.description}} />

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

                                                <Link href={slide.button.link} className={styles.ctaBtn}>
                                                    <i className={slide.button.icon}></i>
                                                    {slide.button.label}
                                                </Link>
                                            </div>
                                        </div>
                                        
                                        <div className="col-lg-6 order-lg-1">
                                            <div className={styles.imageWrapper}>
                                                {failedImages.has(slideIndex) ? (
                                                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #f39c12, #d4a373)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <i className="fas fa-utensils" style={{ fontSize: '64px', color: 'white', opacity: 0.3 }}></i>
                                                    </div>
                                                ) : (
                                                    <Image 
                                                        src={slide.image.url} 
                                                        alt={slide.image.alt}
                                                        fill
                                                        className={styles.slideImage}
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                        style={{ objectFit: 'cover' }}
                                                        onError={() => setFailedImages(prev => new Set([...prev, slideIndex]))}
                                                    />
                                                )}
                                                <div className={styles.imageOverlay}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className={styles.pagination}></div>
                </div>
            </div>
        </>
    );
};

export default NewSpecialtiesCTA;
