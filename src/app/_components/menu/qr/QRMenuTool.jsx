"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import styles from "../../../_styles/scss/ui/QRMenuTool.module.scss";

// Cap how many codes render at once so a typo (1..1000) can't freeze the page.
const MAX_BATCH = 50;

const PAGES = [
  { value: "/menu", labelKey: "pageMenu" },
  { value: "/table", labelKey: "pageTable" },
  { value: "/lunch-menu", labelKey: "pageLunchMenu" },
  { value: "/feedback", labelKey: "pageFeedback" },
];

const LOCALES = [
  { value: "bg", label: "Български" },
  { value: "en", label: "English" },
  { value: "tr", label: "Türkçe" },
];

const QRMenuTool = ({ tableLimit = 100 }) => {
  const t = useTranslations("qrMenu");

  const [page, setPage] = useState("/menu");
  const [locale, setLocale] = useState("bg");
  const [withTables, setWithTables] = useState(true);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(10);
  const [rangeError, setRangeError] = useState("");
  const [items, setItems] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({ table: i + 1, page: "/menu", locale: "bg" }))
  );

  const qrUrl = (item) => {
    const params = new URLSearchParams({ path: item.page, locale: item.locale, size: "512" });
    if (item.table) params.set("table", String(item.table));
    return `/api/qr?${params.toString()}`;
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    setRangeError("");

    if (!withTables) {
      setItems([{ table: null, page, locale }]);
      return;
    }

    const start = Number(from);
    const end = Number(to);
    if (
      !Number.isInteger(start) || !Number.isInteger(end) ||
      start < 1 || end < start ||
      end > tableLimit || end - start + 1 > MAX_BATCH
    ) {
      setRangeError(t("rangeError"));
      return;
    }

    setItems(
      Array.from({ length: end - start + 1 }, (_, i) => ({
        table: start + i,
        page,
        locale,
      }))
    );
  };

  const handleDownload = async (item) => {
    try {
      const response = await fetch(qrUrl(item));
      if (!response.ok) return;
      const svg = await response.text();
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = item.table ? `deliorman-qr-table-${item.table}.svg` : "deliorman-qr.svg";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      // Download is best-effort; the preview stays usable.
    }
  };

  const limitNote = useMemo(
    () => t("limitNote", { limit: tableLimit, batch: MAX_BATCH }),
    [t, tableLimit]
  );

  return (
    <div className={styles.wrapper}>
      <form className={styles.controls} onSubmit={handleGenerate}>
        <div className={styles.field}>
          <label htmlFor="qr-page">{t("pageLabel")}</label>
          <select id="qr-page" value={page} onChange={(e) => setPage(e.target.value)}>
            {PAGES.map((p) => (
              <option key={p.value} value={p.value}>{t(p.labelKey)}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="qr-locale">{t("localeLabel")}</label>
          <select id="qr-locale" value={locale} onChange={(e) => setLocale(e.target.value)}>
            {LOCALES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.fieldCheckbox}>
          <label>
            <input
              type="checkbox"
              checked={!withTables}
              onChange={(e) => setWithTables(!e.target.checked)}
            />
            <span>{t("noTables")}</span>
          </label>
        </div>

        {withTables && (
          <>
            <div className={styles.field}>
              <label htmlFor="qr-from">{t("tableFromLabel")}</label>
              <input
                id="qr-from"
                type="number"
                min={1}
                max={tableLimit}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="qr-to">{t("tableToLabel")}</label>
              <input
                id="qr-to"
                type="number"
                min={1}
                max={tableLimit}
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </>
        )}

        <div className={styles.actions}>
          <button type="submit" className={styles.primaryButton}>{t("generate")}</button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => window.print()}
          >
            {t("print")}
          </button>
        </div>
      </form>

      <p className={styles.limitNote}>{limitNote}</p>
      {rangeError && <p className={styles.error} role="alert">{rangeError}</p>}

      <div className={styles.grid}>
        {items.map((item) => (
          <figure key={`${item.page}-${item.locale}-${item.table ?? "none"}`} className={styles.card}>
            <figcaption className={styles.cardHeader}>
              <span className={styles.cardBrand}>Делиорман</span>
              {item.table ? (
                <span className={styles.cardTable}>{t("tableLabel")} {item.table}</span>
              ) : null}
            </figcaption>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl(item)} alt={item.table ? `${t("tableLabel")} ${item.table}` : t("title")} loading="lazy" />
            <p className={styles.cardHint}>{t("scanHint")}</p>
            <button
              type="button"
              className={styles.downloadButton}
              onClick={() => handleDownload(item)}
            >
              {t("download")}
            </button>
          </figure>
        ))}
      </div>
    </div>
  );
};

export default QRMenuTool;
