"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./MobileBottomNav.module.scss";

const NAV_ITEMS = [
  {
    href: "/",
    icon: "fas fa-home",
    label: "Начало",
    matchExact: true,
  },
  {
    href: "/menu",
    icon: "fas fa-utensils",
    label: "Меню",
  },
  {
    href: "/reservation",
    icon: "fas fa-calendar-check",
    label: "Резервация",
  },
  {
    href: "tel:+35984756146",
    icon: "fas fa-phone-alt",
    label: "Обади се",
    isExternal: true,
    className: "phone",
  },
  {
    href: "/gallery",
    icon: "fas fa-images",
    label: "Галерия",
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Strip locale prefix for path matching (e.g., "/bg/menu" → "/menu")
  const cleanPath = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";

  return (
    <nav className={styles.wrapper} aria-label="Мобилна навигация">
      <ul className={styles.nav}>
        {NAV_ITEMS.map(({ href, icon, label, matchExact, isExternal, className }) => {
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
