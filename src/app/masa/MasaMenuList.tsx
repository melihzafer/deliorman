import React from "react";
import { getCategoryImageCards } from "../_lib/menuCategoryImages";
import { formatPrice, localized } from "./masaMenuUtils";
import { t } from "./masaTranslations";
import type { Locale, MasaStyles, QrMenuCategory } from "./masaTypes";
import { MasaImageCards, MasaSingleImageCard } from "./MasaImageCards";

interface MasaMenuListProps {
  activeCategory: QrMenuCategory | undefined;
  currency: string;
  locale: Locale;
  layout: "journal" | "cards" | "minimal";
  styles: MasaStyles;
  pageLayout: "classic" | "modern" | "magazine";
}

export function MasaMenuList({ activeCategory, currency, locale, layout, styles, pageLayout }: MasaMenuListProps) {
  if (!activeCategory) return null;

  const activeCategoryCards = getCategoryImageCards(activeCategory.id);
  const layoutClass =
    layout === "cards"
      ? styles.layoutCards
      : layout === "minimal"
        ? styles.layoutMinimal
        : styles.layoutJournal;

  const isModern = pageLayout === "modern";
  const isMagazine = pageLayout === "magazine";

  if (isMagazine || isModern) {
    const items = activeCategory.items;
    const cards = activeCategoryCards;
    // Chunk items dynamically based on the number of photos
    const chunkSize = cards.length > 0 ? Math.max(2, Math.ceil(items.length / (cards.length + 1))) : items.length;
    
    const chunks = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      chunks.push(items.slice(i, i + chunkSize));
    }

    const inlineCardWrapperClass = isMagazine ? styles.magazineInlineCardWrapper : styles.kioskInlineCardWrapper;
    const chunkClass = isMagazine ? styles.magazineChunk : styles.kioskChunk;

    return (
      <section className={`${styles.article} ${isModern ? styles.articleModern : styles.articleMagazine}`}>
        {!isModern ? <div className={styles.kicker}>{t(locale, "issueSection")}</div> : null}
        <h2 className={styles.headline}>{localized(activeCategory.title, locale)}</h2>
        <p className={styles.deck}>{localized(activeCategory.description, locale)}</p>

        {chunks.map((chunk, index) => {
          const correspondingCard = cards[index - 1]; // Photos scattered after the first block of menu items
          return (
            <React.Fragment key={index}>
              {index > 0 && correspondingCard ? (
                <div className={inlineCardWrapperClass}>
                  <MasaSingleImageCard
                    card={correspondingCard}
                    cardIndex={index - 1}
                    locale={locale}
                    styles={styles}
                  />
                </div>
              ) : null}

              <div className={`${styles.columns} ${layoutClass} ${chunkClass}`}>
                {chunk.map((item) => {
                  const description = localized(item.description, locale);
                  return (
                    <article key={item.id} className={styles.item}>
                      <div className={styles.itemHead}>
                        <h3 className={styles.itemTitle}>{localized(item.title, locale)}</h3>
                        {layout === "journal" ? <span className={styles.dots} aria-hidden="true" /> : null}
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
            </React.Fragment>
          );
        })}

        {/* Append remaining cards if items list was too short to yield enough chunks */}
        {cards.slice(chunks.length - 1).map((card, idx) => {
          const cardIndex = chunks.length - 1 + idx;
          return (
            <div key={card.src} className={inlineCardWrapperClass}>
              <MasaSingleImageCard
                card={card}
                cardIndex={cardIndex}
                locale={locale}
                styles={styles}
              />
            </div>
          );
        })}
      </section>
    );
  }

  return (
    <section className={styles.article}>
      <div className={styles.kicker}>{t(locale, "issueSection")}</div>
      <h2 className={styles.headline}>{localized(activeCategory.title, locale)}</h2>
      <p className={styles.deck}>{localized(activeCategory.description, locale)}</p>
      <MasaImageCards cards={activeCategoryCards} locale={locale} styles={styles} />

      <div className={`${styles.columns} ${layoutClass}`}>
        {activeCategory.items.map((item) => {
          const description = localized(item.description, locale);
          return (
            <article key={item.id} className={styles.item}>
              <div className={styles.itemHead}>
                <h3 className={styles.itemTitle}>{localized(item.title, locale)}</h3>
                {layout === "journal" ? <span className={styles.dots} aria-hidden="true" /> : null}
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
