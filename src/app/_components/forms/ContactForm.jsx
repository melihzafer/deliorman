"use client";

import { Formik } from "formik";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";

const ContactForm = () => {
  const t = useTranslations("contact");
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const getFieldLabel = (key) => t(key).replace(/\s*\*$/, "");

  return (
    <>
      {/* contact form */}
      <Formik
        initialValues={{
          email: "",
          phone: "",
          first_name: "",
          last_name: "",
          message: "",
          privacy_consent: false,
        }}
        validateOnChange={false}
        validateOnBlur={true}
        validate={(values) => {
          const errors = {};

          if (!values.first_name || values.first_name.trim().length < 2) {
            errors.first_name = t("nameMinLength");
          }

          if (!values.last_name || values.last_name.trim().length < 2) {
            errors.last_name = t("lastNameMinLength");
          }

          if (!values.email) {
            errors.email = t("requiredField");
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = t("invalidEmail");
          }

          if (!values.phone || values.phone.trim().length < 9) {
            errors.phone = t("invalidPhone");
          }

          if (!values.message || values.message.trim().length < 10) {
            errors.message = t("messageMinLength");
          }

          if (!values.privacy_consent) {
            errors.privacy_consent = t("privacyError");
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitStatus({ type: "", message: "" });

          const data = new FormData();
          data.append("first_name", values.first_name);
          data.append("last_name", values.last_name);
          data.append("email", values.email);
          data.append("phone", values.phone);
          data.append("message", values.message);
          data.append(
            "privacy_consent",
            values.privacy_consent ? "true" : "false"
          );

          try {
            const response = await fetch("/api/contact", {
              method: "POST",
              body: data,
            });

            const result = await response.json();

            if (response.ok && result.success) {
              setSubmitStatus({
                type: "success",
                message: t("success"),
              });
              resetForm();
            } else {
              const errorMessages = Array.isArray(result.errors)
                ? result.errors.map((e) => e.message).join(", ")
                : t("problemOccurred");
              setSubmitStatus({
                type: "error",
                message: errorMessages,
              });
            }
          } catch (error) {
            console.error("Form submission error:", error);
            setSubmitStatus({
              type: "error",
              message: t("error"),
            });
          }

          setSubmitting(false);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit} id="contactForm">
            <div className="row">
              <div className="col-lg-6">
                <input
                  id="contact-first-name"
                  type="text"
                  placeholder={t("firstName")}
                  name="first_name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.first_name}
                  aria-label={getFieldLabel("firstName")}
                  aria-invalid={Boolean(errors.first_name && touched.first_name)}
                  aria-describedby={
                    errors.first_name && touched.first_name
                      ? "contact-first-name-error"
                      : undefined
                  }
                  className={
                    errors.first_name && touched.first_name ? "error" : ""
                  }
                />
                {errors.first_name && touched.first_name && (
                  <div
                    id="contact-first-name-error"
                    className="tst-field-error"
                    role="alert"
                  >
                    {errors.first_name}
                  </div>
                )}
              </div>
              <div className="col-lg-6">
                <input
                  id="contact-last-name"
                  type="text"
                  placeholder={t("lastName")}
                  name="last_name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.last_name}
                  aria-label={getFieldLabel("lastName")}
                  aria-invalid={Boolean(errors.last_name && touched.last_name)}
                  aria-describedby={
                    errors.last_name && touched.last_name
                      ? "contact-last-name-error"
                      : undefined
                  }
                  className={
                    errors.last_name && touched.last_name ? "error" : ""
                  }
                />
                {errors.last_name && touched.last_name && (
                  <div
                    id="contact-last-name-error"
                    className="tst-field-error"
                    role="alert"
                  >
                    {errors.last_name}
                  </div>
                )}
              </div>
              <div className="col-lg-6">
                <input
                  id="contact-phone"
                  type="tel"
                  placeholder={t("phone")}
                  name="phone"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                  aria-label={getFieldLabel("phone")}
                  aria-invalid={Boolean(errors.phone && touched.phone)}
                  aria-describedby={
                    errors.phone && touched.phone ? "contact-phone-error" : undefined
                  }
                  className={errors.phone && touched.phone ? "error" : ""}
                />
                {errors.phone && touched.phone && (
                  <div
                    id="contact-phone-error"
                    className="tst-field-error"
                    role="alert"
                  >
                    {errors.phone}
                  </div>
                )}
              </div>
              <div className="col-lg-6">
                <input
                  id="contact-email"
                  type="email"
                  placeholder={t("email")}
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  aria-label={getFieldLabel("email")}
                  aria-invalid={Boolean(errors.email && touched.email)}
                  aria-describedby={
                    errors.email && touched.email ? "contact-email-error" : undefined
                  }
                  className={errors.email && touched.email ? "error" : ""}
                />
                {errors.email && touched.email && (
                  <div
                    id="contact-email-error"
                    className="tst-field-error"
                    role="alert"
                  >
                    {errors.email}
                  </div>
                )}
              </div>
              <div className="col-lg-12">
                <textarea
                  id="contact-message"
                  placeholder={t("message")}
                  name="message"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.message}
                  rows="4"
                  aria-label={getFieldLabel("message")}
                  aria-invalid={Boolean(errors.message && touched.message)}
                  aria-describedby={
                    errors.message && touched.message
                      ? "contact-message-error"
                      : undefined
                  }
                  className={errors.message && touched.message ? "error" : ""}
                />
                {errors.message && touched.message && (
                  <div
                    id="contact-message-error"
                    className="tst-field-error"
                    role="alert"
                  >
                    {errors.message}
                  </div>
                )}
              </div>
            </div>

            <div className="tst-privacy-consent">
              <label className="tst-privacy-consent-label">
                <input
                  id="contact-privacy-consent"
                  type="checkbox"
                  name="privacy_consent"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  checked={Boolean(values.privacy_consent)}
                  aria-invalid={Boolean(
                    errors.privacy_consent && touched.privacy_consent
                  )}
                  aria-describedby={
                    errors.privacy_consent && touched.privacy_consent
                      ? "contact-privacy-consent-error"
                      : undefined
                  }
                />
                <span>
                  {t("privacyConsent")}{" "}
                  <Link href="/terms" className="tst-color tst-anima-link">
                    {t("termsLink")}
                  </Link>
                  <span> </span>
                  {t("privacyInfo")}
                </span>
              </label>
              {errors.privacy_consent && touched.privacy_consent && (
                <div
                  id="contact-privacy-consent-error"
                  className="tst-field-error"
                  role="alert"
                >
                  {errors.privacy_consent}
                </div>
              )}
            </div>

            <button
              className="tst-btn"
              type="submit"
              disabled={isSubmitting}
              style={{ marginLeft: "auto", marginRight: "auto" }}
            >
              {isSubmitting ? t("submitting") : t("submit")}
            </button>

            {submitStatus.message && (
              <div
                className={`tst-form-status ${submitStatus.type}`}
                role={submitStatus.type === "error" ? "alert" : "status"}
                aria-live="polite"
              >
                <h5
                  style={{
                    color:
                      submitStatus.type === "success" ? "#4CAF50" : "#f44336",
                  }}
                >
                  {submitStatus.message}
                </h5>
              </div>
            )}
          </form>
        )}
      </Formik>
      {/* contact form end */}

      <style jsx>{`
        .tst-field-error {
          color: #f44336;
          font-size: 13px;
          margin-top: 5px;
          margin-bottom: 10px;
        }

        input.error,
        textarea.error {
          border-color: #f44336 !important;
        }

        .tst-form-status {
          margin-top: 20px;
          padding: 15px;
          border-radius: 8px;
          animation: slideIn 0.3s ease;
        }

        .tst-form-status.success {
          background-color: #e8f5e9;
          border: 1px solid #4caf50;
        }

        .tst-form-status.error {
          background-color: #ffebee;
          border: 1px solid #f44336;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tst-privacy-consent {
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .tst-privacy-consent-label {
          display: flex;
          gap: 10px;
          align-items: center;
          cursor: pointer;
          user-select: none;
          margin-bottom: 3em;
        }

        .tst-privacy-consent-label input {
          width: 25px;
          height: 25px;
          margin: 0 3em 7px 0;
        }
      `}</style>
    </>
  );
};
export default ContactForm;
