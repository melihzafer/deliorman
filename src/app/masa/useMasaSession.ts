import { useCallback, useEffect, useRef, useState } from "react";

import { PING_INTERVAL_MS, SESSION_KEY_PREFIX } from "./masaConstants";
import { t } from "./masaTranslations";
import type { Locale, QrMenuData, SessionState } from "./masaTypes";

export type MasaRole = "guest" | "vip";

interface UseMasaSessionParams {
  locale: Locale;
  tableId: string;
  vipSecret: string;
}

interface StartResponse {
  expiresInSeconds?: number;
  token?: string;
  role?: MasaRole;
}

export function useMasaSession({ locale, tableId, vipSecret }: UseMasaSessionParams) {
  const [sessionState, setSessionState] = useState<SessionState>("loading");
  const [token, setToken] = useState("");
  const [role, setRole] = useState<MasaRole>("guest");
  const [menuData, setMenuData] = useState<QrMenuData | null>(null);
  const [notice, setNotice] = useState("");
  const [sessionExpiresAt, setSessionExpiresAt] = useState(0);
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const localeRef = useRef(locale);
  const sessionKey = tableId
    ? `${SESSION_KEY_PREFIX}.${tableId}`
    : vipSecret
      ? `${SESSION_KEY_PREFIX}.vip`
      : "";

  const blockSession = useCallback(
    (message: string) => {
      setToken("");
      setMenuData(null);
      setSessionExpiresAt(0);
      setSessionState("blocked");
      setNotice(message);
      if (sessionKey) sessionStorage.removeItem(sessionKey);
    },
    [sessionKey],
  );

  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  // NEW EFFECT: Load menu directly and active session bypassing server session verification
  useEffect(() => {
    let cancelled = false;

    async function loadMenuDirectly() {
      setSessionState("loading");
      setNotice("");
      try {
        const menuRes = await fetch("/data/menu.json", { cache: "no-store" });
        if (cancelled) return;
        if (!menuRes.ok) {
          blockSession(t(localeRef.current, "menuLoadError"));
          return;
        }
        const menu = (await menuRes.json()) as QrMenuData;
        if (cancelled) return;

        setToken("session-disabled");
        setRole(vipSecret ? "vip" : "guest");
        setSessionExpiresAt(0);
        setMenuData(menu);
        setActiveCategoryId(menu.categories?.[0]?.id ?? "");
        setSessionState("active");
      } catch (err) {
        console.error("[masa] direct start failed:", err);
        if (!cancelled) blockSession(t(localeRef.current, "menuLoadError"));
      }
    }

    loadMenuDirectly();
    return () => {
      cancelled = true;
    };
  }, [blockSession, tableId, vipSecret]);

  // OLD EFFECT (DISABLED): session start
  useEffect(() => {
    return; // DISABLED: sessions are disabled
    let cancelled = false;

    async function startSession() {
      const isVip = Boolean(vipSecret);

      if (isVip) {
        setSessionState("loading");
        setNotice("");
        try {
          const sessionRes = await fetch("/api/session/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vip: true, secret: vipSecret }),
          });
          if (cancelled) return;
          if (!sessionRes.ok) {
            blockSession(t(localeRef.current, "invalid"));
            return;
          }
          const session = (await sessionRes.json()) as StartResponse;
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
          if (sessionKey) sessionStorage.setItem(sessionKey, session.token);
          setToken(session.token);
          setRole("vip");
          setSessionExpiresAt(0);
          setMenuData(menu);
          setActiveCategoryId(menu.categories?.[0]?.id ?? "");
          setSessionState("active");
        } catch (err) {
          console.error("[masa] vip start failed:", err);
          if (!cancelled) blockSession(t(localeRef.current, "invalid"));
        }
        return;
      }

      if (!tableId) {
        blockSession(t(localeRef.current, "invalid"));
        return;
      }

      setSessionState("loading");
      setNotice("");

      try {
        const sessionRes = await fetch("/api/session/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tableId }),
        });
        if (cancelled) return;

        if (!sessionRes.ok) {
          blockSession(t(localeRef.current, "invalid"));
          return;
        }

        const session = (await sessionRes.json()) as StartResponse;
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

        if (sessionKey) sessionStorage.setItem(sessionKey, session.token);
        setToken(session.token);
        setRole("guest");
        setSessionExpiresAt(
          session.expiresInSeconds ? Date.now() + session.expiresInSeconds * 1000 : 0,
        );
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
  }, [blockSession, sessionKey, tableId, vipSecret]);

  // OLD EFFECT (DISABLED): session ping
  useEffect(() => {
    return; // DISABLED: sessions are disabled
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
    role,
    sessionState,
    sessionExpiresAt,
    setActiveCategoryId,
    token,
  };
}
