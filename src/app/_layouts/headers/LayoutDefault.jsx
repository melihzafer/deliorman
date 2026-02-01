"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useTransition, useCallback, memo } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

import { OnePageMenu } from "@common/onepageMenu";
import AppData from "@data/app.json";

/**
 * Lazy load ReservationForm - only loaded when popup opens
 * This prevents the form's JavaScript from blocking the main thread
 */
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
        <p style={{ color: "#666" }}>Зареждане...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    ),
  }
);

/**
 * DefaultHeader - Optimized header component
 * Uses useTransition for non-blocking state updates and lazy loading for popups
 */
const DefaultHeader = memo(() => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [miniCart, setMiniCart] = useState(false);
  const [reservationPopup, setReservationPopup] = useState(false);
  const [isPending, startTransition] = useTransition();
  const asPath = usePathname();

  // Memoized path check function
  const isPathActive = useCallback(
    (path) => {
      return (asPath.endsWith(path) == 1 && path !== "/") || asPath === path;
    },
    [asPath]
  );

  // Memoized handlers with useTransition for non-blocking updates
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

  // Reset menu states on route change
  useEffect(() => {
    setMobileMenu(false);
    setMiniCart(false);
    setReservationPopup(false);
    setOpenSubMenu(false);
  }, [asPath]);

  // Initialize onepage menu if needed
  useEffect(() => {
    if (isPathActive("onepage")) {
      OnePageMenu();
    }
  }, [isPathActive]);

  return (
    <>
      {/* top bar frame */}
      <div className="tst-menu-frame">
        {/* top bar */}
        <div className="tst-dynamic-menu" id="tst-dynamic-menu">
          <div className="tst-menu">
            {/* logo - Using Next.js Image for optimization */}
            <Link href="/">
              <Image
                src={AppData.header.logo.image}
                className="tst-logo"
                alt={AppData.header.logo.alt}
                width={120}
                height={40}
                priority
              />
            </Link>
            {/* menu */}
            <nav className={`${mobileMenu ? "tst-active" : ""}`}>
              {isPathActive("onepage") ? (
                <ul>
                  {AppData.header.onepage.map((item, index) => (
                    <li
                      key={`header-menu-onepage-item-${index}`}
                      className={index == 0 ? "current-menu-item" : ""}
                    >
                      <a data-no-swup href={item.link}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul>
                  {AppData.header.menu.map((item, index) => (
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
                            : null
                        }
                      >
                        {item.label}
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
                              {subitem.link == "/onepage" ? (
                                <a href={subitem.link} target="_blank">
                                  {subitem.label}
                                </a>
                              ) : (
                                <Link href={subitem.link}>{subitem.label}</Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </nav>
            {/* menu end */}
            {/* top bar right */}
            <div className="tst-menu-right">
              {/* menu button */}
              <div className="tst-menu-button-frame">
                <div
                  className={`tst-menu-btn ${mobileMenu ? "tst-active" : ""}`}
                  onClick={handleMobileMenuToggle}
                >
                  <div className="tst-burger">
                    <span></span>
                  </div>
                </div>
              </div>
              {/* menu button end */}

              {/* reservation popup button (far right) */}
              <a
                href="#."
                className={`tst-btn tst-res-btn tst-btn-icon ${
                  reservationPopup ? "tst-active" : ""
                }`}
                aria-controls="reservation-popup"
                aria-expanded={reservationPopup ? "true" : "false"}
                aria-label="Резервации"
                onClick={handleReservationToggle}
                data-no-swup
              >
                <span className="tst-icon" aria-hidden="true">
                  <i className="fas fa-calendar-check"></i>
                </span>
                <span className="sr-only">Резервации</span>
              </a>
            </div>
            {/* top bar right end  */}
          </div>
        </div>
        {/* top bar end */}
      </div>
      {/* top bar frame */}

      {/* popup */}
      <div
        id="reservation-popup"
        className={`tst-popup-bg ${reservationPopup ? "tst-active" : ""}`}
      >
        <div className="tst-popup-frame">
          <div className="tst-popup-body">
            <div className="tst-close-popup" onClick={handleReservationClose}>
              <i className="fas fa-times"></i>
            </div>

            {/* title */}
            <div className="text-center">
              <div className="tst-suptitle tst-suptitle-center"></div>
              <h4 className="tst-mb-60">Резервация на маса</h4>
            </div>
            {/* title end */}

            {/* Only render form when popup is open - prevents unnecessary loading */}
            {reservationPopup && <ReservationForm />}
          </div>
        </div>
      </div>
      {/* popup end */}
    </>
  );
});

DefaultHeader.displayName = "DefaultHeader";

export default DefaultHeader;
