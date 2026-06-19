"use client";

import Image from "next/image";
import { useState, useMemo, useCallback, lazy, Suspense, startTransition } from "react";
import { useTranslations } from "next-intl";

// Lazy load Lightbox - only load when user clicks (reduces INP)
const Lightbox = lazy(() => import("yet-another-react-lightbox"));

const DecorationGallery = () => {
  const t = useTranslations("components.decorationGallery");
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState(new Set());

  const images = useMemo(
    () => [
      {
        url: "/img/decoration_footage/ukrasa1.webp",
        alt: t("imageAlt", { number: 1 }),
      },
      {
        url: "/img/decoration_footage/ukrasa3.webp",
        alt: t("imageAlt", { number: 2 }),
      },
      {
        url: "/img/decoration_footage/ukrasa2.webp",
        alt: t("imageAlt", { number: 3 }),
      },
      {
        url: "/img/decoration_footage/ukrasa4.webp",
        alt: t("imageAlt", { number: 4 }),
      },
    ],
    [t]
  );

  const lightboxSlides = useMemo(
    () =>
      images.map((img) => ({
        src: img.url,
        alt: img.alt,
      })),
    [images]
  );

  const handleImageClick = useCallback((index) => {
    startTransition(() => {
      setCurrentImageIndex(index);
      setIsOpen(true);
    });
  }, []);

  return (
    <>
      <div className="tst-decoration-gallery tst-mb-60">
        <div className="text-center tst-mb-40">
          <div className="tst-suptitle tst-suptitle-center tst-mb-15" style={{ color: "#f39c12" }}>
            <i className="fas fa-sparkles" style={{ marginRight: "8px" }}></i>
            {t("eyebrow")}
          </div>
          <h3
            style={{
              textAlign: "center",
              marginBottom: "40px",
              color: "#05232B",
              fontWeight: "600",
              fontSize: "32px",
            }}
          >
            {t("title")}
          </h3>
          <p className="tst-text tst-text-lg tst-mb-30">{t("description")}</p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {images.map((image, index) => (
            <button
              type="button"
              key={image.url}
              style={{
                position: "relative",
                display: "block",
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                border: "none",
                background: "none",
                padding: 0,
                textAlign: "inherit",
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
              onFocus={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(243, 156, 18, 0.2)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
              onClick={() => handleImageClick(index)}
              aria-label={`${t("openImageLabel")}: ${image.alt}`}
            >
              {failedImages.has(index) ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, #f39c12, #d4a373)",
                  }}
                >
                  <i
                    className="fas fa-image"
                    style={{ fontSize: "64px", color: "white", opacity: 0.3 }}
                    aria-hidden="true"
                  ></i>
                </div>
              ) : (
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  style={{ objectFit: "cover" }}
                  onError={() =>
                    setFailedImages((prev) => {
                      const next = new Set(prev);
                      next.add(index);
                      return next;
                    })
                  }
                />
              )}

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
                aria-hidden="true"
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
                  <i
                    className="fas fa-search-plus"
                    style={{ fontSize: "20px", color: "#f39c12" }}
                    aria-hidden="true"
                  ></i>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {isOpen && (
        <Suspense fallback={null}>
          <Lightbox
            open={isOpen}
            close={() => setIsOpen(false)}
            slides={lightboxSlides}
            index={currentImageIndex}
            styles={{ container: { backgroundColor: "rgba(26, 47, 51, .85)" } }}
            controller={{ closeOnBackdropClick: true }}
          />
        </Suspense>
      )}
    </>
  );
};

export default DecorationGallery;
