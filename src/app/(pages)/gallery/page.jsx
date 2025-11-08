"use client";

import React, { useState, useMemo } from "react";
import PageBanner from "@components/PageBanner";

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

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
      { src: '/img/outdoor_footage/IMG_9338.webp', alt: 'Външен вид на ресторант', category: 'outdoor' },
      { src: '/img/outdoor_footage/IMG_9076.webp', alt: 'Външен вид на ресторант', category: 'outdoor' },
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

  const openLightbox = (image) => {
    setCurrentImage(image);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction) => {
    const currentIndex = filteredImages.findIndex(img => img.src === currentImage.src);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredImages.length;
    } else {
      newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    }
    
    setCurrentImage(filteredImages[newIndex]);
  };

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
                    <div className="tst-suptitle tst-suptitle-center tst-mb-15" style={{color: '#f39c12'}}>
                      <i className="fas fa-camera" style={{marginRight: '8px'}}></i>
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
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '15px',
                    justifyContent: 'center'
                  }}>
                    {filters.map((filter) => (
                      <button
                        key={filter.key}
                        onClick={() => setActiveFilter(filter.key)}
                        style={{
                          padding: '12px 30px',
                          backgroundColor: activeFilter === filter.key ? '#05232B' : '#f8f9fa',
                          color: activeFilter === filter.key ? 'white' : '#05232B',
                          border: `2px solid ${activeFilter === filter.key ? '#05232B' : '#e8e8e8'}`,
                          borderRadius: '8px',
                          fontSize: '15px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                          if (activeFilter !== filter.key) {
                            e.target.style.backgroundColor = '#05232B';
                            e.target.style.color = 'white';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeFilter !== filter.key) {
                            e.target.style.backgroundColor = '#f8f9fa';
                            e.target.style.color = '#05232B';
                          }
                        }}
                      >
                        <i className={`fas ${filter.icon}`}></i>
                        {filter.label}
                        <span style={{
                          backgroundColor: activeFilter === filter.key ? '#f39c12' : '#05232B',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
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
                    className="col-lg-4 col-md-6 tst-mb-30" 
                    key={`${image.category}-${index}`}
                    style={{
                      animation: 'fadeIn 0.5s ease-in-out'
                    }}
                  >
                    <div 
                      onClick={() => openLightbox(image)}
                      style={{
                        position: 'relative',
                        paddingBottom: '75%',
                        overflow: 'hidden',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                      }}
                    >
                      <img 
                        src={image.src}
                        alt={image.alt}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        loading="lazy"
                      />
                      {/* Overlay */}
                      <div style={{
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
                      }}
                      className="gallery-overlay"
                      >
                        <i 
                          className="fas fa-search-plus gallery-icon" 
                          style={{
                            fontSize: '32px',
                            color: 'white',
                            opacity: 0,
                            transition: 'opacity 0.3s ease'
                          }}
                        ></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* No results message */}
              {filteredImages.length === 0 && (
                <div className="row">
                  <div className="col-12">
                    <div className="text-center tst-p-60-60">
                      <i className="fas fa-images" style={{fontSize: '64px', color: '#e8e8e8', marginBottom: '20px'}}></i>
                      <h5 style={{color: '#04161B'}}>Няма снимки в тази категория</h5>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && currentImage && (
        <div 
          onClick={closeLightbox}
          style={{
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
          }}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
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
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          >
            <i className="fas fa-times"></i>
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('prev');
            }}
            style={{
              position: 'absolute',
              left: '20px',
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
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('next');
            }}
            style={{
              position: 'absolute',
              right: '20px',
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
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          >
            <i className="fas fa-chevron-right"></i>
          </button>

          {/* Image */}
          <img 
            src={currentImage.src}
            alt={currentImage.alt}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90%',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '8px'
            }}
          />

          {/* Image Counter */}
          <div style={{
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
          }}>
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
        
        .gallery-overlay:hover {
          background-color: rgba(0,0,0,0.5) !important;
        }
        
        .gallery-overlay:hover .gallery-icon {
          opacity: 1 !important;
        }
      `}</style>
    </>
  );
};

export default Gallery;
