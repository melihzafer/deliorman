"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getPathname, usePathname } from "@/src/i18n/navigation";
import { routing } from "@/src/i18n/routing";
import styles from "./LanguageSwitcher.module.scss";

const localeConfig = {
  bg: { flag: "🇧🇬", label: "BG", name: "Български" },
  en: { flag: "🇬🇧", label: "EN", name: "English" },
  tr: { flag: "🇹🇷", label: "TR", name: "Türkçe" },
};

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export default function LanguageSwitcher({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("languageSwitcher");

  const localeNames = {
    bg: t("bgName"),
    en: t("enName"),
    tr: t("trName"),
  };

  const handleLocaleChange = useCallback((nextLocale) => {
    if (nextLocale === locale) return;
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
    const nextPath = getPathname({
      href: pathname || "/",
      locale: nextLocale,
      forcePrefix: true,
    });
    window.location.assign(nextPath);
  }, [locale, pathname]);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const currentConfig = localeConfig[locale] || localeConfig.bg;

  return (
    <div
      className={`${styles.langSwitcher} ${className}`.trim()}
      ref={dropdownRef}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        className={styles.trigger}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t("label")}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className={styles.label}>{currentConfig.flag} {currentConfig.label}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="currentColor"
          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`}
        >
          <path d="M1.5 3.5L5 7l3.5-3.5" />
        </svg>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={t("label")}
          className={styles.dropdown}
        >
          {routing.locales.map((loc) => {
            const config = localeConfig[loc];
            const isActive = loc === locale;
            return (
              <li key={loc} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    handleLocaleChange(loc);
                  }}
                  disabled={isActive}
                  className={styles.optionButton}
                  aria-label={
                    isActive
                      ? t("currentLanguage", { language: localeNames[loc] })
                      : t("switchTo", { language: localeNames[loc] })
                  }
                >
                  <span className={styles.flag}>{config.flag}</span>
                  <span className={styles.text}>{config.name}</span>
                  {isActive && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}