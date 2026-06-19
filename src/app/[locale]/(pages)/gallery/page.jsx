"use client";

import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import PageBanner from "@components/PageBanner";
import Lightbox from "@components/common/Lightbox";
import styles from "./Gallery.module.scss";

const EMPTY_IMAGE = { src: '', alt: '', category: '' };

const IMAGE_SOURCES = {
  indoor: [
    '/img/indoor_footage/camphoto_1423418003.webp',
    '/img/indoor_footage/IMG_9067.webp',
    '/img/indoor_footage/IMG_9069.webp',
    '/img/indoor_footage/IMG_9071.webp',
    '/img/indoor_footage/IMG_9072.webp',
    '/img/indoor_footage/IMG_9339.webp',
    '/img/indoor_footage/IMG_9341.webp',
    '/img/indoor_footage/IMG_9344.webp',
  ],
  outdoor: [
    '/img/outdoor_footage/IMG_9335.webp',
    '/img/outdoor_footage/IMG_9336.webp',
    '/img/outdoor_footage/IMG_9337.webp',
    '/img/outdoor_footage/IMG_9338.webp',
  ],
  decoration: [
    '/img/decoration_footage/ukrasa1.webp',
    '/img/decoration_footage/ukrasa2.webp',
    '/img/decoration_footage/ukrasa3.webp',
    '/img/decoration_footage/ukrasa4.webp',
    '/img/decoration_footage/ukrasa5.webp',
  ],
};

const Gallery = () => {
  const t = useTranslations("galleryPage");
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(EMPTY_IMAGE);

  const galleryImages = useMemo(
    () => ({
      indoor: IMAGE_SOURCES.indoor.map((src) => ({
        src,
        alt: t("imageAlt.indoor"),
        category: "indoor",
      })),
      outdoor: IMAGE_SOURCES.outdoor.map((src) => ({
        src,
        alt: t("imageAlt.outdoor"),
        category: "outdoor",
      })),
      decoration: IMAGE_SOURCES.decoration.map((src) => ({
        src,
        alt: t("imageAlt.decoration"),
        category: "decoration",
      })),
    }),
    [t]
  );

  const allImages = useMemo(
    () => [...galleryImages.indoor, ...galleryImages.outdoor, ...galleryImages.decoration],
    [galleryImages]
  );

  const filters = useMemo(
    () => [
      { key: "all", label: t("filters.all"), icon: "fa-images", count: allImages.length },
      { key: "indoor", label: t("filters.indoor"), icon: "fa-door-open", count: galleryImages.indoor.length },
      { key: "outdoor", label: t("filters.outdoor"), icon: "fa-tree", count: galleryImages.outdoor.length },
      { key: "decoration", label: t("filters.decoration"), icon: "fa-paint-brush", count: galleryImages.decoration.length },
    ],
    [allImages.length, galleryImages, t]
  );

  const filteredImages = useMemo(() => {
    if (activeFilter === 'all') return allImages;
    return galleryImages[activeFilter] || [];
  }, [activeFilter, allImages, galleryImages]);

  const openLightbox = useCallback((image) => {
    setCurrentImage(image);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setCurrentImage(EMPTY_IMAGE);
  }, []);

  const navigatePrev = useCallback(() => {
    const idx = filteredImages.findIndex(img => img.src === currentImage.src);
    setCurrentImage(filteredImages[(idx - 1 + filteredImages.length) % filteredImages.length]);
  }, [filteredImages, currentImage.src]);

  const navigateNext = useCallback(() => {
    const idx = filteredImages.findIndex(img => img.src === currentImage.src);
    setCurrentImage(filteredImages[(idx + 1) % filteredImages.length]);
  }, [filteredImages, currentImage.src]);

  const currentIndex = lightboxOpen
    ? filteredImages.findIndex(img => img.src === currentImage.src)
    : -1;

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner
          pageTitle={t("pageTitle")}
          description={t("pageDescription")}
          breadTitle={t("breadTitle")}
        />
      </div>

      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">

              {/* Intro */}
              <div className="row justify-content-center tst-mb-60">
                <div className="col-lg-8">
                  <div className="text-center">
                    <div className={`tst-suptitle tst-suptitle-center tst-mb-15 ${styles.suptitle}`}>
                      <i className={`fas fa-camera ${styles.suptitleIcon}`}></i>
                      {t("introSuptitle")}
                    </div>
                    <h3 className="tst-mb-30">{t("introTitle")}</h3>
                    <p className="tst-text tst-text-lg">
                      {t("introDescription")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="row justify-content-center tst-mb-60">
                <div className="col-lg-10">
                  <div className={styles.filterBar}>
                    {filters.map((filter) => (
                      <button
                        key={filter.key}
                        type="button"
                        onClick={() => setActiveFilter(filter.key)}
                        className={`${styles.filterBtn} ${activeFilter === filter.key ? styles.active : ''}`}
                        aria-pressed={activeFilter === filter.key}
                        aria-label={t("showCategory", { category: filter.label })}
                      >
                        <i className={`fas ${filter.icon}`}></i>
                        {filter.label}
                        <span className={styles.badge}>{filter.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Masonry Gallery Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter}
                  className={styles.masonryGrid}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredImages.map((image, index) => (
                    <button
                      type="button"
                      className={styles.masonryItem}
                      key={`${image.category}-${index}`}
                      onClick={() => openLightbox(image)}
                      aria-label={image.alt ? t("openImageLabel", { image: image.alt }) : t("openImageFallback")}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={600}
                        height={0}
                        sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 33vw"
                        style={{ width: '100%', height: 'auto' }}
                        loading="lazy"
                      />
                      <div className={styles.overlay}>
                        <i className="fas fa-search-plus" aria-hidden="true"></i>
                      </div>
                    </button>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Empty state */}
              {filteredImages.length === 0 && (
                <div className="row">
                  <div className="col-12">
                    <div className="text-center tst-p-60-60">
                      <i className={`fas fa-images ${styles.noResultsIcon}`}></i>
                      <h5 className={styles.noResultsHeading}>{t("noResults")}</h5>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        src={currentImage.src}
        alt={currentImage.alt}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onPrev={filteredImages.length > 1 ? navigatePrev : undefined}
        onNext={filteredImages.length > 1 ? navigateNext : undefined}
        counter={currentIndex >= 0 ? `${currentIndex + 1} / ${filteredImages.length}` : undefined}
        dialogAriaLabel={currentImage.alt ? t("dialogLabel", { image: currentImage.alt }) : t("dialogLabelFallback")}
        dialogFallbackLabel={t("dialogLabelFallback")}
        closeButtonLabel={t("closeImage")}
        previousButtonLabel={t("previousImage")}
        nextButtonLabel={t("nextImage")}
        imageAltFallback={t("openImageFallback")}
      />
    </>
  );
};

export default Gallery;
