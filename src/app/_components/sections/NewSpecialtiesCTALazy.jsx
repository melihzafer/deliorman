"use client";

import dynamic from "next/dynamic";
import ViewportLoader from "@components/common/ViewportLoader";
import styles from "../../_styles/scss/NewSpecialtiesCTA.module.scss";

/**
 * Skeleton placeholder matching the component's layout
 * Displayed while component is loading or not yet in viewport
 */
const SwiperSkeleton = () => (
  <div className={styles.specialtiesSlider}>
    <div className="container">
      <div className={styles.slideContent} style={{ minHeight: "400px" }}>
        <div className="row align-items-center">
          <div className="col-lg-6 order-lg-2">
            <div className={styles.textContent}>
              {/* Skeleton badge */}
              <div
                style={{
                  width: "180px",
                  height: "40px",
                  background: "rgba(243, 156, 18, 0.15)",
                  borderRadius: "50px",
                  marginBottom: "20px",
                }}
              />
              {/* Skeleton title */}
              <div
                style={{
                  width: "80%",
                  height: "48px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  marginBottom: "25px",
                }}
              />
              {/* Skeleton description */}
              <div
                style={{
                  width: "90%",
                  height: "80px",
                  background: "rgba(255, 255, 255, 0.08)",
                  borderRadius: "8px",
                  marginBottom: "35px",
                }}
              />
              {/* Skeleton features */}
              <div style={{ marginBottom: "40px" }}>
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "15px",
                      padding: "15px",
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "12px",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        background: "rgba(243, 156, 18, 0.2)",
                        borderRadius: "12px",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          width: "60%",
                          height: "16px",
                          background: "rgba(255, 255, 255, 0.1)",
                          borderRadius: "4px",
                          marginBottom: "8px",
                        }}
                      />
                      <div
                        style={{
                          width: "80%",
                          height: "14px",
                          background: "rgba(255, 255, 255, 0.05)",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* Skeleton CTA button */}
              <div
                style={{
                  width: "200px",
                  height: "56px",
                  background: "rgba(243, 156, 18, 0.3)",
                  borderRadius: "50px",
                }}
              />
            </div>
          </div>
          <div className="col-lg-6 order-lg-1">
            {/* Skeleton image */}
            <div
              style={{
                width: "100%",
                paddingBottom: "75%",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "20px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Dynamic import with SSR disabled to prevent hydration blocking
 * The Swiper component is heavy and should not block the main thread
 */
const NewSpecialtiesCTA = dynamic(
  () => import("./NewSpecialtiesCTA"),
  {
    ssr: false,
    loading: () => <SwiperSkeleton />,
  }
);

/**
 * NewSpecialtiesCTALazy - Viewport-aware lazy loading wrapper
 * Only loads the heavy Swiper component when it enters the viewport
 */
const NewSpecialtiesCTALazy = () => (
  <ViewportLoader
    fallback={<SwiperSkeleton />}
    rootMargin="300px"
  >
    <NewSpecialtiesCTA />
  </ViewportLoader>
);

export default NewSpecialtiesCTALazy;
