import { t } from "./masaTranslations";
import type { Locale, MasaStyles, SessionState } from "./masaTypes";

interface MasaSessionOverlayProps {
  locale: Locale;
  notice: string;
  sessionState: SessionState;
  styles: MasaStyles;
}

export function MasaSessionOverlay({ locale, notice, sessionState, styles }: MasaSessionOverlayProps) {
  return (
    <div className={styles.notice}>
      {sessionState === "loading" ? t(locale, "loading") : notice || t(locale, "invalid")}
      {sessionState === "blocked" ? ` ${t(locale, "invalidDetails")}` : ""}
    </div>
  );
}
