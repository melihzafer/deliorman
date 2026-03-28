"use client";

/**
 * Error Boundary Component
 * 
 * Catches errors in the page tree and displays a user-friendly message.
 * Provides a retry button to attempt recovery.
 */

import { useEffect } from "react";
import { useLocale } from "next-intl";

import { Link } from "@/src/i18n/navigation";
import styles from "./error.module.css";
import { getLocaleSurfaceCopy } from "./pageCopy";

export default function Error({ error, reset }) {
  const locale = useLocale();
  const copy = getLocaleSurfaceCopy("error", locale);

  useEffect(() => {
    // Log error to console in development
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className={styles.container} role="alert">
      <div className={styles.content}>
        {/* Error icon */}
        <div className={styles.icon}>
          <i className="fas fa-exclamation-triangle"></i>
        </div>

        {/* Error message */}
        <h2 className={styles.title}>{copy.title}</h2>
        <p className={styles.description}>
          {copy.description}
          <br />
          {copy.hint}
        </p>

        {/* Action buttons */}
        <div className={styles.actions}>
          <button 
            onClick={() => reset()} 
            className={styles.btnPrimary}
            type="button"
          >
            <i className="fas fa-redo"></i>
            {copy.retry}
          </button>
          
          <Link href="/" className={styles.btnSecondary}>
            <i className="fas fa-home"></i>
            {copy.home}
          </Link>
        </div>
      </div>
    </div>
  );
}
