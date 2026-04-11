"use client";

import { useRef, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { getLocalizedTestimonialsData } from "@data/getLocalizedTestimonialsData";
import AnimateOnScroll from "@components/common/AnimateOnScroll";
import styles from "./Testimonials.module.scss";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <i
        key={i}
        className={`fas fa-star ${i <= rating ? styles.starFilled : styles.starEmpty}`}
      />
    );
  }
  return <div className={styles.stars}>{stars}</div>;
};

const Testimonials = () => {
  const locale = useLocale();
  const t = useTranslations('components.testimonials');
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const localizedData = useMemo(() => getLocalizedTestimonialsData(locale), [locale]);

  const handleSwiper = (swiper) => {
    if (swiper.params.navigation && prevRef.current && nextRef.current) {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation.init();
      swiper.navigation.update();
    }
  };

  return (
    <div className={styles.testimonials}>
      <AnimateOnScroll initialVisible={true}>
        <div className={styles.header}>
          <div className="tst-suptitle tst-suptitle-center tst-mb-15">
            {localizedData.subtitle}
          </div>
          <h3 className="tst-mb-30" dangerouslySetInnerHTML={{ __html: localizedData.title }} />
          <p className="tst-text">{localizedData.description}</p>
        </div>
      </AnimateOnScroll>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={3}
        spaceBetween={30}
        centeredSlides={true}
        loop={true}
        speed={800}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        pagination={{
          clickable: true,
          el: `.${styles.pagination}`,
        }}
        onSwiper={handleSwiper}
        breakpoints={{
          992: { slidesPerView: 3 },
          768: { slidesPerView: 2, centeredSlides: false },
          0: { slidesPerView: 1 },
        }}
        className={styles.swiperContainer}
        aria-roledescription="carousel"
        aria-label={t('title')}
      >
        {localizedData.items.map((item, key) => (
          <SwiperSlide key={`testimonial-${key}`}>
            <div className={styles.card}>
              <div className={styles.quoteIcon}>&ldquo;</div>
              <StarRating rating={item.rating} />
              <p className={styles.reviewText}>{item.text}</p>
              <div className={styles.cardFooter}>
                <span className={styles.authorName}>{item.name}</span>
                <span className={styles.date}>{item.date}</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.navigation}>
        <button
          ref={prevRef}
          className={styles.navBtn}
          aria-label={t('previousReview')}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className={styles.pagination}></div>
        <button
          ref={nextRef}
          className={styles.navBtn}
          aria-label={t('nextReview')}
        >
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Testimonials;
