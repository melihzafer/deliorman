"use client";

import { useState, useTransition, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import s from "./QrMenuMagazine.module.scss";

const PULL_QUOTES = [
  {
    text: "\u201EГотвим с любов, поднасяме с гордост \u2014 всяко ястие разказва история от Лудогорието.\u201C",
    cite: "\u2014 Ресторант Делиорман",
  },
  {
    text: "\u201EТрадицията е в основата на всяко наше ястие \u2014 вкусът на дома, поднесен с грижа.\u201C",
    cite: "\u2014 Ресторант Делиорман",
  },
];

function formatPrice(price) {
  if (price == null) return "";
  return `${price.toFixed(2)} лв.`;
}

function MenuItem({ item, staggerIndex }) {
  const staggerClass = staggerIndex <= 7 ? s[`stagger${staggerIndex}`] : "";

  return (
    <div className={`${s.menuItem} ${s.fadeUp} ${staggerClass}`}>
      <div className={s.menuItemTop}>
        <span className={s.menuItemName}>{item.title}</span>
        <span className={s.menuItemDots} />
        <span className={s.menuItemPrice}>{formatPrice(item.price)}</span>
      </div>
      {item.text && <div className={s.menuItemDesc}>{item.text}</div>}
      {item.amount && (
        <div className={s.menuItemMeta}>
          <span className={s.metaTag}>{item.amount}</span>
        </div>
      )}
    </div>
  );
}

/** Renders a single category spread (section header + items) */
function CategorySpread({ category, categoryIndex }) {
  const items = category?.items || [];
  const midpoint = Math.ceil(items.length / 2);
  const leftItems = items.slice(0, midpoint);
  const rightItems = items.slice(midpoint);
  const quote = PULL_QUOTES[categoryIndex % PULL_QUOTES.length];

  return (
    <div className={s.spread}>
      {/* Left Page */}
      <div className={`${s.page} ${s.pageLeft}`}>
        <div className={`${s.cornerFlourish} ${s.topLeft}`} />

        <div className={`${s.sectionHeader} ${s.fadeUp} ${s.stagger0}`}>
          <div className={s.sectionLabel}>{category.subtitle}</div>
          <h2 className={s.sectionTitle}>{category.name}</h2>
          <div className={s.sectionLine} />
        </div>

        {leftItems.map((item, i) => (
          <MenuItem key={`${categoryIndex}-l-${i}`} item={item} staggerIndex={i + 1} />
        ))}

        <div className={`${s.cornerFlourish} ${s.bottomRight}`} />
      </div>

      {/* Right Page */}
      <div className={`${s.page} ${s.pageRight}`}>
        <div className={`${s.cornerFlourish} ${s.topRight}`} />

        {category.description && (
          <div className={`${s.pullQuote} ${s.fadeUp} ${s.stagger0}`}>
            <p>{category.description}</p>
          </div>
        )}

        {rightItems.map((item, i) => (
          <MenuItem key={`${categoryIndex}-r-${i}`} item={item} staggerIndex={i + 1} />
        ))}

        {rightItems.length > 3 && (
          <>
            <div className={s.dividerOrnament}><span>◆</span></div>
            <div className={`${s.pullQuote} ${s.fadeUp} ${s.stagger5}`}>
              <p>{quote.text}</p>
              <cite>{quote.cite}</cite>
            </div>
          </>
        )}

        <div className={`${s.cornerFlourish} ${s.bottomRight}`} />
      </div>
    </div>
  );
}

export default function QrMenuMagazine({ categories, restaurantName }) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [isPending, startTransition] = useTransition();
  const navRef = useRef(null);
  const tabRefs = useRef([]);
  const swiperRef = useRef(null);
  const router = useRouter();

  const scrollActiveTabIntoView = useCallback((index) => {
    const tab = tabRefs.current[index];
    const nav = navRef.current;
    if (!tab || !nav) return;

    const navRect = nav.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();

    if (tabRect.left < navRect.left || tabRect.right > navRect.right) {
      tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, []);

  const handleCategoryChange = useCallback((index) => {
    // Sync swiper
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
    startTransition(() => {
      setActiveCategory(index);
    });
    scrollActiveTabIntoView(index);
  }, [scrollActiveTabIntoView]);

  const handleSlideChange = useCallback((swiper) => {
    startTransition(() => {
      setActiveCategory(swiper.activeIndex);
    });
    scrollActiveTabIntoView(swiper.activeIndex);
  }, [scrollActiveTabIntoView]);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  // Scroll overlay to top when category changes
  const overlayRef = useRef(null);
  useEffect(() => {
    overlayRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategory]);

  const category = categories[activeCategory];

  return (
    <div className={s.overlay} ref={overlayRef}>
      {/* Close button */}
      <button
        className={s.closeBtn}
        onClick={handleClose}
        aria-label="Затвори менюто"
      >
        ✕
      </button>

      {/* Magazine Header - desktop only */}
      <header className={`${s.magazineHeader} ${s.desktopOnly}`}>
        <div className={s.eyebrow}>Ресторант {restaurantName}</div>
        <h1 className={s.title}>Нашето Меню</h1>
        <div className={s.goldRule} />
        <div className={s.subtitle}>
          Автентична българска кухня в сърцето на Лудогорието
        </div>
      </header>

      {/* Mobile Header - compact sticky bar */}
      <div className={`${s.mobileHeader} ${s.mobileOnly}`}>
        <span className={s.mobileHeaderTitle}>{category?.name}</span>
        <div className={s.mobileHeaderLine} />
      </div>

      {/* Category Nav */}
      <nav className={s.categoryNav} ref={navRef}>
        {categories.map((cat, i) => (
          <button
            key={cat.slug}
            ref={(el) => { tabRefs.current[i] = el; }}
            className={`${s.catTab} ${i === activeCategory ? s.catTabActive : ""}`}
            onClick={() => handleCategoryChange(i)}
          >
            {cat.name}
          </button>
        ))}
      </nav>

      {/* Swiper Magazine Spread */}
      <div className={s.magazine}>
        <Swiper
          ref={swiperRef}
          slidesPerView={1}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={600}
          onSlideChange={handleSlideChange}
          className={s.swiperContainer}
          autoHeight={true}
          style={{ opacity: isPending ? 0.7 : 1, transition: "opacity 0.2s" }}
        >
          {categories.map((cat, i) => (
            <SwiperSlide key={cat.slug}>
              <CategorySpread category={cat} categoryIndex={i} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Page Dots Footer */}
      <div className={s.magazineFooter}>
        <p>Плъзни или избери категория</p>
        <div className={s.pageDots}>
          {categories.map((cat, i) => (
            <button
              key={cat.slug}
              className={`${s.pageDot} ${i === activeCategory ? s.pageDotActive : ""}`}
              onClick={() => handleCategoryChange(i)}
              aria-label={cat.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
