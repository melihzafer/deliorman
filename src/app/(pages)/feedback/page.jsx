"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import AppData from "@data/app.json";

import PageBanner from "@components/PageBanner";
import { FeedbackForm } from "@components/forms/FeedbackForm";
import styles from "./Feedback.module.scss";

export default function FeedbackPage() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner
          pageTitle={"Вашето мнение е важно"}
          description={"Споделете вашите мисли, предложения или коментари"}
          breadTitle={"Обратна връзка"}
        />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className={`container ${styles.feedbackPage}`}>
              <div className={styles.feedbackContainer}>
                <div className={styles.feedbackHeader}>
                  <div className="tst-suptitle tst-suptitle-center tst-mb-15">
                    Обратна връзка
                  </div>
                  <h3 className="tst-mb-30">
                    Как можем да подобрим вашето преживяване?
                  </h3>
                  <p className="tst-text tst-mb-30">
                    Вашето мнение е изключително важно за нас. Независимо дали искате да споделите комплимент, предложение или конструктивна критика, ние сме тук да слушаме. Всяка обратна връзка ни помага да станем по-добри и да предоставим още по-качествено обслужване.
                  </p>
                </div>

                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      style={{
                        backgroundColor: "rgba(46, 204, 113, 0.1)",
                        border: "2px solid #2ecc71",
                        borderRadius: "10px",
                        padding: "20px",
                        marginBottom: "30px",
                        textAlign: "center",
                      }}
                    >
                      <h4 style={{ color: "#2ecc71", margin: "0 0 10px 0" }}>
                        ✓ Благодарим Ви!
                      </h4>
                      <p style={{ margin: 0, fontSize: "16px" }}>
                        Вашата обратна връзка беше успешно изпратена. Вашето мнение е важно за нас!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className={styles.feedbackFormWrapper}>
                  <FeedbackForm onSuccess={handleSuccess} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
