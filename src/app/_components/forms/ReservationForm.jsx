"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { validateBgPhone } from "@library/bgPhoneUtils";

// Schedule: Mon-Wed 07-17, Thu-Sun 07-23 (from schedule.json)
const SCHEDULE = [
  { days: [1, 2, 3], from: { hours: 7, minutes: 0 }, to: { hours: 17, minutes: 0 } },
  { days: [4, 5, 6, 0], from: { hours: 7, minutes: 0 }, to: { hours: 23, minutes: 0 } },
];

const BG_DAY_NAMES_FULL = ["неделя", "понеделник", "вторник", "сряда", "четвъртък", "петък", "събота"];
const BG_MONTH_NAMES = [
  "януари", "февруари", "март", "април", "май", "юни",
  "юли", "август", "септември", "октомври", "ноември", "декември",
];

const STEP_LABELS = ["Дата и час", "Гости и контакт", "Потвърждение"];

function parseDateTimeLocal(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const [y, m, d] = String(dateStr).split("-").map(Number);
  const [hh, mm] = String(timeStr).split(":").map(Number);
  if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getScheduleForDay(dayOfWeek) {
  return SCHEDULE.find((s) => s.days.includes(dayOfWeek)) || null;
}

function getTimeSlotsForDate(dateStr) {
  if (!dateStr) return [];
  const d = new Date(dateStr + "T00:00:00");
  const sched = getScheduleForDay(d.getDay());
  if (!sched) return [];
  const slots = [];
  for (let h = sched.from.hours; h < sched.to.hours; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
  }
  return slots;
}

function isRestaurantOpen(dayOfWeek) {
  return !!getScheduleForDay(dayOfWeek);
}

function formatDateBg(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getDate()} ${BG_MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}, ${BG_DAY_NAMES_FULL[d.getDay()]}`;
}

function generateIcsContent(values) {
  const dt = parseDateTimeLocal(values.date, values.time);
  if (!dt) return null;
  const end = new Date(dt.getTime() + 2 * 60 * 60 * 1000);
  const fmt = (d) =>
    d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0") + "T" +
    String(d.getHours()).padStart(2, "0") +
    String(d.getMinutes()).padStart(2, "0") + "00";
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Deliorman//Reservation//BG",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(dt)}`, `DTEND:${fmt(end)}`,
    `SUMMARY:Резервация в Делиорман - ${values.person} гости`,
    `DESCRIPTION:Резервация за ${values.first_name} ${values.last_name}\\nТелефон: ${values.phone}\\nГости: ${values.person}${values.message ? "\\nСъобщение: " + values.message : ""}`,
    "LOCATION:Ресторант Делиорман",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}

function downloadIcs(values) {
  const content = generateIcsContent(values);
  if (!content) return;
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "reservation-deliorman.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function GuestIcons({ count }) {
  const shown = Math.min(count, 8);
  const extra = count > 8 ? count - 8 : 0;
  return (
    <div className="rsv-guest-icons" aria-hidden="true">
      {Array.from({ length: shown }).map((_, i) => (
        <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="7" r="4" />
          <path d="M12 13c-5 0-8 2.5-8 5v1h16v-1c0-2.5-3-5-8-5z" />
        </svg>
      ))}
      {extra > 0 && <span className="rsv-guest-extra">+{extra}</span>}
    </div>
  );
}

function MiniCalendar({ selectedDate, onSelect }) {
  const today = useMemo(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0); return d;
  }, []);

  const [viewMonth, setViewMonth] = useState(() => {
    if (selectedDate) {
      const d = new Date(selectedDate + "T00:00:00");
      return { year: d.getFullYear(), month: d.getMonth() };
    }
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  const maxDate = useMemo(() => {
    const m = new Date(today);
    m.setMonth(today.getMonth() + 1);
    if (today.getDate() !== m.getDate()) m.setDate(0);
    return m;
  }, [today]);

  const calendarDays = useMemo(() => {
    const first = new Date(viewMonth.year, viewMonth.month, 1);
    const lastDay = new Date(viewMonth.year, viewMonth.month + 1, 0).getDate();
    let startDay = first.getDay() - 1;
    if (startDay < 0) startDay = 6;
    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let d = 1; d <= lastDay; d++) {
      const date = new Date(viewMonth.year, viewMonth.month, d);
      date.setHours(0, 0, 0, 0);
      const dateStr = toDateStr(date);
      const isPast = date < today;
      const isFuture = date > maxDate;
      const isOpen = isRestaurantOpen(date.getDay());
      const isToday = date.getTime() === today.getTime();
      const isSelected = dateStr === selectedDate;
      const disabled = isPast || isFuture || !isOpen;
      days.push({ day: d, dateStr, isPast, isFuture, isOpen, isToday, isSelected, disabled });
    }
    return days;
  }, [viewMonth, today, maxDate, selectedDate]);

  const canGoBack = viewMonth.year > today.getFullYear() || (viewMonth.year === today.getFullYear() && viewMonth.month > today.getMonth());
  const canGoForward = viewMonth.year < maxDate.getFullYear() || (viewMonth.year === maxDate.getFullYear() && viewMonth.month < maxDate.getMonth());

  return (
    <div className="rsv-calendar">
      <div className="rsv-calendar-header">
        <button type="button" className="rsv-cal-nav" disabled={!canGoBack}
          onClick={() => setViewMonth((v) => {
            const d = new Date(v.year, v.month - 1, 1);
            return { year: d.getFullYear(), month: d.getMonth() };
          })} aria-label="Предишен месец">‹</button>
        <span className="rsv-cal-title">
          {BG_MONTH_NAMES[viewMonth.month].charAt(0).toUpperCase() + BG_MONTH_NAMES[viewMonth.month].slice(1)}{" "}{viewMonth.year}
        </span>
        <button type="button" className="rsv-cal-nav" disabled={!canGoForward}
          onClick={() => setViewMonth((v) => {
            const d = new Date(v.year, v.month + 1, 1);
            return { year: d.getFullYear(), month: d.getMonth() };
          })} aria-label="Следващ месец">›</button>
      </div>
      <div className="rsv-calendar-weekdays">
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"].map((d) => (
          <div key={d} className="rsv-cal-weekday">{d}</div>
        ))}
      </div>
      <div className="rsv-calendar-grid">
        {calendarDays.map((cell, i) => {
          if (!cell) return <div key={`e-${i}`} className="rsv-cal-empty" />;
          let cls = "rsv-cal-day";
          if (cell.disabled) cls += " rsv-cal-disabled";
          if (cell.isToday) cls += " rsv-cal-today";
          if (cell.isSelected) cls += " rsv-cal-selected";
          if (!cell.isOpen && !cell.isPast && !cell.isFuture) cls += " rsv-cal-closed";
          return (
            <button key={cell.dateStr} type="button" className={cls} disabled={cell.disabled}
              onClick={() => onSelect(cell.dateStr)}
              aria-label={`${cell.day} ${BG_MONTH_NAMES[viewMonth.month]}`}
              aria-pressed={cell.isSelected}>{cell.day}</button>
          );
        })}
      </div>
      <div className="rsv-calendar-legend">
        <span className="rsv-legend-item"><span className="rsv-legend-dot rsv-legend-today" /> днес</span>
        <span className="rsv-legend-item"><span className="rsv-legend-dot rsv-legend-closed" /> затворено</span>
      </div>
    </div>
  );
}

const stepVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

const ReservationForm = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [values, setValues] = useState({
    date: "", time: "", person: 2, first_name: "", last_name: "",
    phone: "", email: "", message: "", company: "", privacy_consent: false,
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const updateField = useCallback((name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => { if (e[name]) { const next = { ...e }; delete next[name]; return next; } return e; });
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    updateField(name, type === "checkbox" ? checked : value);
  }, [updateField]);

  const timeSlots = useMemo(() => {
    const allSlots = getTimeSlotsForDate(values.date);
    if (!values.date) return allSlots;
    const now = new Date();
    const minAllowed = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    return allSlots.filter((t) => {
      const dt = parseDateTimeLocal(values.date, t);
      return dt && dt.getTime() >= minAllowed.getTime();
    });
  }, [values.date]);

  const validateStep = useCallback((stepNum) => {
    const errs = {};
    if (stepNum === 1) {
      if (!values.date) errs.date = "Моля изберете дата";
      if (!values.time) errs.time = "Моля изберете час";
      if (values.date && values.time) {
        const dt = parseDateTimeLocal(values.date, values.time);
        if (dt) {
          const now = new Date();
          const minAllowed = new Date(now.getTime() + 4 * 60 * 60 * 1000);
          if (dt.getTime() < now.getTime()) errs.time = "Моля изберете бъдещ час";
          else if (dt.getTime() < minAllowed.getTime())
            errs.time = "Резервация може да се направи най-рано след 4 часа";
        }
      }
    } else if (stepNum === 2) {
      const gn = Number(values.person);
      if (!Number.isFinite(gn) || !Number.isInteger(gn) || gn < 1)
        errs.person = "Моля въведете валиден брой гости (мин. 1)";
      else if (gn > 20)
        errs.person = "Максимум 20 гости онлайн. За повече — обадете се.";
      if (!values.first_name || values.first_name.trim().length < 2)
        errs.first_name = "Името трябва да е поне 2 символа";
      if (!values.last_name || values.last_name.trim().length < 2)
        errs.last_name = "Фамилията трябва да е поне 2 символа";
      const phoneCheck = validateBgPhone(values.phone, { emptyMessage: "Задължително поле" });
      if (!phoneCheck.ok) errs.phone = phoneCheck.message;
      if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
        errs.email = "Невалиден имейл адрес";
    } else if (stepNum === 3) {
      if (!values.privacy_consent)
        errs.privacy_consent = "Моля, потвърдете, че сте се запознали с правилата.";
      const gn = Number(values.person);
      if (gn > 10 && (!values.message || values.message.trim().length < 5))
        errs.message = "За групи над 10 души, моля напишете кратък коментар.";
    }
    return errs;
  }, [values]);

  const goNext = useCallback(() => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  }, [step, validateStep]);

  const goBack = useCallback(() => {
    setErrors({});
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const handleSubmit = useCallback(async () => {
    const errs = validateStep(3);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    const phoneCheck = validateBgPhone(values.phone, { emptyMessage: "Задължително поле" });
    if (!phoneCheck.ok) {
      setSubmitStatus({ type: "error", message: phoneCheck.message });
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    data.append("first_name", values.first_name);
    data.append("last_name", values.last_name);
    data.append("phone", phoneCheck.normalized);
    data.append("person", String(values.person));
    data.append("time", values.time);
    data.append("date", values.date);
    data.append("message", values.message);
    data.append("company", values.company);
    data.append("privacy_consent", values.privacy_consent ? "true" : "false");

    try {
      const response = await fetch("/api/reservation", { method: "POST", body: data });
      const result = await response.json();
      if (response.ok && result.success) {
        setSuccessData({
          phone: result.data?.phone || phoneCheck.normalized,
          values: { ...values, phone: phoneCheck.normalized },
        });
      } else {
        const errorMessages = result.errors?.map((e) => e.message).join(", ") || "Възникна проблем";
        setSubmitStatus({ type: "error", message: errorMessages });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus({ type: "error", message: "Грешка при резервацията. Моля, обадете се на +359 89 4766273." });
    }
    setIsSubmitting(false);
  }, [values, validateStep]);

  useEffect(() => {
    if (!termsModalOpen) return;
    const onKeyDown = (e) => { if (e.key === "Escape") setTermsModalOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [termsModalOpen]);

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
          <h4 className="rsv-success-title">Заявката е изпратена!</h4>
          <p className="rsv-success-sub">Изчакайте обаждане за потвърждение</p>
          <div className="rsv-success-details">
            <div className="rsv-detail-row"><span className="rsv-detail-icon">📅</span><span>{formatDateBg(successData.values.date)}</span></div>
            <div className="rsv-detail-row"><span className="rsv-detail-icon">🕒</span><span>{successData.values.time} ч.</span></div>
            <div className="rsv-detail-row"><span className="rsv-detail-icon">👥</span><span>{successData.values.person} {Number(successData.values.person) === 1 ? "гост" : "гости"}</span></div>
            <div className="rsv-detail-row"><span className="rsv-detail-icon">📞</span><span>{successData.phone}</span></div>
          </div>
          <p className="rsv-success-note">
            Ще се обадим на посочения телефон за потвърждение. Докато не бъде потвърдена по телефона, резервацията не е валидна.
          </p>
          <div className="rsv-success-actions">
            <button type="button" className="tst-btn rsv-btn-ics" onClick={() => downloadIcs(successData.values)}>
              📥 Добави в календар
            </button>
            <button type="button" className="tst-btn tst-btn-2" onClick={() => {
              setSuccessData(null); setStep(1);
              setValues({ date: "", time: "", person: 2, first_name: "", last_name: "", phone: "", email: "", message: "", company: "", privacy_consent: false });
            }}>Нова резервация</button>
          </div>
          <p className="rsv-success-phone-note">За промени: <a href="tel:+359894766273">+359 89 4766273</a></p>
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
          aria-label="Правила и условия / Лични данни"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setTermsModalOpen(false); }}>
          <div className="rsv-modal">
            <h4 className="tst-mb-10" style={{ color: "#0b2e13" }}>Лични данни при резервация</h4>
            <p className="tst-text tst-mb-15" style={{ opacity: 0.9 }}>
              За да обработим заявката Ви, събираме име, фамилия и телефон,
              както и дата/час и брой гости. Използваме данните единствено за
              потвърждение и организация на резервацията.
            </p>
            <p className="tst-text tst-mb-20" style={{ opacity: 0.85 }}>
              Пълният текст с правила и информация за обработката на лични данни
              може да прочетете тук:{" "}
              <Link href="/terms" className="tst-color tst-anima-link">Правила и условия / Лични данни</Link>.
            </p>
            <button className="tst-btn" type="button" onClick={() => setTermsModalOpen(false)}>Затвори</button>
          </div>
        </div>
      )}

      <div className="rsv-wizard">
        {/* Progress indicator */}
        <div className="rsv-progress">
          {STEP_LABELS.map((label, i) => {
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
                  <h5 className="rsv-step-title">Изберете дата и час</h5>
                  <MiniCalendar selectedDate={values.date}
                    onSelect={(d) => {
                      updateField("date", d);
                      const newSlots = getTimeSlotsForDate(d);
                      if (values.time && !newSlots.includes(values.time)) updateField("time", "");
                    }} />
                  {errors.date && <div className="rsv-field-error" role="alert">{errors.date}</div>}

                  {values.date && (
                    <div className="rsv-time-section">
                      <p className="rsv-time-label">Изберете час:</p>
                      {timeSlots.length === 0 ? (
                        <p className="rsv-no-slots">Няма свободни часове за тази дата. Моля, изберете друга.</p>
                      ) : (
                        <div className="rsv-time-grid">
                          {timeSlots.map((t) => (
                            <button key={t} type="button"
                              className={`rsv-time-slot ${values.time === t ? "selected" : ""}`}
                              onClick={() => updateField("time", t)}
                              aria-pressed={values.time === t}
                              aria-label={`Избери час ${t}`}
                            >
                              {t}
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
                  <h5 className="rsv-step-title">Гости и данни за контакт</h5>
                  <div className="rsv-guest-section">
                    <label className="rsv-label">Брой гости</label>
                    <div className="rsv-guest-counter">
                      <button type="button" className="rsv-counter-btn"
                        disabled={values.person <= 1}
                        onClick={() => updateField("person", Math.max(1, Number(values.person) - 1))}
                        aria-label="Намали брой гости">−</button>
                      <input type="number" className={`rsv-counter-value ${errors.person ? "error" : ""}`}
                        name="person" value={values.person} min={1} max={20}
                        onChange={(e) => {
                          const v = e.target.value === "" ? "" : Math.max(1, Math.min(20, parseInt(e.target.value, 10) || 1));
                          updateField("person", v);
                        }} inputMode="numeric" aria-label="Брой гости" />
                      <button type="button" className="rsv-counter-btn"
                        disabled={values.person >= 20}
                        onClick={() => updateField("person", Math.min(20, Number(values.person) + 1))}
                        aria-label="Увеличи брой гости">+</button>
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
                          placeholder="Име *"
                          name="first_name"
                          value={values.first_name}
                          onChange={handleInputChange} autoComplete="given-name" aria-required="true"
                          aria-label="Име"
                          aria-invalid={Boolean(errors.first_name)}
                          aria-describedby={errors.first_name ? "reservation-first-name-error" : undefined}
                          className={errors.first_name ? "error" : ""} />
                        {errors.first_name && <div id="reservation-first-name-error" className="rsv-field-error" role="alert">{errors.first_name}</div>}
                      </div>
                      <div className="rsv-field">
                        <input
                          id="reservation-last-name"
                          type="text"
                          placeholder="Фамилия *"
                          name="last_name"
                          value={values.last_name}
                          onChange={handleInputChange} autoComplete="family-name" aria-required="true"
                          aria-label="Фамилия"
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
                        placeholder="Телефон * (напр. 0888123456)"
                        name="phone"
                        value={values.phone}
                        onChange={handleInputChange}
                        inputMode="tel"
                        autoComplete="tel"
                        aria-required="true"
                        aria-label="Телефон"
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
                        placeholder="Имейл (незадължително)"
                        name="email"
                        value={values.email} onChange={handleInputChange}
                        autoComplete="email"
                        aria-label="Имейл"
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
                  <h5 className="rsv-step-title">Преглед и потвърждение</h5>
                  <div className="rsv-summary">
                    <div className="rsv-summary-row"><span className="rsv-summary-icon">📅</span>
                      <div><strong>Дата</strong><p>{formatDateBg(values.date)}</p></div></div>
                    <div className="rsv-summary-row"><span className="rsv-summary-icon">🕒</span>
                      <div><strong>Час</strong><p>{values.time} ч.</p></div></div>
                    <div className="rsv-summary-row"><span className="rsv-summary-icon">👥</span>
                      <div><strong>Гости</strong><p>{values.person} {Number(values.person) === 1 ? "гост" : "гости"}</p></div></div>
                    <div className="rsv-summary-row"><span className="rsv-summary-icon">👤</span>
                      <div><strong>Име</strong><p>{values.first_name} {values.last_name}</p></div></div>
                    <div className="rsv-summary-row"><span className="rsv-summary-icon">📞</span>
                      <div><strong>Телефон</strong><p>{values.phone}</p></div></div>
                    {values.email && (
                      <div className="rsv-summary-row"><span className="rsv-summary-icon">✉️</span>
                        <div><strong>Имейл</strong><p>{values.email}</p></div></div>
                    )}
                  </div>

                  <div className="rsv-message-field">
                    <textarea
                      id="reservation-message"
                      placeholder="Специални пожелания (незадължително)"
                      name="message"
                      value={values.message} onChange={handleInputChange} rows="3"
                      aria-label="Специални пожелания"
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? "reservation-message-error" : undefined}
                      className={errors.message ? "error" : ""}
                    />
                    {errors.message && <div id="reservation-message-error" className="rsv-field-error" role="alert">{errors.message}</div>}
                  </div>

                  <div className="rsv-wait-notice">
                    <span className="rsv-wait-icon">⏱️</span>
                    Очаквайте обаждане за потвърждение в рамките на 30 минути (в работно време).
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
                        Съгласен/а съм с{" "}
                        <Link href="/terms" className="tst-color tst-anima-link">правилата и условията</Link>
                        {" "}и информацията за лични данни.{" "}
                        <button type="button" className="rsv-consent-mini" onClick={() => setTermsModalOpen(true)}>
                          Прочети накратко
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
              <button type="button" className="tst-btn tst-btn-2 rsv-nav-btn" onClick={goBack}>← Назад</button>
            )}
            <div className="rsv-nav-spacer" />
            {step < 3 ? (
              <button type="button" className="tst-btn rsv-nav-btn" onClick={goNext}>Напред →</button>
            ) : (
              <button type="submit" className="tst-btn rsv-nav-btn rsv-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Изпращане..." : "Изпрати резервация"}
              </button>
            )}
          </div>
        </form>
      </div>

      <style jsx>{formStyles}</style>
    </>
  );
};

const formStyles = `
  .rsv-wizard { max-width: 560px; margin: 0 auto; text-align: left; }

  /* Progress indicator */
  .rsv-progress { display: flex; align-items: flex-start; justify-content: center; gap: 0; margin-bottom: 32px; padding: 0 8px; }
  .rsv-progress-step { display: flex; flex-direction: column; align-items: center; position: relative; flex: 1; min-width: 0; }
  .rsv-progress-circle {
    width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 14px; background: rgba(229,235,239,1); color: rgba(26,47,51,0.5);
    transition: all 0.3s ease; position: relative; z-index: 1; flex-shrink: 0;
  }
  .rsv-progress-step.active .rsv-progress-circle { background: rgba(243,156,18,1); color: #fff; box-shadow: 0 2px 8px rgba(243,156,18,0.35); }
  .rsv-progress-step.done .rsv-progress-circle { background: rgba(46,204,113,1); color: #fff; }
  .rsv-progress-label { font-size: 11px; margin-top: 6px; color: rgba(26,47,51,0.5); text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; transition: color 0.3s ease; }
  .rsv-progress-step.active .rsv-progress-label { color: rgba(243,156,18,1); font-weight: 600; }
  .rsv-progress-step.done .rsv-progress-label { color: rgba(46,204,113,1); }
  .rsv-progress-line { position: absolute; top: 18px; left: calc(50% + 22px); right: calc(-50% + 22px); height: 2px; background: rgba(229,235,239,1); z-index: 0; }
  .rsv-progress-step.done .rsv-progress-line { background: rgba(46,204,113,1); }

  /* Step content */
  .rsv-step-content { min-height: 320px; }
  .rsv-step-title { text-align: center; margin-bottom: 20px; font-size: 18px; }

  /* Calendar */
  .rsv-calendar { background: #fff; border: 1px solid rgba(229,235,239,1); border-radius: 12px; padding: 16px; margin-bottom: 16px; }
  .rsv-calendar-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .rsv-cal-nav {
    background: none; border: 1px solid rgba(229,235,239,1); border-radius: 8px; width: 36px; height: 36px;
    font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: rgba(26,47,51,1); transition: all 0.2s;
  }
  .rsv-cal-nav:hover:not(:disabled) { background: rgba(243,156,18,0.1); border-color: rgba(243,156,18,0.3); }
  .rsv-cal-nav:disabled { opacity: 0.3; cursor: default; }
  .rsv-cal-title { font-weight: 600; font-size: 15px; }
  .rsv-calendar-weekdays { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; margin-bottom: 4px; }
  .rsv-cal-weekday { text-align: center; font-size: 11px; font-weight: 700; color: rgba(26,47,51,0.45); padding: 4px 0; text-transform: uppercase; }
  .rsv-calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
  .rsv-cal-empty { aspect-ratio: 1; }
  .rsv-cal-day {
    aspect-ratio: 1; border: none; border-radius: 8px; background: transparent; cursor: pointer;
    font-size: 14px; font-weight: 500; color: rgba(26,47,51,1); transition: all 0.15s;
    display: flex; align-items: center; justify-content: center; position: relative;
  }
  .rsv-cal-day:hover:not(:disabled) { background: rgba(243,156,18,0.12); }
  .rsv-cal-day.rsv-cal-disabled { color: rgba(26,47,51,0.2); cursor: default; }
  .rsv-cal-day.rsv-cal-closed { color: rgba(231,76,60,0.35); text-decoration: line-through; }
  .rsv-cal-day.rsv-cal-today { font-weight: 700; box-shadow: inset 0 0 0 2px rgba(243,156,18,0.4); }
  .rsv-cal-day.rsv-cal-selected { background: rgba(243,156,18,1) !important; color: #fff !important; font-weight: 700; }
  .rsv-calendar-legend { display: flex; gap: 16px; margin-top: 10px; justify-content: center; }
  .rsv-legend-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: rgba(26,47,51,0.55); }
  .rsv-legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
  .rsv-legend-today { box-shadow: inset 0 0 0 2px rgba(243,156,18,0.5); }
  .rsv-legend-closed { background: rgba(231,76,60,0.25); }

  /* Time slots */
  .rsv-time-section { margin-top: 16px; }
  .rsv-time-label { font-size: 14px; font-weight: 600; margin-bottom: 10px; color: rgba(26,47,51,0.75); }
  .rsv-time-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); gap: 8px; }
  .rsv-time-slot {
    padding: 10px 6px; border: 1.5px solid rgba(229,235,239,1); border-radius: 8px; background: #fff;
    cursor: pointer; font-size: 14px; font-weight: 500; text-align: center; transition: all 0.15s; color: rgba(26,47,51,1);
  }
  .rsv-time-slot:hover { border-color: rgba(243,156,18,0.5); background: rgba(243,156,18,0.06); }
  .rsv-time-slot.selected { background: rgba(243,156,18,1); border-color: rgba(243,156,18,1); color: #fff; font-weight: 700; }
  .rsv-no-slots { color: rgba(231,76,60,0.8); font-size: 13px; text-align: center; padding: 12px; }

  /* Guest counter */
  .rsv-guest-section { margin-bottom: 24px; }
  .rsv-label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 8px; color: rgba(26,47,51,0.75); }
  .rsv-guest-counter { display: flex; align-items: center; gap: 0; justify-content: center; margin-bottom: 8px; }
  .rsv-counter-btn {
    width: 48px; height: 48px; border: 1.5px solid rgba(229,235,239,1); background: #fff;
    font-size: 22px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.15s; color: rgba(26,47,51,1); user-select: none;
  }
  .rsv-counter-btn:first-child { border-radius: 10px 0 0 10px; }
  .rsv-counter-btn:last-child { border-radius: 0 10px 10px 0; }
  .rsv-counter-btn:hover:not(:disabled) { background: rgba(243,156,18,0.1); border-color: rgba(243,156,18,0.3); }
  .rsv-counter-btn:disabled { opacity: 0.3; cursor: default; }
  .rsv-counter-value {
    width: 64px; height: 48px; text-align: center; font-size: 20px; font-weight: 700;
    border: 1.5px solid rgba(229,235,239,1); border-left: none; border-right: none;
    background: #fff; color: rgba(26,47,51,1); -moz-appearance: textfield; appearance: textfield; padding: 0;
  }
  .rsv-counter-value::-webkit-inner-spin-button, .rsv-counter-value::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  .rsv-guest-icons { display: flex; justify-content: center; gap: 3px; color: rgba(243,156,18,0.7); flex-wrap: wrap; margin-top: 4px; }
  .rsv-guest-extra { font-size: 13px; font-weight: 600; color: rgba(243,156,18,0.8); align-self: center; margin-left: 2px; }

  /* Contact fields */
  .rsv-contact-fields { display: flex; flex-direction: column; gap: 12px; }
  .rsv-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .rsv-field input, .rsv-field textarea { width: 100%; }

  /* Summary */
  .rsv-summary { background: rgba(242,246,247,0.6); border: 1px solid rgba(229,235,239,1); border-radius: 12px; padding: 16px; margin-bottom: 16px; }
  .rsv-summary-row { display: flex; align-items: flex-start; gap: 12px; padding: 8px 0; border-bottom: 1px solid rgba(229,235,239,0.5); }
  .rsv-summary-row:last-child { border-bottom: none; }
  .rsv-summary-icon { font-size: 18px; flex-shrink: 0; width: 28px; text-align: center; }
  .rsv-summary-row strong { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(26,47,51,0.5); display: block; }
  .rsv-summary-row p { margin: 2px 0 0; font-size: 15px; font-weight: 500; color: rgba(26,47,51,1); }

  /* Wait notice */
  .rsv-wait-notice {
    display: flex; align-items: center; gap: 8px; background: rgba(243,156,18,0.08);
    border: 1px solid rgba(243,156,18,0.2); border-radius: 10px; padding: 12px 14px;
    font-size: 13px; margin-bottom: 16px; color: rgba(26,47,51,0.8);
  }
  .rsv-wait-icon { font-size: 18px; flex-shrink: 0; }

  /* Privacy consent */
  .rsv-privacy-consent { margin-bottom: 12px; }
  .rsv-consent-label { display: flex; gap: 10px; align-items: flex-start; cursor: pointer; user-select: none; font-size: 13px; line-height: 1.5; }
  .rsv-consent-label input[type="checkbox"] { width: 22px; height: 22px; flex-shrink: 0; margin-top: 1px; cursor: pointer; }
  .rsv-consent-mini { margin-left: 4px; padding: 0; border: none; background: transparent; cursor: pointer; text-decoration: underline; color: inherit; opacity: 0.85; font-size: inherit; }

  /* Message field */
  .rsv-message-field { margin-bottom: 16px; }
  .rsv-message-field textarea { width: 100%; resize: vertical; }

  /* Navigation */
  .rsv-nav-buttons { display: flex; align-items: center; gap: 12px; margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(229,235,239,0.5); }
  .rsv-nav-spacer { flex: 1; }
  .rsv-nav-btn { min-width: 130px; }
  .rsv-submit-btn { min-width: 200px; position: relative; }

  /* Field errors */
  .rsv-field-error { color: #f44336; font-size: 13px; margin-top: 5px; margin-bottom: 4px; }
  input.error, textarea.error, select.error { border-color: #f44336 !important; }
  input:focus, select:focus, textarea:focus { border-color: #7e2010; outline: none; box-shadow: 0 0 0 3px rgba(126, 32, 16, 0.1); }
  .rsv-form-error { background-color: #ffebee; border: 1px solid #f44336; border-radius: 8px; padding: 12px; margin-top: 12px; }
  .rsv-form-error p { color: #f44336; margin: 0; font-size: 14px; }

  /* Modal */
  .rsv-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 9999; }
  .rsv-modal { width: 100%; max-width: 520px; background: #fff; border-radius: 14px; padding: 22px; box-shadow: 0 12px 34px rgba(0,0,0,0.25); }

  /* Success state */
  .rsv-success { max-width: 480px; margin: 0 auto; text-align: center; padding: 16px 0; }
  .rsv-success-icon { margin-bottom: 16px; }
  .rsv-success-title { color: #0b2e13; margin-bottom: 4px; font-size: 22px; }
  .rsv-success-sub { color: rgba(243,156,18,1); font-weight: 600; margin-bottom: 20px; font-size: 15px; }
  .rsv-success-details { background: rgba(242,246,247,0.6); border: 1px solid rgba(229,235,239,1); border-radius: 12px; padding: 16px; margin-bottom: 16px; text-align: left; }
  .rsv-detail-row { display: flex; align-items: center; gap: 10px; padding: 6px 0; font-size: 15px; }
  .rsv-detail-icon { font-size: 16px; width: 24px; text-align: center; flex-shrink: 0; }
  .rsv-success-note { font-size: 13px; color: rgba(26,47,51,0.65); margin-bottom: 20px; line-height: 1.5; }
  .rsv-success-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px; }
  .rsv-btn-ics { font-size: 11px !important; }
  .rsv-success-phone-note { font-size: 12px; color: rgba(26,47,51,0.5); }
  .rsv-success-phone-note a { color: rgba(243,156,18,1); text-decoration: underline; }

  /* Mobile */
  @media (max-width: 600px) {
    .rsv-wizard { padding: 0 4px; }
    .rsv-progress-label { font-size: 10px; }
    .rsv-progress-circle { width: 32px; height: 32px; font-size: 13px; }
    .rsv-field-row { grid-template-columns: 1fr; }
    .rsv-nav-buttons { flex-direction: column-reverse; gap: 8px; }
    .rsv-nav-btn { width: 100%; min-width: 0; }
    .rsv-time-grid { grid-template-columns: repeat(auto-fill, minmax(64px, 1fr)); }
    .rsv-counter-btn { width: 52px; height: 52px; font-size: 24px; }
    .rsv-counter-value { width: 72px; height: 52px; font-size: 22px; }
    .rsv-step-content { min-height: 280px; }
    .rsv-success-actions { flex-direction: column; }
    .rsv-success-actions .tst-btn { width: 100%; }
    .rsv-cal-day { font-size: 13px; }
  }
`;

export default ReservationForm;
