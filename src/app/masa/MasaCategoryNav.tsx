import { localized } from "./masaMenuUtils";
import type { Locale, MasaStyles, QrMenuCategory } from "./masaTypes";

interface MasaCategoryNavProps {
  activeCategoryId: string | undefined;
  categories: QrMenuCategory[];
  locale: Locale;
  onSelectCategory: (categoryId: string) => void;
  styles: MasaStyles;
}

export function MasaCategoryNav({
  activeCategoryId,
  categories,
  locale,
  onSelectCategory,
  styles,
}: MasaCategoryNavProps) {
  return (
    <div className={styles.drawerCategories}>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={activeCategoryId === category.id ? styles.drawerCategoryActive : styles.drawerCategory}
          onClick={() => onSelectCategory(category.id)}
        >
          <span>{localized(category.title, locale)}</span>
          <small>{String(category.order).padStart(2, "0")}</small>
        </button>
      ))}
    </div>
  );
}
