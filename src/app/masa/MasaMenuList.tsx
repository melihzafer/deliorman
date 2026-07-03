import Image from "next/image";
import { UtensilsCrossed } from "lucide-react";

import { getCategoryImageCards } from "../_lib/menuCategoryImages";
import { formatPrice, localized } from "./masaMenuUtils";
import { t } from "./masaTranslations";
import type { Locale, MasaStyles, QrMenuCategory } from "./masaTypes";

interface MasaMenuListProps {
  activeCategory: QrMenuCategory | undefined;
  currency: string;
  locale: Locale;
  styles: MasaStyles;
  showImages: boolean;
}

export function MasaMenuList({
  activeCategory,
  currency,
  locale,
  styles,
  showImages,
}: MasaMenuListProps) {
  if (!activeCategory) return null;

  const title = localized(activeCategory.title, locale);
  const description = localized(activeCategory.description, locale);
  const cards = showImages ? getCategoryImageCards(activeCategory.id) : [];
  const items = activeCategory.items;

  return (
    <section className={styles.section} aria-labelledby="catTitle">
      <div className={styles.sectionHead}>
        <p className={styles.sectionKicker}>{t(locale, "menuSection")}</p>
        <h2 id="catTitle" className={styles.sectionTitle}>
          {title}
        </h2>
        {description ? <p className={styles.sectionDesc}>{description}</p> : null}
      </div>

      {cards.length > 0 ? (
        <div className={styles.photoStrip} aria-label={t(locale, "photoCaption")}>
          {cards.map((card, index) => (
            <figure key={card.src} className={styles.photoCard}>
              <div className={styles.photoFrame}>
                <Image
                  src={card.src}
                  alt={localized(card.title, locale)}
                  width={400}
                  height={300}
                  className={styles.photoImg}
                  sizes="200px"
                  priority={index === 0}
                  unoptimized
                />
              </div>
              <figcaption className={styles.photoLabel}>{localized(card.title, locale)}</figcaption>
            </figure>
          ))}
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className={styles.empty}>
          <UtensilsCrossed size={28} className={styles.emptyIcon} aria-hidden="true" />
          <p>{t(locale, "emptyCategory")}</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => {
            const itemDesc = localized(item.description, locale);
            const hasPrice = typeof item.price === "number";
            return (
              <li key={item.id} className={styles.row}>
                <div className={styles.rowText}>
                  <h3 className={styles.rowTitle}>{localized(item.title, locale)}</h3>
                  {itemDesc ? <p className={styles.rowDesc}>{itemDesc}</p> : null}
                  {item.amount ? <span className={styles.amount}>{item.amount}</span> : null}
                </div>
                {hasPrice ? (
                  <div className={styles.rowAside}>
                    <span className={styles.price}>{formatPrice(item.price, currency, locale)}</span>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <p className={styles.euroNote}>{t(locale, "euroNote")}</p>
    </section>
  );
}
