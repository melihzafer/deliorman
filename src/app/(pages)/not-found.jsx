import { getLocale } from "next-intl/server";

import { Link } from "@/src/i18n/navigation";
import { getLocaleSurfaceCopy } from "@/src/app/[locale]/(pages)/pageCopy";
import styles from "./not-found.module.css";

export default async function NotFound() {
  const locale = await getLocale();
  const copy = getLocaleSurfaceCopy("notFound", locale);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.number}>404</div>

        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.description}>
          {copy.description}
        </p>

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
