import React from "react";
import {
  Coffee,
  Leaf,
  Soup,
  Pizza,
  Flame,
  Fish,
  UtensilsCrossed,
  Sparkles,
  Cookie,
  Beer,
  Utensils,
  Clock,
  BellRing
} from "lucide-react";
import { localized } from "./masaMenuUtils";
import { t } from "./masaTranslations";
import type { Locale, MasaStyles, QrMenuCategory, WaiterFeedback } from "./masaTypes";

interface MasaBottomNavProps {
  categories: QrMenuCategory[];
  activeCategoryId: string | undefined;
  onSelectCategory: (categoryId: string) => void;
  locale: Locale;
  displayMode: "both" | "icons" | "text";
  sessionTimeLeft: number; // in seconds
  buttonLabel: string;
  disabled: boolean;
  onCallWaiter: () => void;
  feedback: WaiterFeedback;
  isVip: boolean;
  styles: MasaStyles;
}

function BurgerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 11c0-4 4-6 9-6s9 2 9 6H3ZM2 15h20M3 18h18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      <path d="M5 15a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
    </svg>
  );
}

function ColdAppetizersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <ellipse cx="12" cy="14" rx="9" ry="6" />
      <path d="M6 14s2-3 6-3 6 3 6 3" />
      <circle cx="9" cy="13" r="1" />
      <circle cx="15" cy="13" r="1" />
    </svg>
  );
}

function RakiaIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 3h12l-1.5 17a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2L6 3Z" />
      <path d="M7 11h10" />
    </svg>
  );
}

function WinesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 22h8M12 15v7M16.5 3.5c0 4.5-2.5 8.5-4.5 8.5s-4.5-4-4.5-8.5C7.5 2.5 9 2 12 2s4.5.5 4.5 1.5Z" />
      <path d="M8 8h8" />
    </svg>
  );
}

function WhiskeyVodkaIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 3h12l-1 16a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 3Z" />
      <path d="M6.5 14h11" />
      <rect x="9" y="8" width="5" height="5" rx="1" transform="rotate(15 11.5 10.5)" />
    </svg>
  );
}

function AllergensIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

const categoryIcons: Record<string, React.ComponentType<any>> = {
  "hot-beverages": Coffee,
  "salads": Leaf,
  "hot-appetizers": UtensilsCrossed,
  "soups-sandwiches": Soup,
  "pizzas": Pizza,
  "grill": Flame,
  "saj-fish-specialties": Fish,
  "burgers": BurgerIcon,
  "new-specialties": Sparkles,
  "cold-appetizers-sides": ColdAppetizersIcon,
  "nuts-desserts": Cookie,
  "rakia": RakiaIcon,
  "wines": WinesIcon,
  "beer-cider-other-drinks": Beer,
  "whiskey-vodka": WhiskeyVodkaIcon,
  "allergens": AllergensIcon,
};

function getCategoryIcon(categoryId: string) {
  return categoryIcons[categoryId] || Utensils;
}

export function MasaBottomNav({
  categories,
  activeCategoryId,
  onSelectCategory,
  locale,
  displayMode,
  sessionTimeLeft,
  buttonLabel,
  disabled,
  onCallWaiter,
  feedback,
  isVip,
  styles,
}: MasaBottomNavProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const getTimelineMessage = (seconds: number) => {
    if (seconds <= 0) return "";
    if (seconds > 840) {
      return locale === "bg" ? "Повикването е прието..." : locale === "tr" ? "Çağrı alındı..." : "Request sent...";
    }
    if (seconds > 300) {
      return locale === "bg" ? "Персоналът се подготвя..." : locale === "tr" ? "Hazırlanıyor..." : "Staff preparing...";
    }
    return locale === "bg" ? "Сервитьорът идва с усмивка!" : locale === "tr" ? "Garson geliyor!" : "Waiter is coming!";
  };

  return (
    <div className={styles.bottomNavContainer}>
      {feedback && !isVip ? (
        <div className={`${styles.message} ${feedback.type === "success" ? styles.messageOk : styles.messageErr}`} style={{ width: "100%", maxWidth: "820px", margin: "0 auto 4px auto" }}>
          {feedback.text}
        </div>
      ) : null}

      {!isVip ? (
        <div className={styles.timerCallRow}>
          <div className={styles.timerWrapper}>
            <Clock className={styles.timerIcon} size={16} />
            <div className={styles.timerTextGroup}>
              <span className={styles.timerDigits}>
                {sessionTimeLeft > 0 ? formatTime(sessionTimeLeft) : "15:00"}
              </span>
              {sessionTimeLeft > 0 ? (
                <span className={styles.timerMessage}>{getTimelineMessage(sessionTimeLeft)}</span>
              ) : (
                <span className={styles.timerMessage}>{t(locale, "timerReady")}</span>
              )}
            </div>
          </div>

          <button
            type="button"
            className={styles.miniCallBtn}
            onClick={onCallWaiter}
            disabled={disabled || sessionTimeLeft > 0}
          >
            <BellRing size={14} />
            <span>{sessionTimeLeft > 0 ? t(locale, "calling") : buttonLabel}</span>
          </button>
        </div>
      ) : null}

      <div className={`${styles.categoryBottomNav} ${displayMode === "icons" ? styles.navMode_icons : displayMode === "text" ? styles.navMode_text : ""}`}>
        {categories.map((category) => {
          const IconComponent = getCategoryIcon(category.id);
          const isActive = activeCategoryId === category.id;

          return (
            <button
              key={category.id}
              type="button"
              className={`${styles.categoryNavItem} ${isActive ? styles.categoryNavItemActive : ""}`}
              onClick={() => onSelectCategory(category.id)}
            >
              <IconComponent className={styles.navIcon} />
              <span className={styles.navLabel}>{localized(category.title, locale)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
