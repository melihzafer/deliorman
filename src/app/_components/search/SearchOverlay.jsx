"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";

export default function SearchOverlay({ isOpen, onClose }) {
  const t = useTranslations("searchPage");
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState([]);
  const [pages, setPages] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setQuery("");
      setMenu([]);
      setPages([]);
      setSpecialties([]);
      setIsSearching(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setMenu([]);
      setPages([]);
      setSpecialties([]);
      return;
    }
    setIsSearching(true);
    try {
      const locale = window.location.pathname.split("/")[1] || "bg";
      const res = await fetch(`/api/search?locale=${locale}&q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setMenu(data.menu || []);
        setPages(data.pages || []);
        setSpecialties(data.specialties || []);
      }
    } catch {
      setMenu([]);
      setPages([]);
      setSpecialties([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const debounceRef = useRef(null);
  const handleChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(value), 250);
  }, [handleSearch]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onClose();
    }
  };

  const hasResults = menu.length > 0 || pages.length > 0 || specialties.length > 0;

  if (!isOpen) return null;

  return (
    <div className="tst-search-overlay" ref={overlayRef} onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div className="tst-search-overlay__container">
        <div className="tst-search-overlay__input-wrapper">
          <i className="fas fa-search tst-search-overlay__icon"></i>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={t("inputPlaceholder")}
            className="tst-search-overlay__input"
          />
          <button onClick={onClose} className="tst-search-overlay__close" aria-label={t("closeLabel") || "Close"}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {query.length >= 2 && (
          <div className="tst-search-overlay__results">
            {isSearching ? (
              <div className="tst-search-overlay__loading">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
            ) : hasResults ? (
              <>
                {pages.length > 0 && (
                  <div className="tst-search-overlay__section">
                    <div className="tst-search-overlay__section-label">
                      <i className="fas fa-file-alt" style={{ marginRight: "8px", verticalAlign: "middle" }}></i>
                      {t("pagesSection") || "Pages"}
                    </div>
                    {pages.map((item, idx) => (
                      <Link
                        key={`page-${idx}`}
                        href={item.href}
                        className="tst-search-overlay__result-item"
                        onClick={onClose}
                      >
                        <div className="tst-search-overlay__result-title">{item.title}</div>
                        {item.text && (
                          <div className="tst-search-overlay__result-text">{item.text.substring(0, 100)}</div>
                        )}
                      </Link>
                    ))}
                  </div>
                )}

                {specialties.length > 0 && (
                  <div className="tst-search-overlay__section">
                    <div className="tst-search-overlay__section-label">
                      <i className="fas fa-star" style={{ marginRight: "8px", verticalAlign: "middle" }}></i>
                      {t("specialtiesSection") || "Specialties"}
                    </div>
                    {specialties.map((item, idx) => (
                      <Link
                        key={`spec-${idx}`}
                        href={item.href}
                        className="tst-search-overlay__result-item"
                        onClick={onClose}
                      >
                        <div className="tst-search-overlay__result-title">{item.title}</div>
                        {item.price && (
                          <div className="tst-search-overlay__result-price">{item.price}</div>
                        )}
                      </Link>
                    ))}
                  </div>
                )}

                {menu.length > 0 && (
                  <div className="tst-search-overlay__section">
                    <div className="tst-search-overlay__section-label">
                      <i className="fas fa-utensils" style={{ marginRight: "8px", verticalAlign: "middle" }}></i>
                      {t("menuSection") || "Menu"}
                    </div>
                    {menu.map((item, idx) => (
                      <Link
                        key={`menu-${idx}`}
                        href={item.href}
                        className="tst-search-overlay__result-item"
                        onClick={onClose}
                      >
                        <div className="tst-search-overlay__result-title">{item.title}</div>
                        {item.categoryName && (
                          <div className="tst-search-overlay__result-category">{item.categoryName}</div>
                        )}
                        {item.text && (
                          <div className="tst-search-overlay__result-text">{item.text}</div>
                        )}
                        {item.price && (
                          <div className="tst-search-overlay__result-price">{item.price}</div>
                        )}
                      </Link>
                    ))}
                  </div>
                )}

                <Link
                  href={`/search?key=${encodeURIComponent(query)}`}
                  className="tst-search-overlay__view-all"
                  onClick={onClose}
                >
                  {t("viewAllResults") || "View all results"}
                  <i className="fas fa-arrow-right" style={{ marginLeft: "8px", verticalAlign: "middle" }}></i>
                </Link>
              </>
            ) : (
              <div className="tst-search-overlay__no-results">
                <i className="fas fa-search" style={{ fontSize: "24px", color: "#767676", marginBottom: "12px", display: "block" }}></i>
                <p>{t("noResults") || "No results found"}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}