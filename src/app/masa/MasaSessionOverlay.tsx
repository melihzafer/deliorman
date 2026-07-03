import { QrCode, Wifi } from "lucide-react";

import { t } from "./masaTranslations";
import type { Locale, MasaStyles, SessionState } from "./masaTypes";

interface MasaSessionOverlayProps {
  locale: Locale;
  notice: string;
  sessionState: SessionState;
  styles: MasaStyles;
}

export function MasaSessionOverlay({ locale, notice, sessionState, styles }: MasaSessionOverlayProps) {
  if (sessionState === "loading") {
    // Skeleton: tabs + a title + a few rows so the screen never reads as broken.
    return (
      <div className={styles.skeletonWrap} aria-busy="true" aria-label={t(locale, "loading")}>
        <div className={styles.skelTabs}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`${styles.skelChip} ${styles.shimmer}`} />
          ))}
        </div>
        <div className={`${styles.skelTitle} ${styles.shimmer}`} />
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.skelRow}>
            <div className={styles.skelLines}>
              <div className={`${styles.skelLineWide} ${styles.shimmer}`} />
              <div className={`${styles.skelLineNarrow} ${styles.shimmer}`} />
            </div>
            <div className={`${styles.skelPrice} ${styles.shimmer}`} />
          </div>
        ))}
      </div>
    );
  }

  // Blocked / invalid session.
  return (
    <div className={styles.overlay}>
      <div className={styles.overlayCard} role="alert">
        <div className={styles.overlayIcon}>
          <QrCode size={40} aria-hidden="true" />
        </div>
        <h2 className={styles.overlayTitle}>{t(locale, "blockedTitle")}</h2>
        <p className={styles.overlayText}>
          {notice || t(locale, "invalid")} {t(locale, "invalidDetails")}
        </p>
        <p className={styles.overlayText} style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Wifi size={15} aria-hidden="true" /> {t(locale, "wifiHint")}
        </p>
      </div>
    </div>
  );
}
