import { t } from "./masaTranslations";
import type { Locale, LocalizedText } from "./masaTypes";

export function normalizeTableId(value: string | null): string {
  const tableId = String(value ?? "").trim();
  return /^[1-9]\d{0,2}$/.test(tableId) ? tableId : "";
}

export function localized(value: LocalizedText, locale: Locale): string {
  const order: Locale[] =
    locale === "en" ? ["en", "tr", "bg"] : locale === "tr" ? ["tr", "bg", "en"] : ["bg", "tr", "en"];
  for (const key of order) {
    const text = value[key];
    if (text) return text;
  }
  return "";
}

export function formatDate(date: Date, locale: Locale): string {
  return date.toLocaleDateString(locale === "tr" ? "tr-TR" : locale === "en" ? "en-GB" : "bg-BG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getEditionLabel(date: Date, locale: Locale): string {
  const hour = date.getHours();
  if (locale === "tr") {
    if (hour < 11) return "Sabah baskısı";
    if (hour < 15) return "Öğle baskısı";
    if (hour < 18) return "Öğleden sonra baskısı";
    return "Akşam baskısı";
  }
  if (locale === "en") {
    if (hour < 11) return "Morning edition";
    if (hour < 15) return "Lunch edition";
    if (hour < 18) return "Afternoon edition";
    return "Evening edition";
  }
  if (hour < 11) return "Сутрешно издание";
  if (hour < 15) return "Обедно издание";
  if (hour < 18) return "Следобедно издание";
  return "Вечерно издание";
}

// Menu prices are stored (and always displayed) in Euro — Bulgaria's currency
// since it adopted the Euro. The `currency` param is kept for call-site
// compatibility but is no longer branched on.
export function formatPrice(price: number | null, _currency: string, locale: Locale): string {
  if (typeof price !== "number") return t(locale, "noPrice");
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : locale === "en" ? "en-IE" : "bg-BG", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}
