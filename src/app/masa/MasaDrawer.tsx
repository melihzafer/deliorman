import { useEffect } from "react";
import { X } from "lucide-react";

import { t } from "./masaTranslations";
import type { Locale, MasaStyles } from "./masaTypes";

interface MasaDrawerProps {
  locale: Locale;
  onClose: () => void;
  onLocaleChange: (locale: Locale) => void;
  styles: MasaStyles;
  soundEnabled: boolean;
  onSoundEnabledChange: (enabled: boolean) => void;
  showImages: boolean;
  onShowImagesChange: (show: boolean) => void;
}

const LOCALES: { code: Locale; label: string }[] = [
  { code: "bg", label: "Български" },
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
];

export function MasaDrawer({
  locale,
  onClose,
  onLocaleChange,
  styles,
  soundEnabled,
  onSoundEnabledChange,
  showImages,
  onShowImagesChange,
}: MasaDrawerProps) {
  // Lock body scroll while the drawer is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className={styles.scrim} role="presentation" onClick={onClose}>
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label={t(locale, "settings")}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.drawerHead}>
          <h2 className={styles.drawerTitle}>{t(locale, "settings")}</h2>
          <button
            type="button"
            className={styles.drawerClose}
            onClick={onClose}
            aria-label={t(locale, "closeMenu")}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.drawerBody}>
          <div className={styles.field}>
            <p className={styles.fieldLabel}>{t(locale, "language")}</p>
            <div className={styles.segment}>
              {LOCALES.map(({ code, label }) => (
                <button
                  key={code}
                  type="button"
                  className={`${styles.segBtn} ${locale === code ? styles.segBtnActive : ""}`}
                  aria-pressed={locale === code}
                  onClick={() => onLocaleChange(code)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <p className={styles.fieldLabel}>{t(locale, "menuImages")}</p>
            <div className={styles.segment}>
              <button
                type="button"
                className={`${styles.segBtn} ${showImages ? styles.segBtnActive : ""}`}
                aria-pressed={showImages}
                onClick={() => onShowImagesChange(true)}
              >
                {t(locale, "soundOn")}
              </button>
              <button
                type="button"
                className={`${styles.segBtn} ${!showImages ? styles.segBtnActive : ""}`}
                aria-pressed={!showImages}
                onClick={() => onShowImagesChange(false)}
              >
                {t(locale, "soundOff")}
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <p className={styles.fieldLabel}>{t(locale, "soundEffects")}</p>
            <div className={styles.segment}>
              <button
                type="button"
                className={`${styles.segBtn} ${soundEnabled ? styles.segBtnActive : ""}`}
                aria-pressed={soundEnabled}
                onClick={() => onSoundEnabledChange(true)}
              >
                {t(locale, "soundOn")}
              </button>
              <button
                type="button"
                className={`${styles.segBtn} ${!soundEnabled ? styles.segBtnActive : ""}`}
                aria-pressed={!soundEnabled}
                onClick={() => onSoundEnabledChange(false)}
              >
                {t(locale, "soundOff")}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
