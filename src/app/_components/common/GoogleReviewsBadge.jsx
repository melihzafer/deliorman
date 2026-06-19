"use client";

import Data from "@data/testimonials.json";
import { useTranslations } from "next-intl";
import styles from "./GoogleReviewsBadge.module.scss";

const GoogleReviewsBadge = () => {
  const { rating, totalReviews, url } = Data.google;
  const t = useTranslations("googleReviews");

  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.badge}
      title={t("title")}
    >
      <i className={`fab fa-google ${styles.googleIcon}`}></i>
      <div className={styles.info}>
        <div className={styles.ratingRow}>
          <span className={styles.ratingNumber}>{rating}</span>
          <div className={styles.stars}>
            {Array.from({ length: fullStars }, (_, i) => (
              <i key={`full-${i}`} className="fas fa-star" />
            ))}
            {hasHalf && <i className="fas fa-star-half-alt" />}
          </div>
        </div>
        <span className={styles.reviewCount}>
          {t("reviewCount", { count: totalReviews })}
        </span>
      </div>
    </a>
  );
};

export default GoogleReviewsBadge;
