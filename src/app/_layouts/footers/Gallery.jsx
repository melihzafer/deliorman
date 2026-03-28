"use client";

import { SliderProps } from "@common/sliderProps";
import { Swiper, SwiperSlide } from "swiper/react";

import { useState, useMemo, useCallback, lazy, Suspense, startTransition, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";

// Lazy load Lightbox - only load when user clicks (reduces initial INP impact)
const Lightbox = lazy(() => import("yet-another-react-lightbox"));

const FooterGalleryModule = ( { items, button, buttonLabel } ) => {
  const t = useTranslations("common");
  const [img, setImg] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const [lightboxReady, setLightboxReady] = useState(false);
  const preloadTriggered = useRef(false);

  // Get Swiper instance and observe parent for preloading
  const handleSwiper = useCallback((swiper) => {
    if (!preloadTriggered.current && swiper.el) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !preloadTriggered.current) {
            preloadTriggered.current = true;
            // Preload during idle time - user won't notice
            if ('requestIdleCallback' in window) {
              requestIdleCallback(() => {
                import("yet-another-react-lightbox");
                import("./lightbox.css");
              }, { timeout: 2000 });
            } else {
              // Fallback for Safari
              setTimeout(() => {
                import("yet-another-react-lightbox");
                import("./lightbox.css");
              }, 100);
            }
          }
        },
        { rootMargin: '200px' }
      );

      observer.observe(swiper.el);
    }
  }, []);

  // Monomorphic: derive slides from props using useMemo (no empty→filled transition)
  const slides = useMemo(() => items.map(item => ({ src: item.image, alt: item.alt })), [items]);

  // Event delegation: immediate preventDefault, use startTransition for non-blocking updates
  const handleGalleryClick = useCallback((e) => {
    const overlay = e.target.closest('.tst-overlay');
    if (overlay) {
      e.preventDefault();
      e.stopPropagation();

      const slide = overlay.closest('.swiper-slide');
      const index = Array.from(slide.parentElement.children).indexOf(slide);

      // Synchronous feedback first
      overlay.style.opacity = '0.7';

      // Use startTransition for non-blocking state updates (reduces INP)
      startTransition(() => {
        setInitialIndex(index);
        setLightboxReady(true);
        setImg(true);
      });

      // Reset opacity after transition starts
      requestAnimationFrame(() => {
        overlay.style.opacity = '';
      });
    }
  }, []);

  return (
    <>
        {/* footer gallery */}
        <Swiper
            {...SliderProps.footerGallerySlider}
            className={`swiper-container tst-footer-gallery tst-cursor-zoom`}
            observer={true}
            observeParents={true}
            onClick={handleGalleryClick}
            onSwiper={handleSwiper}
        >
            {items.map((item, key) => (
            <SwiperSlide key={`footer-gallery-item-${key}`}>
                <div className="tst-footer-gal-item">
                    <img 
                        src={item.image} 
                        alt={item.alt} 
                        loading="lazy"
                        width="300"
                        height="300"
                    />
                    <a
                        data-fancybox="gal"
                        href={item.image}
                        className="tst-overlay"
                        aria-label={
                          item.alt
                            ? t("openZoomedImageWithAlt", { alt: item.alt })
                            : t("openZoomedImage")
                        }
                    >
                        <i className="fas fa-search-plus" aria-hidden="true"></i>
                    </a>
                </div>
            </SwiperSlide>
            ))}
        </Swiper>
        <div className="tst-gallery-nav">
            <Link href={button.link} className="tst-label tst-color tst-anima-link">{buttonLabel || button.label}</Link>
            <div className="tst-fg-nav">
                <button
                    type="button"
                    className="tst-slider-btn tst-fg-prev"
                    aria-label={t("previousPhotos")}
                    style={{ background: 'none', border: 'none', padding: 0 }}
                >
                    <i className="fas fa-arrow-left" aria-hidden="true"></i>
                </button>
                <button
                    type="button"
                    className="tst-slider-btn tst-fg-next"
                    aria-label={t("nextPhotos")}
                    style={{ background: 'none', border: 'none', padding: 0 }}
                >
                    <i className="fas fa-arrow-right" aria-hidden="true"></i>
                </button>
            </div>
        </div>
        {/* Lazy load Lightbox only after first click - prevents INP penalty on initial load */}
        {lightboxReady && (
          <Suspense fallback={null}>
            <Lightbox
                open={img}
                close={() => setImg(false)}
                slides={slides}
                index={initialIndex}
                styles={{ container: { backgroundColor: "rgba(26, 47, 51, .85)" } }}
                controller={{ closeOnBackdropClick: true }}
            />
          </Suspense>
        )}
        {/* footer gallery end */}
    </>
  );
};

export default FooterGalleryModule;
