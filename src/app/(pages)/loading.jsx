/**
 * Loading State Component
 * 
 * Displays during page transitions to provide visual feedback.
 * Uses CSS-only animations for optimal performance.
 */

import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.container} role="status" aria-label="Зареждане">
      <div className={styles.content}>
        {/* Animated spinner */}
        <div className={styles.spinner}>
          <div className={styles.ring}></div>
          <div className={`${styles.ring} ${styles.ring2}`}></div>
          <div className={`${styles.ring} ${styles.ring3}`}></div>
        </div>
        
        {/* Loading text */}
        <p className={styles.text}>Зареждане...</p>
      </div>
    </div>
  );
}
