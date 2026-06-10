"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, startTransition } from "react";
import { useTranslations } from "next-intl";
import styles from "../../_styles/scss/ui/FeedbackForm.module.scss";

export const FeedbackForm = ({ onSuccess, onClose }) => {
  const t = useTranslations("feedback");

  const CATEGORIES = [
    { value: "", label: t("categoryPlaceholder") },
    { value: "service", label: t("categoryService") },
    { value: "food", label: t("categoryFood") },
    { value: "vibes", label: t("categoryVibes") },
    { value: "other", label: t("categoryOther") },
  ];

  const validateMessage = (message) => {
    if (!message || message.trim() === "") {
      return t("messageRequired");
    } else if (message.trim().length < 10) {
      return t("messageMinLength");
    } else if (message.length > 1000) {
      return t("messageMaxLength");
    }
    return null;
  };

  const [values, setValues] = useState({
    message: "",
    rating: "",
    category: "",
    termsAccepted: false,
    website: "",
  });
  // Monomorphic: always same shape to prevent V8 de-optimization
  const [touched, setTouched] = useState({
    message: false,
    rating: false,
    category: false,
    termsAccepted: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  // Monomorphic: always same shape to prevent V8 de-optimization
  const [serverErrors, setServerErrors] = useState({
    message: "",
    rating: "",
    category: "",
    termsAccepted: "",
  });

  const messageError = validateMessage(values.message);
  const messageLength = values.message.length;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    startTransition(() => {
      setValues((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const resetForm = () => {
    setValues({ message: "", rating: "", category: "", termsAccepted: false, website: "" });
    // Reset to stable shape, not empty object
    setTouched({ message: false, rating: false, category: false, termsAccepted: false });
    setServerErrors({ message: "", rating: "", category: "", termsAccepted: "" });
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ message: true, rating: true, category: true, termsAccepted: true });

    // Validate before submitting
    if (messageError || !values.termsAccepted) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setServerErrors({});

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: values.message,
          rating: values.rating ? parseInt(values.rating) : undefined,
          category: values.category || undefined,
          termsAccepted: values.termsAccepted,
          website: values.website || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          // Start with stable shape, then populate
          const errorMap = { message: "", rating: "", category: "", termsAccepted: "" };
          data.errors.forEach((err) => {
            if (err.field && err.field in errorMap) {
              errorMap[err.field] = err.message;
            } else {
              setSubmitError(err.message);
            }
          });
          setServerErrors(errorMap);
        } else {
          throw new Error(t("submitError"));
        }
        return;
      }

      resetForm();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Feedback submission error:", error);
      setSubmitError(t("generalError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      {/* Honeypot anti-spam field: hidden from users, bots fill it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        onChange={handleChange}
        value={values.website || ""}
        style={{ position: "absolute", left: "-9999px", height: 0, width: 0, opacity: 0 }}
        aria-hidden="true"
      />
      <div className={styles.groupInput}>
        <label htmlFor="category">
          {t("categoryLabel")}
        </label>
        <select
          id="category"
          name="category"
          value={values.category}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.groupInput}>
        <label htmlFor="rating">
          {t("ratingLabel")}
        </label>
        <select
          id="rating"
          name="rating"
          value={values.rating}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">{t("ratingNone")}</option>
          <option value="5">{t("ratingExcellent")}</option>
          <option value="4">{t("ratingVeryGood")}</option>
          <option value="3">{t("ratingGood")}</option>
          <option value="2">{t("ratingAcceptable")}</option>
          <option value="1">{t("ratingNeedsImprovement")}</option>
        </select>
      </div>

      <div className={styles.groupInput}>
        <label htmlFor="message">
          {t("messageLabel")} <span className={styles.required}>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows="5"
          placeholder={t("messagePlaceholder")}
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
          className={(touched.message && messageError) || serverErrors.message ? styles.error : ''}
        />

        <div className={styles.helperText}>
             <div style={{ flex: 1 }}>
                <AnimatePresence>
                {((touched.message && messageError) || serverErrors.message) && (
                    <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className={styles.errorMessage}
                    >
                    <span>⚠</span> {serverErrors.message || messageError}
                    </motion.div>
                )}
                </AnimatePresence>
             </div>
             <div className={`${styles.charCounter} ${messageLength < 10 || messageLength > 1000 ? styles.invalid : ''}`}>
                {messageLength}/1000
             </div>
        </div>
      </div>

      <AnimatePresence>
        {submitError && (
            <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`${styles.errorMessage} ${styles.box}`}
            >
            {submitError}
            </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.termsGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="termsAccepted"
            checked={values.termsAccepted}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.termsAccepted && !values.termsAccepted ? styles.error : ''}
          />
          <span className={styles.checkmark}></span>
          <span className={styles.labelText}>
            {t("termsLabel")} <span className={styles.required}>*</span>
          </span>
        </label>
        <AnimatePresence>
          {touched.termsAccepted && !values.termsAccepted && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={styles.errorMessage}
            >
              <span>⚠</span> {t("termsError")}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.disclaimer}>
        <span>🔒</span> {t("disclaimer")}
      </div>

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? t("submitting") : t("submit")}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            {t("close")}
          </button>
        )}
      </div>
    </form>
  );
};
