"use client";

import { useState, startTransition } from "react";
import { useTranslations } from "next-intl";
import { FeedbackModal } from "./FeedbackModal";
import styles from "../../_styles/scss/ui/FAB.module.scss";

export const FeedbackFAB = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const tFeedback = useTranslations("feedback");
  const tFeedbackPage = useTranslations("feedbackPage");

  const handleSuccess = () => {
    startTransition(() => {
      setShowToast(true);
    });
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <>
      <button
        className={`tst-feedback-fab ${styles.fab}`}
        onClick={() => startTransition(() => setIsModalOpen(true))}
        aria-label={tFeedback("widgetLabel")}
        aria-expanded={isModalOpen}
        title={tFeedback("widgetTitle")}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Toast Notification - CSS animation instead of Framer Motion */}
      {showToast && (
        <div className={styles.toast}>
          <span style={{ fontSize: "24px" }}>✓</span>
          <div>
            <div style={{ fontWeight: 600, marginBottom: "4px" }}>
              {tFeedbackPage("successTitle")}
            </div>
            <div style={{ fontSize: "14px", opacity: 0.9 }}>
              {tFeedbackPage("successMessage")}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
