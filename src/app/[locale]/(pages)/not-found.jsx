/**
 * 404 Not Found Page
 * 
 * Displays when a page route doesn't exist.
 * Provides helpful navigation options.
 */

import { getLocale } from "next-intl/server";

import { Link } from "@/src/i18n/navigation";
import styles from "./not-found.module.css";
import { getLocaleSurfaceCopy } from "./pageCopy";

export default async function NotFound() {
  const locale = await getLocale();
  const copy = getLocaleSurfaceCopy("notFound", locale);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* 404 Number */}
        <div className={styles.number}>404</div>

        {/* Message */}
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.description}>
          {copy.description}
        </p>

        {/* Navigation options */}
        <div className={styles.actions}>
          <Link href="/" className={styles.btnPrimary}>
            <i className="fas fa-home"></i>
            {copy.home}
          </Link>
          
          <Link href="/menu" className={styles.btnSecondary}>
            <i className="fas fa-utensils"></i>
            {copy.menu}
          </Link>
          
          <Link href="/contact" className={styles.btnSecondary}>
            <i className="fas fa-phone"></i>
            {copy.contact}
          </Link>
        </div>
      </div>
    </div>
  );
}
