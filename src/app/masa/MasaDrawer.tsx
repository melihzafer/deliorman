import { MasaCategoryNav } from "./MasaCategoryNav";
import { t } from "./masaTranslations";
import type { Locale, MasaStyles, QrMenuCategory } from "./masaTypes";

interface MasaDrawerProps {
  activeCategoryId: string | undefined;
  categories: QrMenuCategory[];
  locale: Locale;
  onClose: () => void;
  onLocaleChange: (locale: Locale) => void;
  onSelectCategory: (categoryId: string) => void;
  styles: MasaStyles;
}

export function MasaDrawer({
  activeCategoryId,
  categories,
  locale,
  onClose,
  onLocaleChange,
  onSelectCategory,
  styles,
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
          <h3>{t(locale, "categories")}</h3>
          <MasaCategoryNav
            activeCategoryId={activeCategoryId}
            categories={categories}
            locale={locale}
            onSelectCategory={onSelectCategory}
            styles={styles}
          />
        </section>
      </aside>
    </div>
  );
}
