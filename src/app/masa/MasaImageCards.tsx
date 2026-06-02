import Image from "next/image";

import type { MenuImageCard } from "../_lib/menuCategoryImages";
import { localized } from "./masaMenuUtils";
import { t } from "./masaTranslations";
import type { Locale, MasaStyles } from "./masaTypes";

interface MasaImageCardsProps {
  cards: MenuImageCard[];
  locale: Locale;
  styles: MasaStyles;
}

export function MasaSingleImageCard({
  card,
  cardIndex,
  locale,
  styles,
}: {
  card: MenuImageCard;
  cardIndex: number;
  locale: Locale;
  styles: MasaStyles;
}) {
  const cardTitle = localized(card.title, locale);
  const cardNote = localized(card.note, locale);

  return (
    <figure className={styles.menuImageCardInline}>
      <div className={styles.menuImageCardHeader}>
        <span className={styles.menuImageCardNumber}>{String(cardIndex + 1).padStart(2, "0")}</span>
        <span className={styles.menuImageCardTitle}>{cardTitle}</span>
      </div>
      {cardNote ? <p className={styles.menuImageCardNote}>{cardNote}</p> : null}
      <div className={styles.menuImageCardPhoto}>
        <Image
          src={card.src}
          alt={cardTitle}
          width={600}
          height={400}
          className={styles.menuImageCardImage}
          sizes="(min-width: 820px) 600px, 94vw"
          unoptimized
        />
      </div>
      <figcaption className={styles.menuImageCardCaption}>{t(locale, "photoCaption")}</figcaption>
    </figure>
  );
}

export function MasaImageCards({ cards, locale, styles }: MasaImageCardsProps) {
  if (cards.length === 0) return null;

  return (
    <div className={styles.menuImageCards} aria-label={t(locale, "photoCaption")}>
      {cards.map((card, cardIndex) => {
        const isFeaturedCard = cardIndex === Math.min(1, cards.length - 1);
        const cardTitle = localized(card.title, locale);
        const cardNote = localized(card.note, locale);

        return (
          <figure
            key={card.src}
            className={`${styles.menuImageCard} ${isFeaturedCard ? styles.menuImageCardFeatured : ""}`}
          >
            <div className={styles.menuImageCardHeader}>
              <span className={styles.menuImageCardNumber}>{String(cardIndex + 1).padStart(2, "0")}</span>
              <span className={styles.menuImageCardTitle}>{cardTitle}</span>
            </div>
            <p className={styles.menuImageCardNote}>{cardNote}</p>
            <div className={styles.menuImageCardPhoto}>
              <Image
                src={card.src}
                alt={cardTitle}
                width={360}
                height={300}
                className={styles.menuImageCardImage}
                sizes="(min-width: 820px) 260px, 78vw"
                priority={isFeaturedCard}
                unoptimized
              />
            </div>
            <figcaption className={styles.menuImageCardCaption}>{t(locale, "photoCaption")}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}
