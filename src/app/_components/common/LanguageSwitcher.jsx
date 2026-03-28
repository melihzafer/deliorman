"use client";

import { useLocale, useTranslations } from "next-intl";
import { getPathname, usePathname } from "@/src/i18n/navigation";
import { routing } from "@/src/i18n/routing";

const localeConfig = {
  bg: { flag: "🇧🇬", label: "BG" },
  en: { flag: "🇬🇧", label: "EN" },
  tr: { flag: "🇹🇷", label: "TR" },
};

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export default function LanguageSwitcher({ className = "" }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("languageSwitcher");

  const localeNames = {
    bg: t("bgName"),
    en: t("enName"),
    tr: t("trName"),
  };

  function handleLocaleChange(nextLocale) {
    if (nextLocale === locale) return;

    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
    const nextPath = getPathname({
      href: pathname || "/",
      locale: nextLocale,
      forcePrefix: true,
    });

    window.location.assign(nextPath);
  }

  return (
    <div
      className={`tst-lang-switcher ${className}`.trim()}
      aria-label={t("label")}
      style={{ display: "flex", alignItems: "center", gap: "2px", flexWrap: "wrap" }}
    >
      {routing.locales.map((loc, index) => (
        <span key={loc} style={{ display: "inline-flex", alignItems: "center" }}>
          <button
            type="button"
            onClick={() => handleLocaleChange(loc)}
            className={`tst-lang-btn ${loc === locale ? "tst-lang-active" : ""}`}
            aria-label={
              loc === locale
                ? t("currentLanguage", { language: localeNames[loc] })
                : t("switchTo", { language: localeNames[loc] })
            }
            aria-current={loc === locale ? "true" : undefined}
            style={{
              background: "none",
              border: "none",
              cursor: loc === locale ? "default" : "pointer",
              padding: "4px 6px",
              fontSize: "13px",
              fontWeight: loc === locale ? "700" : "400",
              opacity: loc === locale ? 1 : 0.7,
              color: "inherit",
              transition: "opacity 0.2s",
              fontFamily: "var(--font-josefin_sans)",
            }}
          >
            <span aria-hidden="true">{localeConfig[loc].flag}</span>{" "}
            {t(loc)}
          </button>
          {index < routing.locales.length - 1 && (
            <span style={{ opacity: 0.4, fontSize: "12px" }} aria-hidden="true">|</span>
          )}
        </span>
      ))}
    </div>
  );
}
