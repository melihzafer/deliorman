import Image from "next/image";

import { heroImages } from "../_lib/menuCategoryImages";
import { formatDate, getEditionLabel } from "./masaMenuUtils";
import { t } from "./masaTranslations";
import type { Locale, MasaStyles } from "./masaTypes";

interface MasaMastheadProps {
  locale: Locale;
  menuOpen: boolean;
  now: Date;
  onOpenMenu: () => void;
  styles: MasaStyles;
  tableId: string;
}

export function MasaMasthead({ locale, menuOpen, now, onOpenMenu, styles, tableId }: MasaMastheadProps) {
  return (
    <header className={styles.masthead}>
      <div className={styles.mastheadTop}>
        <span className={styles.mastheadMenuCluster}>
          <button
            type="button"
            className={styles.mastheadMenuButton}
            aria-label={t(locale, "openMenu")}
            aria-expanded={menuOpen}
            onClick={onOpenMenu}
          >
            <span />
            <span />
            <span />
          </button>
          <span className={styles.edition}>
            {t(locale, "issueVolumeLabel")} {tableId || "—"}
          </span>
        </span>
        <span className={styles.edition}>{getEditionLabel(now, locale)}</span>
        <span className={styles.priceTag}>{t(locale, "dailyEdition")}</span>
      </div>

      <h1 className={`${styles.title} ${styles.logoTitle}`}>
        <span className={styles.logoStamp}>
          <Image
            src="/img/deliorman_colorized_logo.svg"
            alt="Делиорман"
            width={240}
            height={240}
            className={styles.brandLogo}
            priority
          />
        </span>
      </h1>
      <p className={styles.tagline}>{t(locale, "tasteJournal")}</p>
      <p className={styles.subtitle}>{t(locale, "founded")}</p>

      <div className={styles.heroStrip} aria-label={t(locale, "photoCaption")}>
        {heroImages.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt=""
            width={260}
            height={170}
            className={styles.heroImage}
            aria-hidden="true"
            priority={index === 0}
          />
        ))}
      </div>

      <div className={styles.mastheadBottom}>
        <span>{formatDate(now, locale)}</span>
        <span>{t(locale, "seasonalMenu")}</span>
        <span>
          {t(locale, "tableNumberLabel")} {tableId || "—"}
        </span>
        <span>{t(locale, "euroNote")}</span>
      </div>
    </header>
  );
}
