"use client";

import MenuItem from "@components/menu/MenuItem";
import { useTranslations } from "next-intl";
import styles from "./MenuSearch.module.scss";

export default function MenuSearch({ items, query }) {
  const t = useTranslations("searchPage");

  if (!query) {
    return (
      <div className="text-center tst-p-60-60">
        <h5>{t("enterKeyword") || "Please enter a keyword to search."}</h5>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center tst-p-60-60">
        <i className={`fas fa-search ${styles.noResultsIcon}`}></i>
        <h5>{t("noResults") || "No items found."}</h5>
      </div>
    );
  }

  return (
    <div className={styles.searchGrid}>
      {items.map((item, idx) => (
        <div key={`search-item-${idx}`} className={styles.searchGridItem}>
          <MenuItem item={item} />
        </div>
      ))}
    </div>
  );
}
