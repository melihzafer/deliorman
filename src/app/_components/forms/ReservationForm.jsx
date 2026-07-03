"use client";

import { Link } from "@/src/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import useReservationForm from "./reservation/useReservationForm";
import MiniCalendar from "./reservation/MiniCalendar";
import GuestIcons from "./reservation/GuestIcons";
import formStyles from "./reservation/formStyles";

const stepVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

const ReservationForm = () => {
  const {
    step, direction, values, errors, submitStatus, isSubmitting, successData,
    termsModalOpen, setTermsModalOpen,
    stepLabels, timeSlots,
    formatDateLocale, updateField, handleInputChange,
    goNext, goBack, handleSubmit, downloadIcs, getTimeSlotsForDate,
    resetForm, t, tc,
  } = useReservationForm();



  // ── Success state ──
  if (successData) {
    return (
      <>
        <motion.div className="rsv-success"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}>
          <div className="rsv-success-icon" aria-hidden="true">
            <motion.svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="34" fill="none" stroke="rgba(46,204,113,0.2)" strokeWidth="3" />
              <motion.circle cx="36" cy="36" r="34" fill="none" stroke="#2ecc71" strokeWidth="3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }} />
              <motion.path d="M22 36l9 9 19-19" fill="none" stroke="#2ecc71" strokeWidth="3.5"
                strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }} />
            </motion.svg>
          </div>
          <h4 className="rsv-success-title">{t("successTitle")}</h4>
          <p className="rsv-success-sub">{t("successSubtitle")}</p>
          <div className="rsv-success-details">
            <div className="rsv-detail-row"><span className="rsv-detail-icon">📅</span><span>{formatDateLocale(successData.values.date)}</span></div>
            <div className="rsv-detail-row"><span className="rsv-detail-icon">🕒</span><span>{successData.values.time} {t("hoursLabel")}</span></div>
            <div className="rsv-detail-row"><span className="rsv-detail-icon">👥</span><span>{successData.values.person} {Number(successData.values.person) === 1 ? t("guestSingular") : t("guestPlural")}</span></div>
            <div className="rsv-detail-row"><span className="rsv-detail-icon">📞</span><span>{successData.phone}</span></div>
          </div>
          <p className="rsv-success-note">
            {t("confirmationCallNote")}
          </p>
          <div className="rsv-success-actions">
            <button type="button" className="tst-btn rsv-btn-ics" onClick={() => downloadIcs(successData.values)}>
              {t("addToCalendar")}
            </button>
            <button type="button" className="tst-btn tst-btn-2" onClick={resetForm}>{t("newReservation")}</button>
          </div>
          <p className="rsv-success-phone-note">{t("forChanges")} <a href="tel:+359894766273">+359 89 4766273</a></p>
        </motion.div>
        <style jsx>{formStyles}</style>
      </>
    );
  }

  // ── Main multi-step form ──
  return (
    <>
      {termsModalOpen && (
        <div className="rsv-modal-overlay" role="dialog" aria-modal="true"
          aria-label={t("termsModalTitle")}
          onMouseDown={(e) => { if (e.target === e.currentTarget) setTermsModalOpen(false); }}>
          <div className="rsv-modal">
            <h4 className="tst-mb-10" style={{ color: "#0b2e13" }}>{t("termsModalTitle")}</h4>
            <p className="tst-text tst-mb-15" style={{ opacity: 0.9 }}>
              {t("termsModalText1")}
            </p>
            <p className="tst-text tst-mb-20" style={{ opacity: 0.85 }}>
              {t("termsModalText2") || "Full text can be read here:"}{" "}
              <Link href="/terms" className="tst-color tst-anima-link">{t("termsAndConditions")}</Link>.
            </p>
            <button className="tst-btn" type="button" onClick={() => setTermsModalOpen(false)}>{t("closeButton")}</button>
          </div>
        </div>
      )}

      <div className="rsv-wizard">
        {/* Progress indicator */}
        <div className="rsv-progress">
          {stepLabels.map((label, i) => {
            const num = i + 1;
            const isActive = num === step;
            const isDone = num < step;
            return (
              <div key={num} className={`rsv-progress-step ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}>
                <div className="rsv-progress-circle">
                  {isDone ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M6.5 11.5L3 8l1-1 2.5 2.5L12 4l1 1z" />
                    </svg>
                  ) : num}
                </div>
                <span className="rsv-progress-label">{label}</span>
                {num < 3 && <div className="rsv-progress-line" />}
              </div>
            );
          })}
        </div>

        <form id="reservationForm" onSubmit={(e) => {
          e.preventDefault();
          if (step < 3) goNext(); else handleSubmit();
        }}>
          {/* Honeypot */}
          <div style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden" }} aria-hidden="true">
            <input type="text" name="company" tabIndex={-1} autoComplete="off" onChange={handleInputChange} value={values.company || ""} />
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={step} custom={direction} variants={stepVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="rsv-step-content">

              {/* Step 1: Date & Time */}
              {step === 1 && (
                <div className="rsv-step">
                  <h5 className="rsv-step-title">{t("step1Title")}</h5>
                  <MiniCalendar selectedDate={values.date}
                    onSelect={(d) => {
                      updateField("date", d);
                      const newSlots = getTimeSlotsForDate(d);
                      if (values.time && !newSlots.includes(values.time)) updateField("time", "");
                    }} />
                  {errors.date && <div className="rsv-field-error" role="alert">{errors.date}</div>}

                  {values.date && (
                    <div className="rsv-time-section">
                      <p className="rsv-time-label">{t("selectTime")}</p>
                      {timeSlots.length === 0 ? (
                        <p className="rsv-no-slots">{t("noSlotsAvailable")}</p>
                      ) : (
                        <div className="rsv-time-grid">
                          {timeSlots.map((ts) => (
                            <button key={ts} type="button"
                              className={`rsv-time-slot ${values.time === ts ? "selected" : ""}`}
                              onClick={() => updateField("time", ts)}
                              aria-pressed={values.time === ts}
                              aria-label={t("selectTimeSlot", { time: ts })}
                            >
                              {ts}
                            </button>
                          ))}
                        </div>
                      )}
                      {errors.time && <div className="rsv-field-error" role="alert">{errors.time}</div>}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Guests & Contact */}
              {step === 2 && (
                <div className="rsv-step">
                  <h5 className="rsv-step-title">{t("step2Title")}</h5>
                  <div className="rsv-guest-section">
                    <label className="rsv-label">{t("guestCount")}</label>
                    <div className="rsv-guest-counter">
                      <button type="button" className="rsv-counter-btn"
                        disabled={values.person <= 1}
                        onClick={() => updateField("person", Math.max(1, Number(values.person) - 1))}
                        aria-label={t("decreaseGuests")}>−</button>
                      <input type="number" className={`rsv-counter-value ${errors.person ? "error" : ""}`}
                        name="person" value={values.person} min={1} max={20}
                        onChange={(e) => {
                          const v = e.target.value === "" ? "" : Math.max(1, Math.min(20, parseInt(e.target.value, 10) || 1));
                          updateField("person", v);
                        }} inputMode="numeric" aria-label={t("guestCount")} />
                      <button type="button" className="rsv-counter-btn"
                        disabled={values.person >= 20}
                        onClick={() => updateField("person", Math.min(20, Number(values.person) + 1))}
                        aria-label={t("increaseGuests")}>+</button>
                    </div>
                    {Number(values.person) > 0 && Number(values.person) <= 20 && (
                      <GuestIcons count={Number(values.person)} />
                    )}
                    {errors.person && <div className="rsv-field-error" role="alert">{errors.person}</div>}
                  </div>
                  <div className="rsv-contact-fields">
                    <div className="rsv-field-row">
                      <div className="rsv-field">
                        <input
                          id="reservation-first-name"
                          type="text"
                          placeholder={t("firstNamePlaceholder")}
                          name="first_name"
                          value={values.first_name}
                          onChange={handleInputChange} autoComplete="given-name" aria-required="true"
                          aria-label={t("reviewName")}
                          aria-invalid={Boolean(errors.first_name)}
                          aria-describedby={errors.first_name ? "reservation-first-name-error" : undefined}
                          className={errors.first_name ? "error" : ""} />
                        {errors.first_name && <div id="reservation-first-name-error" className="rsv-field-error" role="alert">{errors.first_name}</div>}
                      </div>
                      <div className="rsv-field">
                        <input
                          id="reservation-last-name"
                          type="text"
                          placeholder={t("lastNamePlaceholder")}
                          name="last_name"
                          value={values.last_name}
                          onChange={handleInputChange} autoComplete="family-name" aria-required="true"
                          aria-label={t("lastNamePlaceholder")}
                          aria-invalid={Boolean(errors.last_name)}
                          aria-describedby={errors.last_name ? "reservation-last-name-error" : undefined}
                          className={errors.last_name ? "error" : ""} />
                        {errors.last_name && <div id="reservation-last-name-error" className="rsv-field-error" role="alert">{errors.last_name}</div>}
                      </div>
                    </div>
                    <div className="rsv-field">
                      <input
                        id="reservation-phone"
                        type="tel"
                        placeholder={t("phonePlaceholder")}
                        name="phone"
                        value={values.phone}
                        onChange={handleInputChange}
                        inputMode="tel"
                        autoComplete="tel"
                        aria-required="true"
                        aria-label={t("reviewPhone")}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? "reservation-phone-error" : undefined}
                        className={errors.phone ? "error" : ""}
                      />
                      {errors.phone && <div id="reservation-phone-error" className="rsv-field-error" role="alert">{errors.phone}</div>}
                    </div>
                    <div className="rsv-field">
                      <input
                        id="reservation-email"
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        name="email"
                        value={values.email} onChange={handleInputChange}
                        autoComplete="email"
                        aria-label={t("reviewEmail")}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "reservation-email-error" : undefined}
                        className={errors.email ? "error" : ""}
                      />
                      {errors.email && <div id="reservation-email-error" className="rsv-field-error" role="alert">{errors.email}</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="rsv-step">
                  <h5 className="rsv-step-title">{t("step3Title")}</h5>
                  <div className="rsv-summary">
                    <div className="rsv-summary-row"><span className="rsv-summary-icon">📅</span>
                      <div><strong>{t("reviewDate")}</strong><p>{formatDateLocale(values.date)}</p></div></div>
                    <div className="rsv-summary-row"><span className="rsv-summary-icon">🕒</span>
                      <div><strong>{t("reviewTime")}</strong><p>{values.time} {t("hoursLabel")}</p></div></div>
                    <div className="rsv-summary-row"><span className="rsv-summary-icon">👥</span>
                      <div><strong>{t("reviewGuests")}</strong><p>{values.person} {Number(values.person) === 1 ? t("guestSingular") : t("guestPlural")}</p></div></div>
                    <div className="rsv-summary-row"><span className="rsv-summary-icon">👤</span>
                      <div><strong>{t("reviewName")}</strong><p>{values.first_name} {values.last_name}</p></div></div>
                    <div className="rsv-summary-row"><span className="rsv-summary-icon">📞</span>
                      <div><strong>{t("reviewPhone")}</strong><p>{values.phone}</p></div></div>
                    {values.email && (
                      <div className="rsv-summary-row"><span className="rsv-summary-icon">✉️</span>
                        <div><strong>{t("reviewEmail")}</strong><p>{values.email}</p></div></div>
                    )}
                  </div>

                  <div className="rsv-message-field">
                    <textarea
                      id="reservation-message"
                      placeholder={t("specialRequestsPlaceholder")}
                      name="message"
                      value={values.message} onChange={handleInputChange} rows="3"
                      aria-label={t("specialRequestsPlaceholder")}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? "reservation-message-error" : undefined}
                      className={errors.message ? "error" : ""}
                    />
                    {errors.message && <div id="reservation-message-error" className="rsv-field-error" role="alert">{errors.message}</div>}
                  </div>

                  <div className="rsv-wait-notice">
                    <span className="rsv-wait-icon">⏱️</span>
                    {t("confirmationWaitMessage")}
                  </div>

                  <div className="rsv-privacy-consent">
                    <label className="rsv-consent-label">
                      <input
                        type="checkbox"
                        name="privacy_consent"
                        onChange={handleInputChange}
                        checked={Boolean(values.privacy_consent)}
                        aria-required="true"
                        aria-invalid={Boolean(errors.privacy_consent)}
                        aria-describedby={errors.privacy_consent ? "reservation-privacy-error" : undefined}
                      />
                      <span>
                        {t("agreeWithTerms")}{" "}
                        <Link href="/terms" className="tst-color tst-anima-link">{t("termsAndConditions")}</Link>
                        {" "}{t("andPrivacyInfo")}{" "}
                        <button type="button" className="rsv-consent-mini" onClick={() => setTermsModalOpen(true)}>
                          {t("readSummary")}
                        </button>
                      </span>
                    </label>
                    {errors.privacy_consent && <div id="reservation-privacy-error" className="rsv-field-error" role="alert">{errors.privacy_consent}</div>}
                  </div>

                  {submitStatus.message && submitStatus.type === "error" && (
                    <div className="rsv-form-error" role="alert"><p>{submitStatus.message}</p></div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="rsv-nav-buttons">
            {step > 1 && (
              <button type="button" className="tst-btn tst-btn-2 rsv-nav-btn" onClick={goBack}>{t("backButton")}</button>
            )}
            <div className="rsv-nav-spacer" />
            {step < 3 ? (
              <button type="button" className="tst-btn rsv-nav-btn" onClick={goNext}>{t("nextButton")}</button>
            ) : (
              <button type="submit" className="tst-btn rsv-nav-btn rsv-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? t("submitButtonSending") : t("submitButtonText")}
              </button>
            )}
          </div>
        </form>
      </div>

      <style jsx>{formStyles}</style>
    </>
  );
};

export default ReservationForm;

