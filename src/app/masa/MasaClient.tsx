"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import styles from "../[locale]/table/table.module.scss";
import { MasaDrawer } from "./MasaDrawer";
import { MasaMasthead } from "./MasaMasthead";
import { MasaMenuList } from "./MasaMenuList";
import { MasaSessionOverlay } from "./MasaSessionOverlay";
import { MasaBottomNav } from "./MasaBottomNav";
import { normalizeTableId } from "./masaMenuUtils";
import { normalizeLocale, t } from "./masaTranslations";
import type { Locale } from "./masaTypes";
import { useMasaSession } from "./useMasaSession";
import { useWaiterCall } from "./useWaiterCall";
import { playClick, playPaperRustle } from "./masaAudioUtils";
import { MasaTasteWizard } from "./MasaTasteWizard";

interface MasaClientProps {
  initialLocale?: Locale;
}

export default function MasaClient({ initialLocale = "bg" }: MasaClientProps = {}) {
  const searchParams = useSearchParams();
  const vipSecret = searchParams.get("vip")?.trim() || "";
  const isVipLink = vipSecret.length > 0;
  const tableId = isVipLink ? "" : normalizeTableId(searchParams.get("id"));
  const qrKey = isVipLink ? "" : searchParams.get("key")?.trim() || "";
  const [locale, setLocale] = useState<Locale>(() =>
    normalizeLocale(searchParams.get("lang"), initialLocale),
  );
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [menuOpen, setMenuOpen] = useState(false);
  const now = useMemo(() => new Date(nowMs), [nowMs]);

  // Display mode settings ("both" | "icons" | "text") and Theme ("classic" | "brutalist" | "olive" | "terminal")
  const [displayMode, setDisplayMode] = useState<"both" | "icons" | "text">("both");
  const [theme, setTheme] = useState<"classic" | "brutalist" | "olive" | "terminal">("classic");
  const [layout, setLayout] = useState<"journal" | "cards" | "minimal">("journal");
  const [pageLayout, setPageLayout] = useState<"classic" | "modern" | "magazine">("classic");
  const [sessionTimeLeft, setSessionTimeLeft] = useState<number>(0);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [isFirstCategoryRender, setIsFirstCategoryRender] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showImages, setShowImages] = useState<boolean>(false);

  // Device orientation gyroscope tilt effect (3D tactile depth)
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event;
      if (beta === null || gamma === null) return;
      // Normalize angles into minor offset values (in pixels)
      const x = Math.min(8, Math.max(-8, gamma / 6));
      const y = Math.min(8, Math.max(-8, (beta - 45) / 6));

      document.documentElement.style.setProperty("--tilt-x", `${x}px`);
      document.documentElement.style.setProperty("--tilt-y", `${y}px`);
    };

    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  const {
    activeCategoryId,
    blockSession,
    menuData,
    notice,
    role,
    sessionState,
    setActiveCategoryId,
    token,
  } = useMasaSession({ locale, qrKey, tableId, vipSecret });

  const isVip = role === "vip";

  const { callState, callWaiter, cooldownSeconds, feedback } = useWaiterCall({
    blockSession,
    locale,
    nowMs,
    tableId,
    token,
  });

  // Web Audio API feedback for active category page turns
  useEffect(() => {
    if (isFirstCategoryRender) {
      setIsFirstCategoryRender(false);
      return;
    }
    playPaperRustle(soundEnabled);
  }, [activeCategoryId, isFirstCategoryRender, soundEnabled]);

  const categories = useMemo(
    () => [...(menuData?.categories ?? [])].sort((a, b) => a.order - b.order),
    [menuData],
  );

  const activeCategory = useMemo(
    () => categories.find((category) => category.id === activeCategoryId) ?? categories[0],
    [activeCategoryId, categories],
  );

  // Initialize displayMode, theme, layout, pageLayout and timer from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("deliorman.masa.displayMode");
      if (savedMode === "both" || savedMode === "icons" || savedMode === "text") {
        setDisplayMode(savedMode);
      }
      const savedTheme = localStorage.getItem("deliorman.masa.theme");
      if (savedTheme === "classic" || savedTheme === "brutalist" || savedTheme === "olive" || savedTheme === "terminal") {
        setTheme(savedTheme);
      }
      const savedLayout = localStorage.getItem("deliorman.masa.layout");
      if (savedLayout === "journal" || savedLayout === "cards" || savedLayout === "minimal") {
        setLayout(savedLayout);
      }
      const savedPageLayout = localStorage.getItem("deliorman.masa.pageLayout");
      if (savedPageLayout === "classic" || savedPageLayout === "modern" || savedPageLayout === "magazine") {
        setPageLayout(savedPageLayout);
      }
      const savedSound = localStorage.getItem("deliorman.masa.soundEnabled");
      if (savedSound !== null) {
        setSoundEnabled(savedSound === "true");
      }
      const savedImages = localStorage.getItem("deliorman.masa.showImages");
      if (savedImages !== null) {
        setShowImages(savedImages === "true");
      }
      const storedEnd = localStorage.getItem("deliorman.masa.waiterSessionEnd");
      if (storedEnd) {
        const endMs = Number(storedEnd);
        const remaining = Math.max(0, Math.ceil((endMs - Date.now()) / 1000));
        setSessionTimeLeft(remaining);
      }
    }
  }, []);

  const handleDisplayModeChange = (mode: "both" | "icons" | "text") => {
    playClick(soundEnabled);
    setDisplayMode(mode);
    localStorage.setItem("deliorman.masa.displayMode", mode);
  };

  const handleThemeChange = (newTheme: "classic" | "brutalist" | "olive" | "terminal") => {
    playClick(soundEnabled);
    setTheme(newTheme);
    localStorage.setItem("deliorman.masa.theme", newTheme);
  };

  const handleLayoutChange = (newLayout: "journal" | "cards" | "minimal") => {
    playClick(soundEnabled);
    setLayout(newLayout);
    localStorage.setItem("deliorman.masa.layout", newLayout);
  };

  const handlePageLayoutChange = (newPageLayout: "classic" | "modern" | "magazine") => {
    playClick(soundEnabled);
    setPageLayout(newPageLayout);
    localStorage.setItem("deliorman.masa.pageLayout", newPageLayout);
  };

  const handleSoundEnabledChange = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem("deliorman.masa.soundEnabled", String(enabled));
    if (enabled) {
      playClick(true);
    }
  };

  const handleShowImagesChange = (show: boolean) => {
    playClick(soundEnabled);
    setShowImages(show);
    localStorage.setItem("deliorman.masa.showImages", String(show));
  };

  // Waiter session timer tick
  useEffect(() => {
    if (sessionTimeLeft <= 0) return undefined;

    const interval = setInterval(() => {
      setSessionTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          localStorage.removeItem("deliorman.masa.waiterSessionEnd");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionTimeLeft]);

  const handleCallWaiter = async () => {
    playClick(soundEnabled);
    await callWaiter();
    const endMs = Date.now() + 15 * 60 * 1000;
    localStorage.setItem("deliorman.masa.waiterSessionEnd", String(endMs));
    setSessionTimeLeft(15 * 60);
  };

  useEffect(() => {
    document.body.classList.add("kiosk-mode");
    return () => {
      document.body.classList.remove("kiosk-mode");
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const buttonLabel = (() => {
    if (callState === "loading") return t(locale, "calling");
    if (feedback?.type === "success") return t(locale, "success");
    if (cooldownSeconds > 0) return `${t(locale, "cooldown")} ${cooldownSeconds}с`;
    return t(locale, "callWaiter");
  })();

  const themeClass =
    theme === "brutalist"
      ? styles.themeBrutalist
      : theme === "olive"
        ? styles.themeOlive
        : theme === "terminal"
          ? styles.themeTerminal
          : styles.themeClassic;

  const pageLayoutClass =
    pageLayout === "modern"
      ? styles.pageLayoutModern
      : pageLayout === "magazine"
        ? styles.pageLayoutMagazine
        : styles.pageLayoutClassic;

  return (
    <main className={`${styles.paper} ${themeClass} ${pageLayoutClass}`}>
      <div className={styles.sheet}>
        <MasaMasthead
          isVip={isVip}
          locale={locale}
          menuOpen={menuOpen}
          now={now}
          onOpenMenu={() => setMenuOpen(true)}
          styles={styles}
          tableId={tableId}
          pageLayout={pageLayout}
          showImages={showImages}
        />

        {sessionState !== "active" ? (
          <MasaSessionOverlay locale={locale} notice={notice} sessionState={sessionState} styles={styles} />
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory?.id || "empty"}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={{
                  initial: {
                    rotateY: 25,
                    opacity: 0,
                    x: 15,
                    skewY: 1,
                    transformOrigin: "left center",
                  },
                  animate: {
                    rotateY: 0,
                    opacity: 1,
                    x: 0,
                    skewY: 0,
                    transformOrigin: "left center",
                    transition: {
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                  exit: {
                    rotateY: -25,
                    opacity: 0,
                    x: -15,
                    skewY: -1,
                    transformOrigin: "left center",
                    transition: {
                      duration: 0.35,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
                style={{ perspective: 1000, transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
              >
                <MasaMenuList
                  activeCategory={activeCategory}
                  currency={menuData?.currency ?? "BGN"}
                  locale={locale}
                  layout={layout}
                  styles={styles}
                  pageLayout={pageLayout}
                  showImages={showImages}
                />
              </motion.div>
            </AnimatePresence>

            <footer className={styles.footer}>
              <p className={styles.menuTipText}>
                💡 {t(locale, "menuTip")}
              </p>
              <div className={styles.ornament} aria-hidden="true">
                ❦ · ❦ · ❦
              </div>
              <div className={styles.rule} />
              <p className={styles.colophon}>{t(locale, "colophon")}</p>
              <p className={styles.footerCredit}>
                <a href="https://portfolio.melihzafer.me" target="_blank" rel="noopener noreferrer">
                  Powered by Melih Hyusein
                </a>
              </p>
            </footer>
          </>
        )}
      </div>

      {menuOpen ? (
        <MasaDrawer
          locale={locale}
          onClose={() => setMenuOpen(false)}
          onLocaleChange={setLocale}
          displayMode={displayMode}
          onDisplayModeChange={handleDisplayModeChange}
          theme={theme}
          onThemeChange={handleThemeChange}
          layout={layout}
          onLayoutChange={handleLayoutChange}
          pageLayout={pageLayout}
          onPageLayoutChange={handlePageLayoutChange}
          styles={styles}
          soundEnabled={soundEnabled}
          onSoundEnabledChange={handleSoundEnabledChange}
          showImages={showImages}
          onShowImagesChange={handleShowImagesChange}
        />
      ) : null}

      {sessionState === "active" ? (
        <MasaBottomNav
          categories={categories}
          activeCategoryId={activeCategory?.id}
          onSelectCategory={(catId) => {
            playClick(soundEnabled);
            setActiveCategoryId(catId);
          }}
          locale={locale}
          displayMode={displayMode}
          sessionTimeLeft={sessionTimeLeft}
          buttonLabel={buttonLabel}
          disabled={!token || callState === "loading" || cooldownSeconds > 0}
          onCallWaiter={handleCallWaiter}
          feedback={feedback}
          isVip={isVip}
          styles={styles}
        />
      ) : null}

      {sessionState === "active" ? (
        <button
          type="button"
          className={styles.tasteWizardFloatBtn}
          onClick={() => {
            playClick(soundEnabled);
            setWizardOpen(true);
          }}
          aria-label={t(locale, "wizardTitle")}
        >
          <Sparkles size={20} />
        </button>
      ) : null}

      {wizardOpen ? (
        <MasaTasteWizard
          categories={categories}
          activeCategory={activeCategory}
          currency={menuData?.currency ?? "BGN"}
          locale={locale}
          onClose={() => {
            playClick(soundEnabled);
            setWizardOpen(false);
          }}
          styles={styles}
          soundEnabled={soundEnabled}
          sessionToken={token}
        />
      ) : null}
    </main>
  );
}
