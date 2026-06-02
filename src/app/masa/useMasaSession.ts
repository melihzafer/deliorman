import { useCallback, useEffect, useRef, useState } from "react";

import { isLocalTestHost, PING_INTERVAL_MS, SESSION_KEY_PREFIX } from "./masaConstants";
import { t } from "./masaTranslations";
import type { Locale, QrMenuData, SessionState } from "./masaTypes";

interface UseMasaSessionParams {
  locale: Locale;
  qrKey: string;
  tableId: string;
}

export function useMasaSession({ locale, qrKey, tableId }: UseMasaSessionParams) {
  const [sessionState, setSessionState] = useState<SessionState>("loading");
  const [token, setToken] = useState("");
  const [menuData, setMenuData] = useState<QrMenuData | null>(null);
  const [notice, setNotice] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const localeRef = useRef(locale);
  const sessionKey = tableId ? `${SESSION_KEY_PREFIX}.${tableId}` : "";

  const blockSession = useCallback(
    (message: string) => {
      setToken("");
      setMenuData(null);
      setSessionState("blocked");
      setNotice(message);
      if (sessionKey) sessionStorage.removeItem(sessionKey);
    },
    [sessionKey],
  );

  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  useEffect(() => {
    let cancelled = false;

    async function startSession() {
      const allowLocalTestSession = isLocalTestHost();
      if (!tableId || (!qrKey && !allowLocalTestSession)) {
        blockSession(t(localeRef.current, "invalid"));
        return;
      }

      setSessionState("loading");
      setNotice("");

      try {
        const sessionRes = await fetch("/api/session/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tableId, key: qrKey }),
        });
        if (cancelled) return;

        if (!sessionRes.ok) {
          blockSession(t(localeRef.current, "invalid"));
          return;
        }

        const session = (await sessionRes.json()) as { token?: string };
        if (cancelled) return;
        if (!session.token) {
          blockSession(t(localeRef.current, "invalid"));
          return;
        }

        const menuRes = await fetch("/data/menu.json", { cache: "no-store" });
        if (cancelled) return;
        if (!menuRes.ok) {
          blockSession(t(localeRef.current, "menuLoadError"));
          return;
        }

        const menu = (await menuRes.json()) as QrMenuData;
        if (cancelled) return;

        sessionStorage.setItem(sessionKey, session.token);
        setToken(session.token);
        setMenuData(menu);
        setActiveCategoryId(menu.categories?.[0]?.id ?? "");
        setSessionState("active");
      } catch (err) {
        console.error("[masa] start failed:", err);
        if (!cancelled) blockSession(t(localeRef.current, "invalid"));
      }
    }

    startSession();
    return () => {
      cancelled = true;
    };
  }, [blockSession, qrKey, sessionKey, tableId]);

  useEffect(() => {
    if (!token || sessionState !== "active") return undefined;

    const ping = async () => {
      try {
        const res = await fetch("/api/session/ping", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
          keepalive: true,
        });
        if (res.status === 401) {
          blockSession(t(locale, "expired"));
        }
      } catch (err) {
        console.error("[masa] ping failed:", err);
      }
    };

    const interval = setInterval(ping, PING_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") void ping();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [blockSession, locale, sessionState, token]);

  return {
    activeCategoryId,
    blockSession,
    menuData,
    notice,
    sessionState,
    setActiveCategoryId,
    token,
  };
}
