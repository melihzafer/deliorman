"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/src/i18n/navigation";
import { getRestaurantPhoneHref } from "@library/siteContact";
import styles from "./MobileBottomNav.module.scss";

const restaurantPhoneHref = getRestaurantPhoneHref();

export default function MobileBottomNav() {
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const navItems = [
    {
      href: "/",
      icon: "fas fa-home",
      label: tNav("home"),
      matchExact: true,
    },
    {
      href: "/menu",
      icon: "fas fa-utensils",
      label: tNav("menu"),
    },
    {
      href: "/reservation",
      icon: "fas fa-calendar-check",
      label: tNav("reservation"),
    },
    {
      href: restaurantPhoneHref,
      icon: "fas fa-phone-alt",
      label: tNav("call"),
      isExternal: true,
      className: "phone",
    },
    {
      href: "/gallery",
      icon: "fas fa-images",
      label: tNav("gallery"),
    },
  ];

  const cleanPath = pathname || "/";

  return (
    <nav className={styles.wrapper} aria-label={tCommon("mobileNavigation")}>
      <ul className={styles.nav}>
        {navItems.map(({ href, icon, label, matchExact, isExternal, className }) => {
          const isActive = matchExact
            ? cleanPath === href
            : cleanPath.startsWith(href);

          const linkClasses = [
            styles.link,
            isActive ? styles.active : "",
            className ? styles[className] : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <li key={href} className={styles.item}>
              {isExternal ? (
                <a href={href} className={linkClasses} aria-label={label}>
                  <span className={styles.icon} aria-hidden="true">
                    <i className={icon}></i>
                  </span>
                  <span className={styles.label}>{label}</span>
                </a>
              ) : (
                <Link href={href} className={linkClasses} aria-label={label}>
                  <span className={styles.icon} aria-hidden="true">
                    <i className={icon}></i>
                  </span>
                  <span className={styles.label}>{label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
