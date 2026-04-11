"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, startTransition, useCallback } from "react";
import { useTranslations } from "next-intl";
import styles from "../../_styles/scss/ui/FeedbackForm.module.scss";

const STAR_VALUES = [1, 2, 3, 4, 5];

const STAR_LABELS = {
  5: "starRatingExcellent",
  4: "starRatingVeryGood",
  3: "starRatingGood",
  2: "starRatingAcceptable",
  1: "starRatingNeedsImprovement",
};

const CATEGORIES = [
  { value: "service", icon: "🍽️" },
  { value: "food", icon: "🍕" },
  { value: "vibes", icon: "✨" },
  { value: "other", icon: "💬" },
];

export const FeedbackForm = ({ onSuccess, onClose }) => {
  const t = useTranslations("feedback");

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
  });
  const [touched, setTouched] = useState({
    message: false,
    rating: false,
    category: false,
    termsAccepted: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [hoveredStar, setHoveredStar] = useState(null);
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
        [name]: type === "checkbox" ? checked : value,
      }));
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleCategorySelect = useCallback((value) => {
    startTransition(() => {
      setValues((prev) => ({
        ...prev,
        category: prev.category === value ? "" : value,
      }));
      setTouched((prev) => ({ ...prev, category: true }));
    });
  }, []);

  const handleStarClick = useCallback((value) => {
    startTransition(() => {
      setValues((prev) => ({
        ...prev,
        rating: prev.rating === String(value) ? "" : String(value),
      }));
      setTouched((prev) => ({ ...prev, rating: true }));
    });
  }, []);

  const resetForm = () => {
    setValues({ message: "", rating: "", category: "", termsAccepted: false });
    setTouched({ message: false, rating: false, category: false, termsAccepted: false });
    setServerErrors({ message: "", rating: "", category: "", termsAccepted: "" });
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ message: true, rating: true, category: true, termsAccepted: true });

    if (messageError || !values.termsAccepted) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setServerErrors({ message: "", rating: "", category: "", termsAccepted: "" });

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: values.message,
          rating: values.rating ? parseInt(values.rating) : undefined,
          category: values.category || undefined,
          termsAccepted: values.termsAccepted,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
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

  const getCategoryLabel = (value) => {
    const map = {
      service: t("categoryService"),
      food: t("categoryFood"),
      vibes: t("categoryVibes"),
      other: t("categoryOther"),
    };
    return map[value] || value;
  };

  const displayStars = hoveredStar || (values.rating ? parseInt(values.rating) : 0);

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.categorySection}>
        <label className={styles.fieldLabel}>{t("categoryLabel")}</label>
        <div className={styles.pillsRow}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              className={`${styles.pill} ${values.category === cat.value ? styles.pillActive : ""}`}
              onClick={() => handleCategorySelect(cat.value)}
              aria-pressed={values.category === cat.value}
            >
              <span className={styles.pillIcon}>{cat.icon}</span>
              <span className={styles.pillText}>{getCategoryLabel(cat.value)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.ratingSection}>
        <label className={styles.fieldLabel}>{t("ratingLabel")}</label>
        <div className={styles.starsRow}>
          {STAR_VALUES.map((value) => (
            <button
              key={value}
              type="button"
              className={`${styles.starBtn} ${value <= displayStars ? styles.starFilled : ""}`}
              onClick={() => handleStarClick(value)}
              onMouseEnter={() => setHoveredStar(value)}
              onMouseLeave={() => setHoveredStar(null)}
              aria-label={t(STAR_LABELS[value])}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill={value <= displayStars ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </button>
          ))}
        </div>
        {displayStars > 0 && (
          <div className={styles.ratingHint}>
            {t(STAR_LABELS[displayStars] || "ratingNone")}
          </div>
        )}
      </div>

      <div className={styles.groupInput}>
        <div className={styles.floatingField}>
          <textarea
            id="feedback-message"
            name="message"
            rows="4"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.textarea} ${(touched.message && messageError) || serverErrors.message ? styles.error : ""} ${values.message ? styles.filled : ""}`}
            placeholder=" "
          />
          <label htmlFor="feedback-message" className={styles.floatingLabel}>
            {t("messageLabel")} <span className={styles.required}>*</span>
          </label>
        </div>
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
          <div className={`${styles.charCounter} ${messageLength < 10 || messageLength > 1000 ? styles.invalid : ""}`}>
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
            className={touched.termsAccepted && !values.termsAccepted ? styles.error : ""}
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
          {isSubmitting ? (
            <span className={styles.spinner}></span>
          ) : (
            t("submit")
          )}
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