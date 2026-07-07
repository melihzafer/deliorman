import Image from "next/image";
import { Settings2 } from "lucide-react";

import { t } from "./masaTranslations";
import type { Locale, MasaStyles } from "./masaTypes";

interface MasaMastheadProps {
  isVip: boolean;
  locale: Locale;
  menuOpen: boolean;
  onOpenMenu: () => void;
  onLocaleChange: (locale: Locale) => void;
  styles: MasaStyles;
  tableId: string;
}

const LOCALES: Locale[] = ["bg", "tr", "en"];

/** Slim, sticky header: settings · brand · instant language switch. */
export function MasaMasthead({
  isVip,
  locale,
  menuOpen,
  onOpenMenu,
  onLocaleChange,
  styles,
  tableId,
}: MasaMastheadProps) {
  const tableLabel = isVip
    ? t(locale, "vipBadge")
    : `${t(locale, "tableNumberLabel")} ${tableId || "—"}`;

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.headerLeft}>
          <button
            type="button"
            className={styles.settingsBtn}
            aria-label={t(locale, "settings")}
            aria-expanded={menuOpen}
            onClick={onOpenMenu}
          >
            <Settings2 size={20} aria-hidden="true" />
          </button>

          <div className={styles.brand}>
            <Image
              src="/img/deliorman_colorized_logo.svg"
              alt=""
              width={38}
              height={38}
              className={styles.brandLogo}
              priority
              aria-hidden="true"
              style={{ objectFit: 'contain', display: 'block' }}
            />
            <div className={styles.brandText}>
              <span className={styles.brandName}>{t(locale, "brandName")}</span>
              <span className={`${styles.brandTable} ${isVip ? styles.brandTableVip : ""}`}>
                {tableLabel}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.langGroup} role="group" aria-label={t(locale, "language")}>
          {LOCALES.map((option) => (
            <button
              key={option}
              type="button"
              className={`${styles.langPill} ${locale === option ? styles.langPillActive : ""}`}
              aria-pressed={locale === option}
              onClick={() => onLocaleChange(option)}
            >
              {option.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
