import { getCategoryImageCards } from "../_lib/menuCategoryImages";
import { formatPrice, localized } from "./masaMenuUtils";
import { t } from "./masaTranslations";
import type { Locale, MasaStyles, QrMenuCategory } from "./masaTypes";
import { MasaImageCards } from "./MasaImageCards";

interface MasaMenuListProps {
  activeCategory: QrMenuCategory | undefined;
  currency: string;
  locale: Locale;
  styles: MasaStyles;
}

export function MasaMenuList({ activeCategory, currency, locale, styles }: MasaMenuListProps) {
  if (!activeCategory) return null;

  const activeCategoryCards = getCategoryImageCards(activeCategory.id);

  return (
    <section className={styles.article}>
      <div className={styles.kicker}>{t(locale, "issueSection")}</div>
      <h2 className={styles.headline}>{localized(activeCategory.title, locale)}</h2>
      <p className={styles.deck}>{localized(activeCategory.description, locale)}</p>
      <MasaImageCards cards={activeCategoryCards} locale={locale} styles={styles} />

      <div className={styles.columns}>
        {activeCategory.items.map((item) => {
          const description = localized(item.description, locale);
          return (
            <article key={item.id} className={styles.item}>
              <div className={styles.itemHead}>
                <h3 className={styles.itemTitle}>{localized(item.title, locale)}</h3>
                <span className={styles.dots} aria-hidden="true" />
                <span className={styles.price}>{formatPrice(item.price, currency, locale)}</span>
              </div>
              <div className={styles.itemMeta}>
                {item.amount ? <span className={styles.amount}>{item.amount}</span> : null}
                {description ? <span className={styles.itemText}>{description}</span> : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
