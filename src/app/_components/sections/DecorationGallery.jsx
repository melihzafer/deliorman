"use client";

import { useState, useMemo } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const DecorationGallery = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Decoration images from decoration_footage folder
  const images = useMemo(() => [
    { url: "/img/decoration_footage/ukrasa1.webp", alt: "Украса за събития" },
    { url: "/img/decoration_footage/ukrasa3.webp", alt: "Декорация за специални дни" },
    { url: "/img/decoration_footage/ukrasa2.webp", alt: "Красива украса" },
    { url: "/img/decoration_footage/ukrasa4.webp", alt: "Украса и дизайн" },
    // { url: "/img/decoration_footage/ukrasa5.webp", alt: "Декоративни елементи" },
  ], []);

  const lightboxSlides = images.map((img) => ({
    src: img.url,
    alt: img.alt,
  }));

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    setIsOpen(true);
  };

  return (
    <>
      {/* Decoration Gallery Section */}
      <div className="tst-decoration-gallery tst-mb-60">
        <div className="text-center tst-mb-40">
          <div className="tst-suptitle tst-suptitle-center tst-mb-15" style={{ color: "#f39c12" }}>
            <i className="fas fa-sparkles" style={{ marginRight: "8px" }}></i>
            Украса и дизайн
          </div>
                            <h3 style={{ textAlign: 'center', marginBottom: '40px', color: '#05232B', fontWeight: '600', fontSize: '32px' }}>
                    Украсата е от нас!</h3>
          <p className="tst-text tst-text-lg tst-mb-30">
            Всяко събитие заслужава прекрасна украса. Преглеждайте нашите дизайни и се вдъхновете!
          </p>
        </div>

        {/* Gallery Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}>
          {images.map((image, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                height: "280px",
                backgroundColor: "#f8f9fa",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(243, 156, 18, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
              onClick={() => handleImageClick(index)}
            >
              <img
                src={image.url}
                alt={image.alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: linear-gradient(135deg, #f39c12, #d4a373);">
                      <i class="fas fa-image" style="font-size: 64px; color: white; opacity: 0.3;"></i>
                    </div>
                  `;
                }}
              />

              {/* Hover Overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(243, 156, 18, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0";
                }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <i className="fas fa-search-plus" style={{ fontSize: "20px", color: "#f39c12" }}></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={lightboxSlides}
        index={currentImageIndex}
        styles={{ container: { backgroundColor: "rgba(26, 47, 51, .85)" } }}
        render={{
          buttonPrev: currentImageIndex <= 0 ? () => null : undefined,
          buttonNext: currentImageIndex >= images.length - 1 ? () => null : undefined,
        }}
      />
    </>
  );
};

export default DecorationGallery;
