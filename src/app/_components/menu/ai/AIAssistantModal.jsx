"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import styles from "../../../_styles/scss/ui/AIAssistant.module.scss";

const MAX_MESSAGE_CHARS = 500;
const MAX_HISTORY_MESSAGES = 10;

export const AIAssistantModal = ({ isOpen, onClose, table = null }) => {
  const t = useTranslations("aiAssistant");
  const locale = useLocale();

  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const previousActiveElement = useRef(null);
  const abortRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, scrollToBottom]);

  // Focus management + body scroll lock (mirrors FeedbackModal behavior)
  useEffect(() => {
    if (!isOpen) return;
    previousActiveElement.current = document.activeElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setTimeout(() => inputRef.current?.focus(), 100);
    return () => {
      document.body.style.overflow = originalOverflow;
      previousActiveElement.current?.focus();
    };
  }, [isOpen]);

  // ESC closes; abort any in-flight stream on close/unmount
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      abortRef.current?.abort();
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;
    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      const focusable = modalRef.current?.querySelectorAll(
        "textarea, input, button:not([disabled])"
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  const appendAssistantText = useCallback((chunk) => {
    setMessages((prev) => {
      const next = [...prev];
      const last = next[next.length - 1];
      if (last?.role === "assistant" && last.streaming) {
        next[next.length - 1] = { ...last, content: last.content + chunk };
      }
      return next;
    });
  }, []);

  const sendMessage = useCallback(
    async (rawText) => {
      const text = rawText.trim().slice(0, MAX_MESSAGE_CHARS);
      if (!text || isStreaming) return;

      const history = messages
        .filter((m) => !m.error && m.content)
        .slice(-MAX_HISTORY_MESSAGES)
        .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

      setMessages((prev) => [
        ...prev,
        { role: "user", content: text },
        { role: "assistant", content: "", streaming: true },
      ]);
      setInput("");
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      let errorKey = null;
      try {
        const response = await fetch("/api/ai/menu-assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            message: text,
            history,
            locale: ["bg", "en", "tr"].includes(locale) ? locale : "bg",
            table: table || undefined,
          }),
        });

        if (!response.ok) {
          if (response.status === 429) errorKey = "errorRateLimit";
          else if (response.status === 502 || response.status === 503) errorKey = "errorUnavailable";
          else errorKey = "errorGeneric";
        } else if (response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let received = "";
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            received += chunk;
            appendAssistantText(chunk);
          }
          if (received.endsWith("[error]") || received.trim() === "") {
            errorKey = "errorGeneric";
          }
        } else {
          errorKey = "errorGeneric";
        }
      } catch (err) {
        if (err?.name !== "AbortError") errorKey = "errorGeneric";
      }

      abortRef.current = null;
      setIsStreaming(false);
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === "assistant") {
          const content = last.content.replace(/\n?\[error\]$/, "");
          next[next.length - 1] = errorKey
            ? { role: "assistant", content: content || t(errorKey), error: !content }
            : { role: "assistant", content };
        }
        return next;
      });
    },
    [messages, isStreaming, locale, table, appendAssistantText, t]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const showSuggestions = messages.length === 0 && !isStreaming;
  const suggestions = ["suggestion1", "suggestion2", "suggestion3", "suggestion4"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-assistant-title"
        >
          <motion.div
            ref={modalRef}
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <div className={styles.headerAvatar} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
                </svg>
              </div>
              <div className={styles.headerText}>
                <h3 id="ai-assistant-title">{t("modalTitle")}</h3>
                <p>{t("modalSubtitle")}</p>
              </div>
              {table ? (
                <span className={styles.tableBadge}>{t("tableBadge", { table })}</span>
              ) : null}
              <button
                type="button"
                className={styles.closeButton}
                onClick={onClose}
                aria-label={t("close")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className={styles.messages} aria-live="polite">
              <div className={`${styles.bubble} ${styles.assistant}`}>
                {t("welcome")}
              </div>

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`${styles.bubble} ${message.role === "user" ? styles.user : styles.assistant} ${message.error ? styles.errorBubble : ""}`}
                >
                  {message.content ||
                    (message.streaming ? (
                      <span className={styles.typing} aria-label={t("thinking")}>
                        <span />
                        <span />
                        <span />
                      </span>
                    ) : null)}
                </div>
              ))}

              {showSuggestions && (
                <div className={styles.suggestions}>
                  {suggestions.map((key) => (
                    <button
                      key={key}
                      type="button"
                      className={styles.suggestion}
                      onClick={() => sendMessage(t(key))}
                    >
                      {t(key)}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form className={styles.inputRow} onSubmit={handleSubmit}>
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={MAX_MESSAGE_CHARS}
                placeholder={t("inputPlaceholder")}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label={t("inputPlaceholder")}
              />
              <button
                type="submit"
                className={styles.sendButton}
                disabled={isStreaming || !input.trim()}
                aria-label={t("send")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>

            <p className={styles.disclaimer}>{t("disclaimer")}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
