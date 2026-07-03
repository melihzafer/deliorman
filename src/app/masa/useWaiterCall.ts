import { useCallback, useEffect, useRef, useState } from "react";

import { COOLDOWN_KEY_PREFIX, COOLDOWN_MS, SUCCESS_MS } from "./masaConstants";
import { t } from "./masaTranslations";
import type { Locale, WaiterFeedback } from "./masaTypes";

interface UseWaiterCallParams {
  blockSession: (message: string) => void;
  locale: Locale;
  nowMs: number;
  tableId: string;
  token: string;
}

function formatCooldown(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function useWaiterCall({ blockSession, locale, nowMs, tableId, token }: UseWaiterCallParams) {
  const [callState, setCallState] = useState<"idle" | "loading">("idle");
  const [feedback, setFeedback] = useState<WaiterFeedback>(null);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cooldownKey = tableId ? `${COOLDOWN_KEY_PREFIX}.${tableId}` : "";
  const cooldownSeconds = Math.max(0, Math.ceil((cooldownUntil - nowMs) / 1000));

  useEffect(() => {
    return () => {
      if (successTimer.current) clearTimeout(successTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!cooldownKey) return;
    const stored = Number(sessionStorage.getItem(cooldownKey) || 0);
    if (stored > Date.now()) setCooldownUntil(stored);
  }, [cooldownKey]);

  const showFeedback = useCallback((type: "success" | "error", text: string) => {
    setFeedback({ type, text });
    if (successTimer.current) clearTimeout(successTimer.current);
    successTimer.current = setTimeout(() => setFeedback(null), SUCCESS_MS);
  }, []);

  const callWaiter = useCallback(async () => {
    if (!token || !tableId || callState === "loading" || cooldownSeconds > 0) return;
    setCallState("loading");

    try {
      const res = await fetch("/api/waiter/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, tableId }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        retryAfterSeconds?: number;
      };

      if (res.status === 403 || res.status === 401) {
        blockSession(t(locale, "expired"));
        return;
      }

      if (res.status === 429) {
        const retryAfterSeconds = data.retryAfterSeconds ?? 180;
        const until = Date.now() + retryAfterSeconds * 1000;
        setCooldownUntil(until);
        sessionStorage.setItem(cooldownKey, String(until));
        showFeedback(
          "error",
          t(locale, "retryLaterWithTime").replace("{time}", formatCooldown(retryAfterSeconds)),
        );
        return;
      }

      if (!res.ok) {
        showFeedback("error", data.error || t(locale, "retryLater"));
        return;
      }

      const until = Date.now() + COOLDOWN_MS;
      setCooldownUntil(until);
      sessionStorage.setItem(cooldownKey, String(until));
      showFeedback(
        "success",
        t(locale, "successWithCooldown").replace("{time}", formatCooldown(COOLDOWN_MS / 1000)),
      );
    } catch (err) {
      console.error("[masa] waiter call failed:", err);
      showFeedback("error", t(locale, "retryLater"));
    } finally {
      setCallState("idle");
    }
  }, [blockSession, callState, cooldownKey, cooldownSeconds, locale, showFeedback, tableId, token]);

  return {
    callState,
    callWaiter,
    cooldownSeconds,
    feedback,
  };
}
