"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

import PageBanner from "@components/PageBanner";
import { FeedbackForm } from "@components/forms/FeedbackForm";
import styles from "../../_styles/scss/ui/FeedbackPage.module.scss";

export default function FeedbackPageContent() {
  const [showSuccess, setShowSuccess] = useState(false);
  const t = useTranslations("feedbackPage");

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner
          pageTitle={t("pageTitle")}
          description={t("pageDescription")}
          breadTitle={t("breadTitle")}
        />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className={`container ${styles.feedbackPage}`}>
              <div className={styles.feedbackContainer}>
                <div className={styles.feedbackHeader}>
                  <div className="tst-suptitle tst-suptitle-center tst-mb-15">
                    {t("subtitle")}
                  </div>
                  <h3 className="tst-mb-30">{t("title")}</h3>
                  <p className="tst-text tst-mb-30">{t("description")}</p>
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
                        ✓ {t("successTitle")}
                      </h4>
                      <p style={{ margin: 0, fontSize: "16px" }}>
                        {t("successMessage")}
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
