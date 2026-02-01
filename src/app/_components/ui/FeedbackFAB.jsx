"use client";

import { useState, startTransition } from "react";
import { FeedbackModal } from "./FeedbackModal";
import styles from "../../_styles/scss/ui/FAB.module.scss";

export const FeedbackFAB = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSuccess = () => {
    startTransition(() => {
      setShowToast(true);
    });
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <>
      <button
        className={styles.fab}
        onClick={() => startTransition(() => setIsModalOpen(true))}
        aria-label="Обратна връзка"
        aria-expanded={isModalOpen}
        title="Споделете вашето мнение"
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
              Благодарим Ви!
            </div>
            <div style={{ fontSize: "14px", opacity: 0.9 }}>
              Вашата обратна връзка е изпратена успешно
            </div>
          </div>
        </div>
      )}
    </>
  );
};
