"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AIAssistantModal } from "./AIAssistantModal";
import styles from "../../../_styles/scss/ui/AIAssistant.module.scss";

const parseTable = (value) => {
  const table = Number(value);
  return Number.isInteger(table) && table >= 1 && table <= 500 ? table : null;
};

/**
 * Entry point for the AI menu assistant: an inline CTA card rendered above
 * the menu plus the chat modal it opens. The table number comes from the QR
 * code deep link (?table=N) so the assistant knows where the guest is seated.
 * Read client-side so the menu page itself stays statically rendered.
 */
const MenuAIAssistantInner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("aiAssistant");
  const searchParams = useSearchParams();
  const table = parseTable(searchParams.get("table"));

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
      >
        <span className={styles.triggerIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
            <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
          </svg>
        </span>
        <span className={styles.triggerText}>
          <span className={styles.triggerTitle}>{t("triggerTitle")}</span>
          <span className={styles.triggerSubtitle}>{t("triggerSubtitle")}</span>
        </span>
        <span className={styles.triggerCta}>{t("triggerCta")}</span>
      </button>

      <AIAssistantModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        table={table}
      />
    </>
  );
};

// useSearchParams requires a Suspense boundary during static prerendering.
const MenuAIAssistant = () => (
  <Suspense fallback={null}>
    <MenuAIAssistantInner />
  </Suspense>
);

export default MenuAIAssistant;
