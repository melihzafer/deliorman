"use client";

import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper";
import {urlFor} from "../../../lib/sanity.image.js";
import styles from "../../_styles/scss/NewSpecialtiesCTA.module.scss";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const NewSpecialtiesCTA = () => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch promos from Sanity API
        fetch('/api/sanity/promos')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.promos) {
                    setPromos(Array.isArray(data.promos) ? data.promos : []);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load promos:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className={styles.specialtiesSlider}>
                <div className="container">
                    <div style={{textAlign: 'center', padding: '60px 0'}}>
                        <p>Зареждане на специалитети...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (promos.length === 0) {
        return null;
    }

    return (
        <>
            <div className={styles.specialtiesSlider}>
                <div className="container">
                    {/* Debug helper (само в dev) - показва дали реално имаме данни */}
                    {process.env.NODE_ENV !== 'production' && (
                        <div style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            zIndex: 50,
                            background: 'rgba(0,0,0,0.65)',
                            color: 'white',
                            padding: '6px 10px',
                            fontSize: 12,
                            borderRadius: 8,
                            pointerEvents: 'none'
                        }}>
                            promos: {promos.length}
                        </div>
                    )}

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
                        loop={promos.length > 1}
                        className={styles.swiperContainer}
                    >
                        {promos.map((promo, index) => {
                            const titleRaw = typeof promo?.title === 'string' ? promo.title : '';
                            // Нормализира whitespace, маха евентуални <br> тагове ако title идва вече с HTML
                            const title = titleRaw
                                .replace(/<\s*br\s*\/?>/gi, ' ')
                                .replace(/&nbsp;/gi, ' ')
                                .replace(/\u00A0/g, ' ')
                                .replace(/\s+/g, ' ')
                                .trim();
                            const description = typeof promo?.description === 'string' ? promo.description : '';
                            const features = Array.isArray(promo?.features) ? promo.features : [];
                            const buttonLabel = typeof promo?.buttonLabel === 'string' ? promo.buttonLabel : '';
                            const buttonLink = typeof promo?.buttonLink === 'string' ? promo.buttonLink : '';

                            return (
                                <SwiperSlide key={promo._id || `promo-${index}`}>
                                    <div className={styles.slideContent}>
                                        <div className="row align-items-center">
                                            <div className="col-lg-6 order-lg-2">
                                                <div className={styles.textContent}>
                                                    <div className={styles.badge}>
                                                        <i className="fas fa-star"></i>
                                                        <span>Нов Специалитет</span>
                                                    </div>

                                                    <h2 className={styles.title}>
                                                        {title}
                                                    </h2>

                                                    {description && (
                                                        <p className={styles.description}>{description}</p>
                                                    )}

                                                    {/* Features from Sanity */}
                                                    {features.length > 0 && (
                                                        <div className={styles.features}>
                                                            {features.map((feature, featureIndex) => (
                                                                <div className={styles.feature} key={`feature-${index}-${featureIndex}`}>
                                                                    <div className={styles.featureIcon}>
                                                                        <i className={feature?.icon || 'fas fa-star'}></i>
                                                                    </div>
                                                                    <div className={styles.featureContent}>
                                                                        <h6 className={styles.featureTitle}>{feature?.title || ''}</h6>
                                                                        <p className={styles.featureText}>{feature?.text || ''}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <a
                                                        href={buttonLink || '/menu'}
                                                        className={styles.ctaBtn}
                                                    >
                                                        <i className="fas fa-utensils"></i>
                                                        {buttonLabel || 'Вижте менюто'}
                                                    </a>
                                                </div>
                                            </div>

                                            <div className="col-lg-6 order-lg-1">
                                                <div className={styles.imageWrapper}>
                                                    {promo.image && (
                                                        <img
                                                            src={urlFor(promo.image).width(800).height(600).url()}
                                                            alt={title}
                                                            className={styles.slideImage}
                                                            onError={(e) => {
                                                                e.target.src = '/img/bg.jpg';
                                                            }}
                                                        />
                                                    )}
                                                    <div className={styles.imageOverlay}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    <div className={styles.pagination}></div>
                </div>
            </div>
        </>
    );
};

export default NewSpecialtiesCTA;

