"use client";

import { Formik } from "formik";
import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";

function normalizeBgPhone(input) {
  const raw = String(input ?? "").trim();
  if (!raw) return "";

  let s = raw.replace(/[\s\-()]/g, "");

  // 00359... -> +359...
  if (s.startsWith("00")) s = `+${s.slice(2)}`;

  // 359... -> +359...
  if (s.startsWith("359")) s = `+${s}`;

  // 08XXXXXXXXX -> +3598XXXXXXXX
  if (s.startsWith("08")) s = `+359${s.slice(1)}`;

  return s;
}

function validateBgPhone(input) {
  const normalized = normalizeBgPhone(input);
  if (!normalized) {
    return { ok: false, normalized: "", message: "Задължително поле" };
  }

  if (!/^\+\d+$/.test(normalized)) {
    return {
      ok: false,
      normalized,
      message: "Невалиден телефон. Пример: +359888123456 или 0888123456.",
    };
  }

  if (!normalized.startsWith("+359")) {
    return {
      ok: false,
      normalized,
      message: "Невалиден телефон. Пример: +359888123456 или 0888123456.",
    };
  }

  // Common BG mobile length: +359 + 9 digits
  if (normalized.length !== 13) {
    return {
      ok: false,
      normalized,
      message: "Невалиден телефон. Пример: +359888123456 или 0888123456.",
    };
  }

  return { ok: true, normalized, message: "" };
}

function parseDateTimeLocal(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const [y, m, d] = String(dateStr).split("-").map(Number);
  const [hh, mm] = String(timeStr).split(":").map(Number);
  if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

function roundUpToNextHour(date) {
  const d = new Date(date);
  d.setMinutes(0, 0, 0);
  if (
    date.getMinutes() !== 0 ||
    date.getSeconds() !== 0 ||
    date.getMilliseconds() !== 0
  ) {
    d.setHours(d.getHours() + 1);
  }
  return d;
}

const TIME_OPTIONS = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
];

const ReservationForm = () => {
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [successModal, setSuccessModal] = useState({ open: false, phone: "" });
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  // Memoize modal handlers to prevent recreation on every render
  const closeSuccessModal = useCallback(() => {
    setSuccessModal({ open: false, phone: "" });
  }, []);

  const closeTermsModal = useCallback(() => {
    setTermsModalOpen(false);
  }, []);

  const openTermsModal = useCallback(() => {
    setTermsModalOpen(true);
  }, []);

  // Memoize filtered time options based on selected date
  const filteredTimeOptions = useMemo(() => {
    if (!selectedDate) return TIME_OPTIONS;
    const now = new Date();
    const minAllowed = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    return TIME_OPTIONS.filter((t) => {
      const dt = parseDateTimeLocal(selectedDate, t);
      return dt && dt.getTime() >= minAllowed.getTime();
    });
  }, [selectedDate]);

  // Memoize date constraints (only changes once per day)
  const { minDateStr, maxDateStr } = useMemo(() => {
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setMonth(today.getMonth() + 1);
    if (today.getDate() !== maxDate.getDate()) {
      maxDate.setDate(0);
    }
    const toStr = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return { minDateStr: toStr(today), maxDateStr: toStr(maxDate) };
  }, []);

  // Close modal on ESC
  useEffect(() => {
    if (!successModal.open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setSuccessModal({ open: false, phone: "" });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [successModal.open]);

  // Close terms modal on ESC
  useEffect(() => {
    if (!termsModalOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setTermsModalOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [termsModalOpen]);

  return (
    <>
      {successModal.open && (
        <div
          className="tst-reservation-modal-overlay"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            // click outside closes
            if (e.target === e.currentTarget)
              setSuccessModal({ open: false, phone: "" });
          }}
        >
          <div className="tst-reservation-modal">
            <h4 className="tst-mb-10 tst-color-darkgreen">
              Заявката е изпратена
            </h4>
            <h6 className="tst-mb-15 text-primary-yellow">
              Изчакайте обаждане
            </h6>
            <p className="tst-text tst-mb-15">
              Ще се обадим на <strong>{successModal.phone}</strong> за
              потвърждение.
            </p>
            <p className="tst-text tst-mb-30" style={{ opacity: 0.85 }}>
              Моля, изчакайте обаждане от ресторанта. Докато не бъде потвърдена
              по телефона, резервацията не е валидна.
            </p>
            <button
              className="tst-btn"
              type="button"
              onClick={() => setSuccessModal({ open: false, phone: "" })}
            >
              Разбрах
            </button>
          </div>
        </div>
      )}

      {termsModalOpen && (
        <div
          className="tst-reservation-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Правила и условия / Лични данни"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setTermsModalOpen(false);
          }}
        >
          <div className="tst-reservation-modal">
            <h4 className="tst-mb-10 tst-color-darkgreen">
              Лични данни при резервация
            </h4>
            <p className="tst-text tst-mb-15" style={{ opacity: 0.9 }}>
              За да обработим заявката Ви, събираме име, фамилия и телефон,
              както и дата/час и брой гости. Използваме данните единствено за
              потвърждение и организация на резервацията.
            </p>
            <p className="tst-text tst-mb-20" style={{ opacity: 0.85 }}>
              Пълният текст с правила и информация за обработката на лични данни
              може да прочетете тук:
              <span> </span>
              <Link href="/terms" className="tst-color tst-anima-link">
                Правила и условия / Лични данни
              </Link>
              .
            </p>
            <button
              className="tst-btn"
              type="button"
              onClick={() => setTermsModalOpen(false)}
            >
              Затвори
            </button>
          </div>
        </div>
      )}

      {/* reservation form */}
      <Formik
        initialValues={{
          phone: "",
          first_name: "",
          last_name: "",
          time: "",
          date: "",
          person: "",
          message: "",
          company: "",
          privacy_consent: false,
        }}
        validateOnChange={false}
        validateOnBlur={true}
        validate={(values) => {
          const errors = {};

          if (!values.first_name || values.first_name.trim().length < 2) {
            errors.first_name = "Името трябва да е поне 2 символа";
          }

          if (!values.last_name || values.last_name.trim().length < 2) {
            errors.last_name = "Фамилията трябва да е поне 2 символа";
          }

          const phoneCheck = validateBgPhone(values.phone);
          if (!phoneCheck.ok) {
            errors.phone = phoneCheck.message;
          }

          // Guests validation (allow large groups, up to a sane max)
          const guestsNum = Number(values.person);
          if (!values.person || String(values.person).trim() === "") {
            errors.person = "Моля въведете брой гости";
          } else if (
            !Number.isFinite(guestsNum) ||
            !Number.isInteger(guestsNum)
          ) {
            errors.person = "Моля въведете валиден брой гости";
          } else if (guestsNum < 1) {
            errors.person = "Броят гости трябва да е поне 1";
          } else if (guestsNum > 100) {
            errors.person = "Максималният брой гости е 100";
          }

          if (!values.date) {
            errors.date = "Моля изберете дата";
          } else {
            const selectedDate = new Date(values.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const maxDate = new Date(today);
            maxDate.setMonth(today.getMonth() + 1);
            maxDate.setHours(23, 59, 59, 999);

            if (selectedDate < today) {
              errors.date = "Не може да резервирате за минала дата";
            } else if (selectedDate > maxDate) {
              errors.date =
                "Резервации могат да се правят само до 1 месец напред";
            }
          }

          if (!values.time || values.time === "") {
            errors.time = "Моля изберете час";
          }

          // Time validation: not in the past and at least 4 hours from now
          if (values.date && values.time) {
            const selectedDateTime = parseDateTimeLocal(
              values.date,
              values.time
            );
            if (selectedDateTime) {
              const now = new Date();
              const minAllowed = new Date(now.getTime() + 4 * 60 * 60 * 1000);

              if (selectedDateTime.getTime() < now.getTime()) {
                errors.time = "Моля изберете бъдещ час";
              } else if (selectedDateTime.getTime() < minAllowed.getTime()) {
                const rounded = roundUpToNextHour(minAllowed);
                const dd = String(rounded.getDate()).padStart(2, "0");
                const mm = String(rounded.getMonth() + 1).padStart(2, "0");
                const yyyy = String(rounded.getFullYear());
                const hh = String(rounded.getHours()).padStart(2, "0");
                const min = String(rounded.getMinutes()).padStart(2, "0");
                errors.time = `Резервация може да се направи най-рано след 4 часа (след ${dd}.${mm}.${yyyy} ${hh}:${min})`;
              }
            }
          }

          // Require message/details for large groups (> 20)
          if (Number.isFinite(guestsNum) && guestsNum > 20) {
            const msg = String(values.message || "").trim();
            if (msg.length < 5) {
              errors.message =
                "За групи над 20 души, моля напишете кратък коментар (повод, тип събитие, изисквания).";
            }
          }

          if (!values.privacy_consent) {
            errors.privacy_consent =
              "Моля, потвърдете, че сте се запознали с правилата и условията.";
          }

          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitStatus({ type: "", message: "" });

          const phoneCheck = validateBgPhone(values.phone);
          if (!phoneCheck.ok) {
            setSubmitStatus({ type: "error", message: phoneCheck.message });
            setSubmitting(false);
            return;
          }

          const data = new FormData();
          data.append("first_name", values.first_name);
          data.append("last_name", values.last_name);
          data.append("phone", phoneCheck.normalized);
          data.append("person", values.person);
          data.append("time", values.time);
          data.append("date", values.date);
          data.append("message", values.message);
          data.append("company", values.company);
          data.append(
            "privacy_consent",
            values.privacy_consent ? "true" : "false"
          );

          try {
            const response = await fetch("/api/reservation", {
              method: "POST",
              body: data,
            });

            const result = await response.json();

            if (response.ok && result.success) {
              setSuccessModal({
                open: true,
                phone: result.data?.phone || phoneCheck.normalized,
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
                "Грешка при резервацията. Моля, обадете се на +359 89 4766273.",
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
        }) => {
          // Custom handler for date input that syncs with our memoized state
          const handleDateChange = (e) => {
            handleChange(e);
            setSelectedDate(e.target.value);
          };

          return (
            <form onSubmit={handleSubmit} id="reservationForm">
              <div className="row">
                <div className="col-12 col-md-6">
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
                <div className="col-12 col-md-6">
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
                <div className="col-8 col-md-8">
                  <input
                    type="tel"
                    placeholder="Телефон *"
                    name="phone"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                    className={errors.phone && touched.phone ? "error" : ""}
                    inputMode="tel"
                    autoComplete="tel"
                  />
                  {errors.phone && touched.phone && (
                    <div className="tst-field-error">{errors.phone}</div>
                  )}
                </div>
                <div className="col-4 col-md-4">
                  {/*<label style={{ display: 'block', textAlign: 'left', marginBottom: 6 }}>*/}
                  {/*  Брой гости <span style={{ opacity: 0.7 }}>(вкл. фирмени банкети)</span> **/}
                  {/*</label>*/}
                  <div className="tst-guests-row">
                    <div className="tst-guests-input">
                      <input
                        type="number"
                        placeholder="Гости *"
                        name="person"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.person}
                        min={1}
                        max={500}
                        step={1}
                        inputMode="numeric"
                        className={
                          errors.person && touched.person ? "error" : ""
                        }
                      />
                      {errors.person && touched.person && (
                        <div className="tst-field-error">{errors.person}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-6">
                <input
                    type="date"
                    name="date"
                    onChange={handleDateChange}
                    onBlur={handleBlur}
                    value={values.date}
                    className={errors.date && touched.date ? "error" : ""}
                    min={minDateStr}
                    max={maxDateStr}
                  />
                  {errors.date && touched.date && (
                    <div className="tst-field-error">{errors.date}</div>
                  )}
                </div>
                <div className="col-6 col-md-6">
                  <select
                    name="time"
                    className={`wide ${
                      errors.time && touched.time ? "error" : ""
                    }`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.time}
                  >
                    <option value="">Час *</option>
                    {filteredTimeOptions.length === 0 ? (
                      <option value="" disabled>
                        Няма свободни часове (изберете друга дата)
                      </option>
                    ) : (
                      filteredTimeOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))
                    )}
                  </select>
                  {errors.time && touched.time && (
                    <div className="tst-field-error">{errors.time}</div>
                  )}
                </div>
                <div className="col-12">
                  <textarea
                    placeholder="Допълнително съобщение (незадължително)"
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

                {/* Honeypot: hidden field for bots (do not remove) */}
                <div
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    top: "auto",
                    width: 1,
                    height: 1,
                    overflow: "hidden",
                  }}
                  aria-hidden="true"
                >
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    onChange={handleChange}
                    value={values.company || ""}
                  />
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
                    <button
                      type="button"
                      className="tst-privacy-consent-mini"
                      onClick={() => setTermsModalOpen(true)}
                    >
                      Прочети накратко
                    </button>
                  </span>
                </label>
                {errors.privacy_consent && touched.privacy_consent && (
                  <div className="tst-field-error">
                    {errors.privacy_consent}
                  </div>
                )}
              </div>

              <button
                className="tst-btn tst-reserve-submit"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Изпращане..." : "Резервирай маса"}
              </button>

              {submitStatus.message && submitStatus.type === "error" && (
                <div className={`tst-form-status ${submitStatus.type}`}>
                  <h5 style={{ color: "#f44336" }}>{submitStatus.message}</h5>
                </div>
              )}
            </form>
          );
        }}
      </Formik>
      {/* reservation form end */}

      <style jsx>{`
        .tst-color-darkgreen {
          color: #0b2e13;
        }
        .text-primary-yellow {
          color: #e0a800;
        }

        .tst-field-error {
          color: #f44336;
          font-size: 13px;
          margin-top: 5px;
          margin-bottom: 10px;
        }

        input.error,
        textarea.error,
        select.error {
          border-color: #f44336 !important;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #7e2010;
          outline: none;
          box-shadow: 0 0 0 3px rgba(126, 32, 16, 0.1);
        }

        .tst-form-status {
          margin-top: 20px;
          padding: 15px;
          border-radius: 8px;
          animation: slideIn 0.3s ease;
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

        .tst-reservation-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 9999;
        }

        .tst-reservation-modal {
          width: 100%;
          max-width: 520px;
          background: #fff;
          border-radius: 14px;
          padding: 22px;
          box-shadow: 0 12px 34px rgba(0, 0, 0, 0.25);
        }

        .tst-guests-row {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          flex-wrap: wrap;
        }

        .tst-guests-input {
          min-width: 0;
          flex: 1 1 auto;
        }

        .tst-guests-input input {
          width: 100%;
        }

        .tst-guest-chip-text {
          margin-bottom: 20px;
        }

        .tst-reserve-submit {
          display: block;
          margin-left: auto;
          margin-right: auto;
          min-width: 220px;
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

        .tst-privacy-consent-mini {
          margin-left: 10px;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          text-decoration: underline;
          color: inherit;
          opacity: 0.85;
        }

        @media (max-width: 767px) {
          .tst-reserve-submit {
            width: 100%;
            min-width: 0;
          }
        }

        /* Responsive: on small screens stack input + chips nicely */
        @media (max-width: 767px) {
          .tst-guests-row {
            flex-direction: column;
            gap: 10px;
          }

          .tst-guests-input {
            min-width: 0;
            width: 100%;
            flex: 1 1 auto;
          }
        }
      `}</style>
    </>
  );
};
export default ReservationForm;
