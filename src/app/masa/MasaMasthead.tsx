import Image from "next/image";

import { heroImages } from "../_lib/menuCategoryImages";
import { formatDate, getEditionLabel } from "./masaMenuUtils";
import { t } from "./masaTranslations";
import type { Locale, MasaStyles } from "./masaTypes";

interface MasaMastheadProps {
  isVip: boolean;
  locale: Locale;
  menuOpen: boolean;
  now: Date;
  onOpenMenu: () => void;
  styles: MasaStyles;
  tableId: string;
  pageLayout: "classic" | "modern" | "magazine";
  showImages: boolean;
}

export function MasaMasthead({ isVip, locale, menuOpen, now, onOpenMenu, styles, tableId, pageLayout, showImages }: MasaMastheadProps) {
  const editionLabel = isVip ? t(locale, "vipBadge") : `${t(locale, "issueVolumeLabel")} ${tableId || "—"}`;
  const tableLabel = isVip ? t(locale, "vipBadge") : `${t(locale, "tableNumberLabel")} ${tableId || "—"}`;
  const editionClass = isVip ? `${styles.edition} ${styles.vipBadge}` : styles.edition;

  if (pageLayout === "modern") {
    return (
      <header className={styles.kioskHeader}>
        <div className={styles.kioskHeaderInner}>
          <button
            type="button"
            className={styles.kioskMenuButton}
            aria-label={t(locale, "openMenu")}
            aria-expanded={menuOpen}
            onClick={onOpenMenu}
          >
            <span className={styles.glowingDot} />
            <span className={styles.hamburgerIconWithPulse}>
              <span />
              <span />
              <span />
            </span>
            <span className={styles.kioskMenuButtonLabel}>{t(locale, "styleIconLabel")}</span>
          </button>
          
          <div className={styles.kioskBrand}>
            <span className={styles.kioskLogoWrapper}>
              <Image
                src="/img/deliorman_colorized_logo.svg"
                alt="Делиорман"
                width={36}
                height={36}
                className={styles.kioskLogo}
                priority
              />
            </span>
            <span className={styles.kioskTitle}>DELIORMAN</span>
          </div>

          <div className={styles.kioskMeta}>
            <span className={styles.kioskTable}>{tableLabel}</span>
          </div>
        </div>
      </header>
    );
  }

  if (pageLayout === "magazine") {
    const statusLabel = isVip
      ? t(locale, "vipBadge")
      : `${t(locale, "tableNumberLabel")} ${tableId || "—"}`;
    const statusClass = isVip
      ? `${styles.magazineStatus} ${styles.vipBadge}`
      : styles.magazineStatus;

    return (
      <header className={styles.magazineHeader}>
        <div className={styles.magazineTopBar}>
          <button
            type="button"
            className={styles.magazineMenuButton}
            aria-label={t(locale, "openMenu")}
            aria-expanded={menuOpen}
            onClick={onOpenMenu}
          >
            <span className={styles.glowingDot} />
            <span className={styles.hamburgerIconWithPulse}>
              <span />
              <span />
              <span />
            </span>
            <span className={styles.magazineMenuButtonLabel}>{t(locale, "styleIconLabel")}</span>
          </button>
          <span className={styles.magazineBrand}>DELIORMAN</span>
          <span className={statusClass}>{statusLabel}</span>
        </div>

        {showImages ? (
          <div className={styles.magazineHeroContainer}>
            <Image
              src={heroImages[0]}
              alt="Showcase"
              width={820}
              height={460}
              className={styles.magazineHeroImage}
              priority
            />
            <div className={styles.magazineHeroOverlay}>
              <h1 className={styles.magazineTitle}>DELIORMAN</h1>
              <p className={styles.magazineSubtitle}>{t(locale, "tasteJournal")}</p>
            </div>
          </div>
        ) : null}
      </header>
    );
  }

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
            <span className={styles.glowingDot} />
            <span className={styles.hamburgerIconWithPulse}>
              <span />
              <span />
              <span />
            </span>
            <span className={styles.menuButtonLabel}>{t(locale, "styleIconLabel")}</span>
          </button>
          <span className={editionClass}>{editionLabel}</span>
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

      {showImages && (
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
      )}

      <div className={styles.mastheadBottom}>
        <span>{formatDate(now, locale)}</span>
        <span>{t(locale, "seasonalMenu")}</span>
        <span className={isVip ? styles.vipBadge : undefined}>{tableLabel}</span>
        <span>{t(locale, "euroNote")}</span>
      </div>
    </header>
  );
}
