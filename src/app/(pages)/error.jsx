"use client";

/**
 * Error Boundary Component
 * 
 * Catches errors in the page tree and displays a user-friendly message.
 * Provides a retry button to attempt recovery.
 */

import { useEffect } from "react";
import Link from "next/link";
import styles from "./error.module.css";

export default function Error({ error, reset }) {
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
        <h2 className={styles.title}>Нещо се обърка</h2>
        <p className={styles.description}>
          Съжаляваме, възникна проблем при зареждането на страницата.
          <br />
          Моля, опитайте отново или се върнете към началната страница.
        </p>

        {/* Action buttons */}
        <div className={styles.actions}>
          <button 
            onClick={() => reset()} 
            className={styles.btnPrimary}
            type="button"
          >
            <i className="fas fa-redo"></i>
            Опитай отново
          </button>
          
          <Link href="/" className={styles.btnSecondary}>
            <i className="fas fa-home"></i>
            Към началото
          </Link>
        </div>
      </div>
    </div>
  );
}
