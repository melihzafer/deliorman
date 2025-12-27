"use client";

import { Formik } from "formik";
import { useState } from "react";
import Link from "next/link";

const ContactForm = () => {
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

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
        validate={(values) => {
          const errors = {};

          if (!values.first_name || values.first_name.trim().length < 2) {
            errors.first_name = "Името трябва да е поне 2 символа";
          }

          if (!values.last_name || values.last_name.trim().length < 2) {
            errors.last_name = "Фамилията трябва да е поне 2 символа";
          }

          if (!values.email) {
            errors.email = "Задължително поле";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Невалиден имейл адрес";
          }

          if (!values.phone || values.phone.trim().length < 9) {
            errors.phone = "Невалиден телефонен номер";
          }

          if (!values.message || values.message.trim().length < 10) {
            errors.message = "Съобщението трябва да е поне 10 символа";
          }

          if (!values.privacy_consent) {
            errors.privacy_consent =
              "Моля, потвърдете, че сте се запознали с правилата и условията.";
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
                message:
                  "Благодарим за вашето съобщение! Ще се свържем с вас скоро.",
              });
              resetForm();
            } else {
              const errorMessages =
                result.errors?.map((e) => e.message).join(", ") ||
                "Възникна проблем";
              setSubmitStatus({
                type: "error",
                message: errorMessages,
              });
            }
          } catch (error) {
            console.error("Form submission error:", error);
            setSubmitStatus({
              type: "error",
              message:
                "Грешка при изпращането. Моля, опитайте отново или се обадете на +359 89 4766273.",
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
                  type="text"
                  placeholder="Име *"
                  name="first_name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.first_name}
                  className={
                    errors.first_name && touched.first_name ? "error" : ""
                  }
                />
                {errors.first_name && touched.first_name && (
                  <div className="tst-field-error">{errors.first_name}</div>
                )}
              </div>
              <div className="col-lg-6">
                <input
                  type="text"
                  placeholder="Фамилия *"
                  name="last_name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.last_name}
                  className={
                    errors.last_name && touched.last_name ? "error" : ""
                  }
                />
                {errors.last_name && touched.last_name && (
                  <div className="tst-field-error">{errors.last_name}</div>
                )}
              </div>
              <div className="col-lg-6">
                <input
                  type="tel"
                  placeholder="Телефон *"
                  name="phone"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                  className={errors.phone && touched.phone ? "error" : ""}
                />
                {errors.phone && touched.phone && (
                  <div className="tst-field-error">{errors.phone}</div>
                )}
              </div>
              <div className="col-lg-6">
                <input
                  type="email"
                  placeholder="Имейл *"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  className={errors.email && touched.email ? "error" : ""}
                />
                {errors.email && touched.email && (
                  <div className="tst-field-error">{errors.email}</div>
                )}
              </div>
              <div className="col-lg-12">
                <textarea
                  placeholder="Съобщение (минимум 10 символа) *"
                  name="message"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.message}
                  rows="4"
                  className={errors.message && touched.message ? "error" : ""}
                />
                {errors.message && touched.message && (
                  <div className="tst-field-error">{errors.message}</div>
                )}
              </div>
            </div>

            <div className="tst-privacy-consent">
              <label className="tst-privacy-consent-label">
                <input
                  type="checkbox"
                  name="privacy_consent"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  checked={Boolean(values.privacy_consent)}
                />
                <span>
                  Съгласен/а съм с{" "}
                  <Link href="/terms" className="tst-color tst-anima-link">
                    правилата и условията
                  </Link>
                  <span> </span>и информацията за лични данни.
                </span>
              </label>
              {errors.privacy_consent && touched.privacy_consent && (
                <div className="tst-field-error">{errors.privacy_consent}</div>
              )}
            </div>

            <button
              className="tst-btn"
              type="submit"
              disabled={isSubmitting}
              style={{ marginLeft: "auto", marginRight: "auto" }}
            >
              {isSubmitting ? "Изпращане..." : "Изпрати съобщение"}
            </button>

            {submitStatus.message && (
              <div className={`tst-form-status ${submitStatus.type}`}>
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
