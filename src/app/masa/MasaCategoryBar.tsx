"use client";

import { useEffect, useRef } from "react";
import { getCategoryIcon } from "./masaCategoryIcons";
import { localized } from "./masaMenuUtils";
import type { Locale, MasaStyles, QrMenuCategory } from "./masaTypes";

interface MasaCategoryBarProps {
  categories: QrMenuCategory[];
  activeCategoryId: string | undefined;
  onSelectCategory: (categoryId: string) => void;
  locale: Locale;
  styles: MasaStyles;
}

/** Sticky, horizontally-scrollable category chips — the primary browse control. */
export function MasaCategoryBar({
  categories,
  activeCategoryId,
  onSelectCategory,
  locale,
  styles,
}: MasaCategoryBarProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Keep the active chip in view when the category changes (e.g. via the wizard).
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // If active category is the first one, ensure we stay scrolled to 0
    if (categories.length > 0 && activeCategoryId === categories[0].id) {
      scroller.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    const chip = activeRef.current;
    if (!chip) return;
    let left = chip.offsetLeft - scroller.offsetWidth / 2 + chip.offsetWidth / 2;
    if (left < 30) left = 0;
    scroller.scrollTo({ left, behavior: "smooth" });
  }, [activeCategoryId, categories]);

  return (
    <nav className={styles.catBar} aria-label="Menu categories">
      <div className={styles.catScroller} ref={scrollerRef}>
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.id);
          const isActive = activeCategoryId === category.id;
          return (
            <button
              key={category.id}
              ref={isActive ? activeRef : undefined}
              type="button"
              className={`${styles.catChip} ${isActive ? styles.catChipActive : ""}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => onSelectCategory(category.id)}
            >
              <Icon className={styles.catIcon} aria-hidden="true" />
              <span>{localized(category.title, locale)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
