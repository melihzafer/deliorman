import { t } from "./masaTranslations";
import type { Locale, MasaStyles } from "./masaTypes";

interface MasaDrawerProps {
  locale: Locale;
  onClose: () => void;
  onLocaleChange: (locale: Locale) => void;
  displayMode: "both" | "icons" | "text";
  onDisplayModeChange: (mode: "both" | "icons" | "text") => void;
  theme: "classic" | "brutalist" | "olive" | "terminal";
  onThemeChange: (theme: "classic" | "brutalist" | "olive" | "terminal") => void;
  layout: "journal" | "cards" | "minimal";
  onLayoutChange: (layout: "journal" | "cards" | "minimal") => void;
  pageLayout: "classic" | "modern" | "magazine";
  onPageLayoutChange: (pageLayout: "classic" | "modern" | "magazine") => void;
  styles: MasaStyles;
  soundEnabled: boolean;
  onSoundEnabledChange: (enabled: boolean) => void;
}

export function MasaDrawer({
  locale,
  onClose,
  onLocaleChange,
  displayMode,
  onDisplayModeChange,
  theme,
  onThemeChange,
  layout,
  onLayoutChange,
  pageLayout,
  onPageLayoutChange,
  styles,
  soundEnabled,
  onSoundEnabledChange,
}: MasaDrawerProps) {
  return (
    <div className={styles.drawerBackdrop} role="presentation" onClick={onClose}>
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label={t(locale, "openMenu")}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.drawerHeader}>
          <div>
            <p className={styles.drawerKicker}>Deliorman</p>
            <h2>{t(locale, "openMenu")}</h2>
          </div>
          <button type="button" className={styles.drawerClose} onClick={onClose}>
            {t(locale, "closeMenu")}
          </button>
        </div>

        <section className={styles.drawerSection}>
          <h3>{t(locale, "language")}</h3>
          <div className={styles.drawerLangs}>
            {(["bg", "tr", "en"] as Locale[]).map((option) => (
              <button
                key={option}
                type="button"
                className={locale === option ? styles.drawerOptionActive : styles.drawerOption}
                onClick={() => onLocaleChange(option)}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.drawerSection}>
          <h3>{t(locale, "display")}</h3>
          <div className={styles.drawerLangs} style={{ gridTemplateColumns: "1fr" }}>
            {(["both", "icons", "text"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                className={displayMode === mode ? styles.drawerOptionActive : styles.drawerOption}
                onClick={() => onDisplayModeChange(mode)}
                style={{ textAlign: "center", marginBottom: "4px" }}
              >
                {mode === "both" && t(locale, "modeBoth")}
                {mode === "icons" && t(locale, "modeIcons")}
                {mode === "text" && t(locale, "modeText")}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.drawerSection}>
          <h3>{t(locale, "theme")}</h3>
          <div className={styles.drawerLangs} style={{ gridTemplateColumns: "1fr" }}>
            {(["classic", "brutalist", "olive", "terminal"] as const).map((tOpt) => (
              <button
                key={tOpt}
                type="button"
                className={theme === tOpt ? styles.drawerOptionActive : styles.drawerOption}
                onClick={() => onThemeChange(tOpt)}
                style={{ textAlign: "center", marginBottom: "4px" }}
              >
                {tOpt === "classic" && t(locale, "themeClassic")}
                {tOpt === "brutalist" && t(locale, "themeBrutalist")}
                {tOpt === "olive" && t(locale, "themeOlive")}
                {tOpt === "terminal" && t(locale, "themeTerminal")}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.drawerSection}>
          <h3>{t(locale, "layout")}</h3>
          <div className={styles.drawerLangs} style={{ gridTemplateColumns: "1fr" }}>
            {(["journal", "cards", "minimal"] as const).map((lOpt) => (
              <button
                key={lOpt}
                type="button"
                className={layout === lOpt ? styles.drawerOptionActive : styles.drawerOption}
                onClick={() => onLayoutChange(lOpt)}
                style={{ textAlign: "center", marginBottom: "4px" }}
              >
                {lOpt === "journal" && t(locale, "layoutJournal")}
                {lOpt === "cards" && t(locale, "layoutCards")}
                {lOpt === "minimal" && t(locale, "layoutMinimal")}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.drawerSection}>
          <h3>{t(locale, "pageLayout")}</h3>
          <div className={styles.drawerLangs} style={{ gridTemplateColumns: "1fr" }}>
            {(["classic", "modern", "magazine"] as const).map((pOpt) => (
              <button
                key={pOpt}
                type="button"
                className={pageLayout === pOpt ? styles.drawerOptionActive : styles.drawerOption}
                onClick={() => onPageLayoutChange(pOpt)}
                style={{ textAlign: "center", marginBottom: "4px" }}
              >
                {pOpt === "classic" && t(locale, "pageLayoutClassic")}
                {pOpt === "modern" && t(locale, "pageLayoutModern")}
                {pOpt === "magazine" && t(locale, "pageLayoutMagazine")}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.drawerSection}>
          <h3>{t(locale, "soundEffects")}</h3>
          <div className={styles.drawerLangs}>
            {(["on", "off"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                className={soundEnabled === (opt === "on") ? styles.drawerOptionActive : styles.drawerOption}
                onClick={() => onSoundEnabledChange(opt === "on")}
              >
                {opt === "on" ? t(locale, "soundOn") : t(locale, "soundOff")}
              </button>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
