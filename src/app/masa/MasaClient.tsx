"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import styles from "../[locale]/table/table.module.scss";
import { MasaDrawer } from "./MasaDrawer";
import { MasaMasthead } from "./MasaMasthead";
import { MasaMenuList } from "./MasaMenuList";
import { MasaSessionOverlay } from "./MasaSessionOverlay";
import { MasaStopPress } from "./MasaStopPress";
import { normalizeTableId } from "./masaMenuUtils";
import { normalizeLocale, t } from "./masaTranslations";
import type { Locale } from "./masaTypes";
import { useMasaSession } from "./useMasaSession";
import { useWaiterCall } from "./useWaiterCall";

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

  const categories = useMemo(
    () => [...(menuData?.categories ?? [])].sort((a, b) => a.order - b.order),
    [menuData],
  );

  const activeCategory = useMemo(
    () => categories.find((category) => category.id === activeCategoryId) ?? categories[0],
    [activeCategoryId, categories],
  );

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

  return (
    <main className={styles.paper}>
      <div className={styles.sheet}>
        <MasaMasthead
          isVip={isVip}
          locale={locale}
          menuOpen={menuOpen}
          now={now}
          onOpenMenu={() => setMenuOpen(true)}
          styles={styles}
          tableId={tableId}
        />

        {sessionState !== "active" ? (
          <MasaSessionOverlay locale={locale} notice={notice} sessionState={sessionState} styles={styles} />
        ) : (
          <>
            <MasaMenuList
              activeCategory={activeCategory}
              currency={menuData?.currency ?? "BGN"}
              locale={locale}
              styles={styles}
            />

            <footer className={styles.footer}>
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
          activeCategoryId={activeCategory?.id}
          categories={categories}
          locale={locale}
          onClose={() => setMenuOpen(false)}
          onLocaleChange={setLocale}
          onSelectCategory={(categoryId) => {
            setActiveCategoryId(categoryId);
            setMenuOpen(false);
          }}
          styles={styles}
        />
      ) : null}

      {sessionState === "active" && !isVip ? (
        <MasaStopPress
          buttonLabel={buttonLabel}
          disabled={!token || callState === "loading" || cooldownSeconds > 0}
          feedback={feedback}
          onCallWaiter={callWaiter}
          styles={styles}
        />
      ) : null}
    </main>
  );
}
