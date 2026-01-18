"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FeedbackModal } from "./FeedbackModal";
import styles from "../../_styles/scss/ui/FAB.module.scss";

export const FeedbackFAB = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSuccess = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <>
      <motion.button
        className={styles.fab}
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
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
      </motion.button>
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            style={{
              position: "fixed",
              bottom: "100px",
              right: "30px",
              backgroundColor: "#2ecc71",
              color: "white",
              padding: "16px 24px",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(46, 204, 113, 0.4)",
              zIndex: 1001,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              maxWidth: "350px",
            }}
          >
            <span style={{ fontSize: "24px" }}>✓</span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                Благодарим Ви!
              </div>
              <div style={{ fontSize: "14px", opacity: 0.9 }}>
                Вашата обратна връзка е изпратена успешно
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
