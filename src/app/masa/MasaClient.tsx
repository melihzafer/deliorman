"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, BellRing, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import styles from "../[locale]/table/menu.module.scss";
import wizardStyles from "../[locale]/table/table.module.scss";
import { MasaDrawer } from "./MasaDrawer";
import { MasaMasthead } from "./MasaMasthead";
import { MasaCategoryBar } from "./MasaCategoryBar";
import { MasaMenuList } from "./MasaMenuList";
import { MasaSessionOverlay } from "./MasaSessionOverlay";
import { normalizeTableId } from "./masaMenuUtils";
import { normalizeLocale, t } from "./masaTranslations";
import type { Locale } from "./masaTypes";
import { useMasaSession } from "./useMasaSession";
import { useWaiterCall } from "./useWaiterCall";
import { playClick } from "./masaAudioUtils";
import { MasaTasteWizard } from "./MasaTasteWizard";

interface MasaClientProps {
  initialLocale?: Locale;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function MasaClient({ initialLocale = "bg" }: MasaClientProps = {}) {
  const searchParams = useSearchParams();
  const vipSecret = searchParams.get("vip")?.trim() || "";
  const isVipLink = vipSecret.length > 0;
  const tableId = isVipLink ? "" : normalizeTableId(searchParams.get("id"));

  const [locale, setLocale] = useState<Locale>(() =>
    normalizeLocale(searchParams.get("lang"), initialLocale),
  );
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [menuOpen, setMenuOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showImages, setShowImages] = useState(true);

  const reduceMotion = useReducedMotion();

  const {
    activeCategoryId,
    blockSession,
    menuData,
    notice,
    role,
    sessionState,
    sessionExpiresAt,
    setActiveCategoryId,
    token,
  } = useMasaSession({ locale, tableId, vipSecret });

  const isVip = role === "vip";

  const { callState, callWaiter, cooldownSeconds, feedback, isEnabled: isWaiterCallEnabled } = useWaiterCall({
    blockSession,
    locale,
    nowMs,
    tableId,
    token,
  });

  const categories = useMemo(
    () => [...(menuData?.categories ?? [])].sort((a, b) => a.order - b.order),
    [menuData],
  );

  const activeCategory = useMemo(
    () => categories.find((category) => category.id === activeCategoryId) ?? categories[0],
    [activeCategoryId, categories],
  );

  // Restore the diner's display preferences.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedSound = localStorage.getItem("deliorman.masa.soundEnabled");
    if (savedSound !== null) setSoundEnabled(savedSound === "true");
    const savedImages = localStorage.getItem("deliorman.masa.showImages");
    if (savedImages !== null) setShowImages(savedImages === "true");
  }, []);

  const handleSoundEnabledChange = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem("deliorman.masa.soundEnabled", String(enabled));
    if (enabled) playClick(true);
  };

  const handleShowImagesChange = (show: boolean) => {
    playClick(soundEnabled);
    setShowImages(show);
    localStorage.setItem("deliorman.masa.showImages", String(show));
  };

  const handleCallWaiter = async () => {
    playClick(soundEnabled);
    await callWaiter();
  };

  // Kiosk body flag (consumed by global styles) + clock tick for cooldown math.
  useEffect(() => {
    document.body.classList.add("kiosk-mode");
    return () => document.body.classList.remove("kiosk-mode");
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const isCoolingDown = cooldownSeconds > 0;
  const callDisabled = !token || callState === "loading" || isCoolingDown;
  const sessionActive = sessionState === "active";
  const sessionMinutes = sessionExpiresAt
    ? Math.max(1, Math.ceil((sessionExpiresAt - nowMs) / 60_000))
    : 0;
  const sessionNotice = sessionMinutes
    ? t(locale, "sessionInfo").replace("{minutes}", String(sessionMinutes))
    : "";

  const fade = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
      };

  return (
    <div className={styles.page}>
      <div className={styles.stickyTop}>
        <MasaMasthead
          isVip={isVip}
          locale={locale}
          menuOpen={menuOpen}
          onOpenMenu={() => setMenuOpen(true)}
          onLocaleChange={setLocale}
          styles={styles}
          tableId={tableId}
        />

        {sessionActive ? (
          <MasaCategoryBar
            categories={categories}
            activeCategoryId={activeCategory?.id}
            onSelectCategory={(catId) => {
              playClick(soundEnabled);
              setActiveCategoryId(catId);
            }}
            locale={locale}
            styles={styles}
          />
        ) : null}
      </div>

      <div className={styles.shell}>
        {!sessionActive ? (
          <MasaSessionOverlay
            locale={locale}
            notice={notice}
            sessionState={sessionState}
            styles={styles}
          />
        ) : (
          <>
            <div className={styles.main}>
              {sessionNotice && !isVip ? (
                <p className={styles.sessionNotice} role="status">
                  {sessionNotice}
                </p>
              ) : null}

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory?.id || "empty"}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={fade}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <MasaMenuList
                    activeCategory={activeCategory}
                    currency={menuData?.currency ?? "EUR"}
                    locale={locale}
                    styles={styles}
                    showImages={showImages}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <footer className={styles.footer}>
              <p className={styles.footerNote}>{t(locale, "colophon")}</p>
              <p className={styles.footerCredit}>
                <a href="https://portfolio.melihzafer.me" target="_blank" rel="noopener noreferrer">
                  Powered by Melih Hyusein
                </a>
              </p>
            </footer>
          </>
        )}
      </div>

      {/* Feedback toast — closes the Gulf of Evaluation after a waiter call. */}
      {sessionActive && feedback && !isVip ? (
        <div
          className={`${styles.toast} ${feedback.type === "success" ? styles.toastOk : styles.toastErr}`}
          role="status"
        >
          {feedback.text}
        </div>
      ) : null}

      {/* Floating actions — primary (call) + secondary (wizard) in the thumb zone. */}
      {sessionActive && !wizardOpen ? (
        <div className={styles.fabZone}>
          <button
            type="button"
            className={styles.wizardFab}
            onClick={() => {
              playClick(soundEnabled);
              setWizardOpen(true);
            }}
            aria-label={t(locale, "wizardTitle")}
          >
            <Sparkles size={22} aria-hidden="true" />
          </button>

          {!isVip && isWaiterCallEnabled ? (
            <button
              type="button"
              className={`${styles.callFab} ${isCoolingDown ? styles.callFabBusy : ""}`}
              onClick={handleCallWaiter}
              disabled={callDisabled}
            >
              {callState === "loading" ? (
                <Loader2 size={20} className={styles.spin} aria-hidden="true" />
              ) : isCoolingDown ? (
                <Check size={20} aria-hidden="true" />
              ) : (
                <BellRing size={20} aria-hidden="true" />
              )}
              <span className={styles.callFabText}>
                {callState === "loading"
                  ? t(locale, "calling")
                  : isCoolingDown
                    ? formatTime(cooldownSeconds)
                    : t(locale, "callWaiter")}
              </span>
            </button>
          ) : null}
        </div>
      ) : null}

      {menuOpen ? (
        <MasaDrawer
          locale={locale}
          onClose={() => setMenuOpen(false)}
          onLocaleChange={setLocale}
          styles={styles}
          soundEnabled={soundEnabled}
          onSoundEnabledChange={handleSoundEnabledChange}
          showImages={showImages}
          onShowImagesChange={handleShowImagesChange}
        />
      ) : null}

      {wizardOpen ? (
        <MasaTasteWizard
          categories={categories}
          activeCategory={activeCategory}
          currency={menuData?.currency ?? "EUR"}
          locale={locale}
          onClose={() => {
            playClick(soundEnabled);
            setWizardOpen(false);
          }}
          styles={wizardStyles}
          soundEnabled={soundEnabled}
          sessionToken={token}
        />
      ) : null}
    </div>
  );
}
