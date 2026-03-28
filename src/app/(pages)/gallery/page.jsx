"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import PageBanner from "@components/PageBanner";

// ==========================================
// EXTRACTED STYLES - Module-scoped constants
// Prevents V8 de-optimization from per-render object allocation
// ==========================================

/** @type {React.CSSProperties} */
const EMPTY_IMAGE = { src: '', alt: '', category: '' };

/** @type {React.CSSProperties} */
const STYLE_FILTER_CONTAINER = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '15px',
  justifyContent: 'center'
};

/** @type {React.CSSProperties} */
const STYLE_FILTER_BTN_BASE = {
  padding: '12px 30px',
  border: '2px solid #e8e8e8',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

/** @type {React.CSSProperties} */
const STYLE_FILTER_BTN_ACTIVE = {
  ...STYLE_FILTER_BTN_BASE,
  backgroundColor: '#05232B',
  color: 'white',
  border: '2px solid #05232B'
};

/** @type {React.CSSProperties} */
const STYLE_FILTER_BTN_INACTIVE = {
  ...STYLE_FILTER_BTN_BASE,
  backgroundColor: '#f8f9fa',
  color: '#05232B',
  border: '2px solid #e8e8e8'
};

/** @type {React.CSSProperties} */
const STYLE_BADGE_ACTIVE = {
  backgroundColor: '#f39c12',
  color: 'white',
  padding: '2px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 'bold'
};

/** @type {React.CSSProperties} */
const STYLE_BADGE_INACTIVE = {
  backgroundColor: '#05232B',
  color: 'white',
  padding: '2px 8px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 'bold'
};

/** @type {React.CSSProperties} */
const STYLE_GALLERY_ITEM = {
  position: 'relative',
  display: 'block',
  width: '100%',
  padding: 0,
  aspectRatio: '4 / 3',
  minHeight: '280px',
  overflow: 'hidden',
  borderRadius: '12px',
  border: 'none',
  background: 'transparent',
  textAlign: 'inherit',
  cursor: 'pointer',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
};

/** @type {React.CSSProperties} */
const STYLE_GALLERY_OVERLAY = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.3s ease',
  pointerEvents: 'none'
};

/** @type {React.CSSProperties} */
const STYLE_GALLERY_ICON = {
  fontSize: '32px',
  color: 'white',
  opacity: 0,
  transition: 'opacity 0.3s ease'
};

/** @type {React.CSSProperties} */
const STYLE_LIGHTBOX_BACKDROP = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.95)',
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px'
};

/** @type {React.CSSProperties} */
const STYLE_LIGHTBOX_BTN = {
  width: '50px',
  height: '50px',
  backgroundColor: 'rgba(255,255,255,0.1)',
  border: '2px solid white',
  borderRadius: '50%',
  color: 'white',
  fontSize: '24px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  zIndex: 10001
};

/** @type {React.CSSProperties} */
const STYLE_LIGHTBOX_CLOSE = {
  ...STYLE_LIGHTBOX_BTN,
  position: 'absolute',
  top: '20px',
  right: '20px'
};

/** @type {React.CSSProperties} */
const STYLE_LIGHTBOX_PREV = {
  ...STYLE_LIGHTBOX_BTN,
  position: 'absolute',
  left: '20px'
};

/** @type {React.CSSProperties} */
const STYLE_LIGHTBOX_NEXT = {
  ...STYLE_LIGHTBOX_BTN,
  position: 'absolute',
  right: '20px'
};

/** @type {React.CSSProperties} */
const STYLE_LIGHTBOX_IMAGE_CONTAINER = {
  position: 'relative',
  width: '90vw',
  height: '80vh',
  maxWidth: '1200px'
};

/** @type {React.CSSProperties} */
const STYLE_LIGHTBOX_IMAGE = {
  objectFit: 'contain',
  borderRadius: '8px'
};

/** @type {React.CSSProperties} */
const STYLE_LIGHTBOX_COUNTER = {
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(255,255,255,0.1)',
  padding: '10px 20px',
  borderRadius: '20px',
  color: 'white',
  fontSize: '14px',
  fontWeight: '600'
};

/** @type {React.CSSProperties} */
const STYLE_NO_RESULTS_ICON = {
  fontSize: '64px',
  color: '#e8e8e8',
  marginBottom: '20px'
};

/** @type {React.CSSProperties} */
const STYLE_NO_RESULTS_HEADING = {
  color: '#04161B'
};

/** @type {React.CSSProperties} */
const STYLE_SUPTITLE = {
  color: '#f39c12'
};

/** @type {React.CSSProperties} */
const STYLE_SUPTITLE_ICON = {
  marginRight: '8px'
};

// ==========================================
// COMPONENT
// ==========================================

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  // Monomorphic: always same shape, never null
  const [currentImage, setCurrentImage] = useState(EMPTY_IMAGE);
  const closeButtonRef = useRef(null);
  const triggerButtonRef = useRef(null);

  // Gallery images organized by category
  const galleryImages = useMemo(() => ({
    indoor: [
      { src: '/img/indoor_footage/camphoto_1423418003.webp', alt: 'Интериор на ресторант', category: 'indoor' },
      { src: '/img/indoor_footage/IMG_9067.webp', alt: 'Интериор на ресторант', category: 'indoor' },
      { src: '/img/indoor_footage/IMG_9069.webp', alt: 'Интериор на ресторант', category: 'indoor' },
      { src: '/img/indoor_footage/IMG_9071.webp', alt: 'Интериор на ресторант', category: 'indoor' },
      { src: '/img/indoor_footage/IMG_9072.webp', alt: 'Интериор на ресторант', category: 'indoor' },
      { src: '/img/indoor_footage/IMG_9339.webp', alt: 'Интериор на ресторант', category: 'indoor' },
      { src: '/img/indoor_footage/IMG_9341.webp', alt: 'Интериор на ресторант', category: 'indoor' },
      { src: '/img/indoor_footage/IMG_9344.webp', alt: 'Интериор на ресторант', category: 'indoor' },
    ],
    outdoor: [
      { src: '/img/outdoor_footage/IMG_9335.webp', alt: 'Външен вид на ресторант', category: 'outdoor' },
      { src: '/img/outdoor_footage/IMG_9336.webp', alt: 'Външен вид на ресторант', category: 'outdoor' },
      { src: '/img/outdoor_footage/IMG_9337.webp', alt: 'Външен вид на ресторант', category: 'outdoor' },
      { src: '/img/outdoor_footage/IMG_9338.webp', alt: 'Външен вид на ресторант', category: 'outdoor' }
    ],
    decoration: [
      { src: '/img/decoration_footage/ukrasa1.webp', alt: 'Декорация за специални събития', category: 'decoration' },
      { src: '/img/decoration_footage/ukrasa2.webp', alt: 'Декорация за специални събития', category: 'decoration' },
      { src: '/img/decoration_footage/ukrasa3.webp', alt: 'Декорация за специални събития', category: 'decoration' },
      { src: '/img/decoration_footage/ukrasa4.webp', alt: 'Декорация за специални събития', category: 'decoration' },
      { src: '/img/decoration_footage/ukrasa5.webp', alt: 'Декорация за специални събития', category: 'decoration' },
    ]
  }), []);

  // Flatten all images for 'all' filter
  const allImages = useMemo(() => {
    return [...galleryImages.indoor, ...galleryImages.outdoor, ...galleryImages.decoration];
  }, [galleryImages]);

  // Get filtered images based on active filter
  const filteredImages = useMemo(() => {
    if (activeFilter === 'all') return allImages;
    return galleryImages[activeFilter] || [];
  }, [activeFilter, allImages, galleryImages]);

  const openLightbox = useCallback((image, triggerButton) => {
    triggerButtonRef.current = triggerButton || document.activeElement;
    setCurrentImage(image);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    const triggerButton = triggerButtonRef.current;

    setLightboxOpen(false);
    // Reset to empty shape, not null (maintains monomorphism)
    setCurrentImage(EMPTY_IMAGE);
    document.body.style.overflow = 'auto';

    if (triggerButton && typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        triggerButton.focus?.();
      });
    }
  }, []);

  const navigateImage = useCallback((direction) => {
    const currentIndex = filteredImages.findIndex(img => img.src === currentImage.src);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredImages.length;
    } else {
      newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    }
    
    setCurrentImage(filteredImages[newIndex]);
  }, [filteredImages, currentImage.src]);

  useEffect(() => {
    if (!lightboxOpen) return undefined;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLightbox();
        return;
      }

      if (!filteredImages.length) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigateImage('prev');
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigateImage('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, filteredImages.length, navigateImage, closeLightbox]);

  // Memoized event handlers to prevent per-render function allocation
  const handleGalleryItemHoverEnter = useCallback((e) => {
    e.currentTarget.style.transform = 'translateY(-5px)';
    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
  }, []);

  const handleGalleryItemHoverLeave = useCallback((e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
  }, []);

  const handleLightboxBtnHoverEnter = useCallback((e) => {
    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
  }, []);

  const handleLightboxBtnHoverLeave = useCallback((e) => {
    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
  }, []);

  const handleNavigatePrev = useCallback((e) => {
    e.stopPropagation();
    navigateImage('prev');
  }, [navigateImage]);

  const handleNavigateNext = useCallback((e) => {
    e.stopPropagation();
    navigateImage('next');
  }, [navigateImage]);

  const filters = [
    { key: 'all', label: 'Всички', icon: 'fa-images' },
    { key: 'indoor', label: 'Интериор', icon: 'fa-door-open' },
    { key: 'outdoor', label: 'Екстериор', icon: 'fa-tree' },
    { key: 'decoration', label: 'Декорация', icon: 'fa-paint-brush' },
  ];

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner 
          pageTitle={"Галерия"} 
          description={"Разгледайте нашия ресторант и атмосфера"} 
          breadTitle={"Галерия"} 
        />
      </div>
      
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              
              {/* Intro Section */}
              <div className="row justify-content-center tst-mb-60">
                <div className="col-lg-8">
                  <div className="text-center">
                    <div className="tst-suptitle tst-suptitle-center tst-mb-15" style={STYLE_SUPTITLE}>
                      <i className="fas fa-camera" style={STYLE_SUPTITLE_ICON}></i>
                      Нашите пространства
                    </div>
                    <h3 className="tst-mb-30">Открийте атмосферата на Делиорман</h3>
                    <p className="tst-text tst-text-lg">
                      Разгледайте нашия уютен интериор, красива външна градина и специални декорации за вашите празненства
                    </p>
                  </div>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="row justify-content-center tst-mb-60">
                <div className="col-lg-8">
                  <div style={STYLE_FILTER_CONTAINER}>
                    {filters.map((filter) => (
                      <button
                        key={filter.key}
                        onClick={() => setActiveFilter(filter.key)}
                        style={activeFilter === filter.key ? STYLE_FILTER_BTN_ACTIVE : STYLE_FILTER_BTN_INACTIVE}
                        className="gallery-filter-btn"
                      >
                        <i className={`fas ${filter.icon}`}></i>
                        {filter.label}
                        <span style={activeFilter === filter.key ? STYLE_BADGE_ACTIVE : STYLE_BADGE_INACTIVE}>
                          {filter.key === 'all' ? allImages.length : galleryImages[filter.key]?.length || 0}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="row">
                {filteredImages.map((image, index) => (
                  <div 
                    className="col-lg-4 col-md-6 tst-mb-30 gallery-fade-in" 
                    key={`${image.category}-${index}`}
                  >
                    <button
                      type="button"
                      className="gallery-trigger"
                      onClick={(event) => openLightbox(image, event.currentTarget)}
                      style={STYLE_GALLERY_ITEM}
                      onMouseEnter={handleGalleryItemHoverEnter}
                      onMouseLeave={handleGalleryItemHoverLeave}
                      aria-label={image.alt ? `Отвори изображение: ${image.alt}` : 'Отвори изображение в галерията'}
                    >
                      <Image 
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="gallery-image"
                        style={{ objectFit: 'cover' }}
                        loading="lazy"
                      />
                      {/* Overlay */}
                      <div style={STYLE_GALLERY_OVERLAY} className="gallery-overlay">
                        <i 
                          className="fas fa-search-plus gallery-icon" 
                          style={STYLE_GALLERY_ICON}
                          aria-hidden="true"
                        ></i>
                      </div>
                    </button>
                  </div>
                ))}
              </div>

              {/* No results message */}
              {filteredImages.length === 0 && (
                <div className="row">
                  <div className="col-12">
                    <div className="text-center tst-p-60-60">
                      <i className="fas fa-images" style={STYLE_NO_RESULTS_ICON}></i>
                      <h5 style={STYLE_NO_RESULTS_HEADING}>Няма снимки в тази категория</h5>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && currentImage.src && (
        <div 
          onClick={closeLightbox}
          style={STYLE_LIGHTBOX_BACKDROP}
          role="dialog"
          aria-modal="true"
          aria-label={currentImage.alt ? `Преглед на изображение: ${currentImage.alt}` : 'Преглед на изображение'}
        >
          {/* Close Button */}
          <button
            type="button"
            ref={closeButtonRef}
            onClick={closeLightbox}
            style={STYLE_LIGHTBOX_CLOSE}
            className="gallery-lightbox-btn"
            onMouseEnter={handleLightboxBtnHoverEnter}
            onMouseLeave={handleLightboxBtnHoverLeave}
            aria-label="Затвори изображението"
          >
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>

          {/* Previous Button */}
          <button
            type="button"
            onClick={handleNavigatePrev}
            style={STYLE_LIGHTBOX_PREV}
            className="gallery-lightbox-btn"
            onMouseEnter={handleLightboxBtnHoverEnter}
            onMouseLeave={handleLightboxBtnHoverLeave}
            aria-label="Покажи предишното изображение"
          >
            <i className="fas fa-chevron-left" aria-hidden="true"></i>
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNavigateNext}
            style={STYLE_LIGHTBOX_NEXT}
            className="gallery-lightbox-btn"
            onMouseEnter={handleLightboxBtnHoverEnter}
            onMouseLeave={handleLightboxBtnHoverLeave}
            aria-label="Покажи следващото изображение"
          >
            <i className="fas fa-chevron-right" aria-hidden="true"></i>
          </button>

          {/* Image */}
          <div 
            onClick={(e) => e.stopPropagation()}
            style={STYLE_LIGHTBOX_IMAGE_CONTAINER}
          >
            <Image 
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              sizes="90vw"
              style={STYLE_LIGHTBOX_IMAGE}
              priority
            />
          </div>

          {/* Image Counter */}
          <div style={STYLE_LIGHTBOX_COUNTER} aria-live="polite">
            {filteredImages.findIndex(img => img.src === currentImage.src) + 1} / {filteredImages.length}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .gallery-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        .gallery-trigger:hover .gallery-overlay,
        .gallery-trigger:focus-visible .gallery-overlay {
          background-color: rgba(0,0,0,0.5) !important;
        }
        
        .gallery-trigger:hover .gallery-icon,
        .gallery-trigger:focus-visible .gallery-icon {
          opacity: 1 !important;
        }

        .gallery-lightbox-btn:hover,
        .gallery-lightbox-btn:focus-visible {
          background-color: rgba(255,255,255,0.2) !important;
        }

        .gallery-lightbox-btn:focus-visible {
          outline-offset: 4px;
        }
        
        .gallery-filter-btn:hover {
          background-color: #05232B !important;
          color: white !important;
        }
      `}</style>
    </>
  );
};

export default Gallery;
