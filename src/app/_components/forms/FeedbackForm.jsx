"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import styles from "../../_styles/scss/ui/FeedbackForm.module.scss";

const CATEGORIES = [
  { value: "", label: "Изберете категория (по избор)" },
  { value: "service", label: "Обслужване" },
  { value: "food", label: "Храна" },
  { value: "vibes", label: "Атмосфера" },
  { value: "other", label: "Друго" },
];

// Validation function
const validateMessage = (message) => {
  if (!message || message.trim() === "") {
    return "Моля, въведете съобщение";
  } else if (message.trim().length < 10) {
    return "Съобщението трябва да съдържа поне 10 символа";
  } else if (message.length > 1000) {
    return "Съобщението не може да надвишава 1000 символа";
  }
  return null;
};

export const FeedbackForm = ({ onSuccess, onClose }) => {
  const [values, setValues] = useState({
    message: "",
    rating: "",
    category: "",
    termsAccepted: false,
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
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const resetForm = () => {
    setValues({ message: "", rating: "", category: "", termsAccepted: false });
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
          throw new Error("Грешка при изпращане на обратна връзка");
        }
        return;
      }

      resetForm();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Feedback submission error:", error);
      setSubmitError(
        "Възникна грешка при изпращане на вашето съобщение. Моля, опитайте отново."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.groupInput}>
        <label htmlFor="category">
          Категория
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
          Оценка (по избор)
        </label>
        <select
          id="rating"
          name="rating"
          value={values.rating}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">Без оценка</option>
          <option value="5">⭐⭐⭐⭐⭐ Отлично</option>
          <option value="4">⭐⭐⭐⭐ Много добро</option>
          <option value="3">⭐⭐⭐ Добро</option>
          <option value="2">⭐⭐ Приемливо</option>
          <option value="1">⭐ Нуждае се от подобрение</option>
        </select>
      </div>

      <div className={styles.groupInput}>
        <label htmlFor="message">
          Вашето съобщение <span className={styles.required}>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows="5"
          placeholder="Споделете вашите мисли..."
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
            Съгласен/на съм съобщението ми да бъде изпратено анонимно и разбирам, че
            не мога да получа отговор. <span className={styles.required}>*</span>
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
              <span>⚠</span> Моля, приемете условията за изпращане
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={styles.disclaimer}>
        <span>🔒</span> Всички съобщения са анонимни и се изпращат сигурно.
      </div>

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Изпраща се..." : "Изпрати"}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            Затвори
          </button>
        )}
      </div>
    </form>
  );
};
