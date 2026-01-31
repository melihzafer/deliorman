/**
 * 404 Not Found Page
 * 
 * Displays when a page route doesn't exist.
 * Provides helpful navigation options.
 */

import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* 404 Number */}
        <div className={styles.number}>404</div>

        {/* Message */}
        <h1 className={styles.title}>Страницата не е намерена</h1>
        <p className={styles.description}>
          Страницата, която търсите, не съществува или е била преместена.
        </p>

        {/* Navigation options */}
        <div className={styles.actions}>
          <Link href="/" className={styles.btnPrimary}>
            <i className="fas fa-home"></i>
            Към началото
          </Link>
          
          <Link href="/menu" className={styles.btnSecondary}>
            <i className="fas fa-utensils"></i>
            Виж менюто
          </Link>
          
          <Link href="/contact" className={styles.btnSecondary}>
            <i className="fas fa-phone"></i>
            Контакти
          </Link>
        </div>
      </div>
    </div>
  );
}
