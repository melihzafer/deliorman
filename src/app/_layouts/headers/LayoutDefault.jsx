"use client";

import { Link } from "@/src/i18n/navigation";
import Image from "next/image";
import { useEffect, useState, useTransition, useCallback, memo, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

import { useTranslations, useLocale } from "next-intl";
import { OnePageMenu } from "@common/onepageMenu";
import { getLocalizedAppData } from "@data/getLocalizedAppData";
import LanguageSwitcher from "@components/common/LanguageSwitcher";
import SearchOverlay from "@components/search/SearchOverlay";

const ReservationForm = dynamic(
  () => import("@components/forms/ReservationForm"),
  {
    ssr: false,
    loading: () => (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid rgba(243, 156, 18, 0.3)",
            borderTop: "3px solid #f39c12",
            borderRadius: "50%",
            margin: "0 auto 15px",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ color: "#666" }}>...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    ),
  }
);

const NAV_KEY_MAP = {
  '/': 'home',
  '/menu': 'menu',
  '/about': 'about',
  '/gallery': 'gallery',
  '/contact': 'contact',
  '/reservation': 'reservation',
  '/feedback': 'feedback',
};
const SUB_NAV_KEY_MAP = {
  '/menu': 'classicMenu',
  '/lunch-menu': 'lunchMenu',
  '/about': 'aboutRestaurant',
  '/special-days': 'specialDays',
  '/catering-services': 'services',
};

const DefaultHeader = memo(() => {
  const locale = useLocale();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [reservationPopup, setReservationPopup] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  // Header scroll behavior
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const asPath = usePathname();
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  const localizedAppData = useMemo(() => getLocalizedAppData(locale), [locale]);

  const isPathActive = useCallback(
    (path) => {
      if (path === "/") return asPath === "/" || asPath === `/${asPath.split("/")[1]}`;
      return asPath === path || asPath.startsWith(path + "/");
    },
    [asPath]
  );
  
  const showLanguageSwitcher = !isPathActive("onepage");

  const handleMobileMenuToggle = useCallback(() => {
    startTransition(() => {
      setMobileMenu((prev) => !prev);
    });
  }, []);

  const handleReservationToggle = useCallback((e) => {
    e.preventDefault();
    startTransition(() => {
      setReservationPopup((prev) => !prev);
    });
  }, []);

  const handleReservationClose = useCallback(() => {
    startTransition(() => {
      setReservationPopup(false);
    });
  }, []);

  const handleSubMenuClick = useCallback((index, e) => {
    if (typeof window !== "undefined" && window.innerWidth <= 992) {
      e.preventDefault();
      e.stopPropagation();
      startTransition(() => {
        setOpenSubMenu((prev) => (prev === index ? false : index));
      });
    }
  }, []);

  const handleSearchOpen = useCallback(() => {
    setSearchOpen(true);
  }, []);

  const handleSearchClose = useCallback(() => {
    setSearchOpen(false);
  }, []);

  // Handle scroll to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down
        if (!mobileMenu) setShowHeader(false);
      } else {
        // Scrolling up
        setShowHeader(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, mobileMenu]);

  useEffect(() => {
    setMobileMenu(false);
    setReservationPopup(false);
    setOpenSubMenu(false);
    setSearchOpen(false);
    setShowHeader(true);
  }, [asPath]);

  useEffect(() => {
    if (mobileMenu) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }
    return () => document.body.classList.remove("mobile-menu-open");
  }, [mobileMenu]);

  useEffect(() => {
    if (isPathActive("onepage")) {
      OnePageMenu();
    }
  }, [isPathActive]);

  return (
    <>
      <div className={`tst-menu-frame ${!showHeader ? 'tst-menu-hidden' : ''}`} style={{
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
        transform: showHeader ? 'translateY(0)' : 'translateY(-100%)',
        opacity: showHeader ? 1 : 0
      }}>
        <div className="tst-dynamic-menu" id="tst-dynamic-menu">
            <div className="tst-menu">
              <Link href="/" className="tst-logo-link">
                <Image
                  src={localizedAppData.header.logo.image}
                  className="tst-logo"
                  alt={localizedAppData.header.logo.alt}
                  width={70}
                  height={24}
                  priority
                />
              </Link>
            <nav role="navigation" aria-label={t("mainNavigation")} className={`${mobileMenu ? "tst-active" : ""}`}>
              {mobileMenu && (
                <button 
                  className="tst-close-menu d-lg-none" 
                  onClick={handleMobileMenuToggle}
                  aria-label={tc("close")}
                >
                  <i className="fas fa-times" aria-hidden="true"></i>
                </button>
              )}
              {isPathActive("onepage") ? (
                <ul>
                  {localizedAppData.header.onepage.map((item, index) => (
                    <li
                      key={`header-menu-onepage-item-${index}`}
                      className={index === 0 ? "current-menu-item" : ""}
                    >
                      <a data-no-swup href={item.link}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <>
                  <ul>
                    {localizedAppData.header.menu.map((item, index) => (
                      <li
                        className={`${
                          item.children && item.children.length > 0
                            ? "menu-item-has-children"
                            : ""
                        } ${isPathActive(item.link) ? "current-menu-item" : ""}`}
                        key={`header-menu-item-${index}`}
                      >
                        <Link
                          href={item.link}
                          onClick={
                            item.children && item.children.length > 0
                              ? (e) => handleSubMenuClick(index, e)
                              : undefined
                          }
                        >
                          {NAV_KEY_MAP[item.link] ? t(NAV_KEY_MAP[item.link]) : item.label}
                        </Link>
                        {item.children && item.children.length > 0 && (
                          <ul
                            className={openSubMenu === index ? "tst-active" : ""}
                            aria-expanded={openSubMenu === index}
                            aria-hidden={openSubMenu !== index}
                          >
                            {item.children.map((subitem, subIndex) => (
                              <li
                                key={`header-submenu-item-${subIndex}`}
                                className={
                                  isPathActive(subitem.link) ? "tst-active" : ""
                                }
                              >
                                {subitem.link === "/onepage" ? (
                                  <a href={subitem.link} target="_blank" rel="noopener noreferrer">
                                    {SUB_NAV_KEY_MAP[subitem.link] ? t(SUB_NAV_KEY_MAP[subitem.link]) : subitem.label}
                                  </a>
                                ) : (
                                  <Link href={subitem.link}>{SUB_NAV_KEY_MAP[subitem.link] ? t(SUB_NAV_KEY_MAP[subitem.link]) : subitem.label}</Link>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                    <li className="d-lg-none">
                      <button
                        onClick={handleSearchOpen}
                        className="tst-mobile-search-link"
                        aria-label={t("searchTitle") || "Search"}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "0",
                          background: "none",
                          border: "none",
                          color: "#7e2010",
                          fontSize: "14px",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        <i className="fas fa-search"></i>
                        {t("searchTitle") || "Search"}
                      </button>
                    </li>
                  </ul>
                </>
              )}
            </nav>
            <div className="tst-menu-right">
              {/* Order: Language -> Search -> Reservation -> Hamburger */}
              
              {showLanguageSwitcher && (
                <div className="tst-nav-item">
                  <LanguageSwitcher />
                </div>
              )}

              <button
                onClick={handleSearchOpen}
                className="tst-btn tst-res-btn tst-btn-icon tst-search-btn"
                aria-label={t("searchTitle") || "Search"}
              >
                <span className="tst-icon" aria-hidden="true">
                  <i className="fas fa-search"></i>
                </span>
                <span className="sr-only">{t("searchTitle") || "Search"}</span>
              </button>

              <a
                href="#."
                className={`tst-btn tst-res-btn d-none d-lg-flex ${
                  reservationPopup ? "tst-active" : ""
                }`}
                onClick={handleReservationToggle}
                data-no-swup
              >
                <i className="fas fa-calendar-alt" aria-hidden="true" style={{marginRight: '8px', fontSize: '1.1em'}}></i>
                <span>{tc("reservations")}</span>
              </a>

              <a
                href="#."
                className={`tst-btn tst-res-btn tst-btn-icon d-lg-none ${
                  reservationPopup ? "tst-active" : ""
                }`}
                aria-controls="reservation-popup"
                aria-expanded={reservationPopup ? "true" : "false"}
                aria-label={tc("reservations")}
                onClick={handleReservationToggle}
                data-no-swup
              >
                <span className="tst-icon" aria-hidden="true">
                  <i className="fas fa-calendar-check"></i>
                </span>
                <span className="sr-only">{tc("reservations")}</span>
              </a>

              <div className="tst-menu-button-frame">
                <button
                  className={`tst-menu-btn ${mobileMenu ? "tst-active" : ""}`}
                  onClick={handleMobileMenuToggle}
                  aria-expanded={mobileMenu}
                  aria-label={t("menu")}
                >
                  <div className="tst-burger">
                    <span></span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SearchOverlay isOpen={searchOpen} onClose={handleSearchClose} />

      <div
        id="reservation-popup"
        className={`tst-popup-bg ${reservationPopup ? "tst-active" : ""}`}
      >
        <div className="tst-popup-frame">
          <div className="tst-popup-body">
            <div className="tst-close-popup" onClick={handleReservationClose}>
              <i className="fas fa-times"></i>
            </div>

            <div className="text-center">
              <div className="tst-suptitle tst-suptitle-center"></div>
              <h4 className="tst-mb-60">{tc("reserveTable")}</h4>
            </div>

            {reservationPopup && <ReservationForm />}
          </div>
        </div>
      </div>
    </>
  );
});

DefaultHeader.displayName = "DefaultHeader";

export default DefaultHeader;