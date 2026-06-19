import { useEffect, useState, useMemo, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { validateBgPhone } from "@library/bgPhoneUtils";
import { parseDateTimeLocal, getScheduleForDay } from "./scheduleUtils";

const INITIAL_VALUES = {
  date: "", time: "", person: 2, first_name: "", last_name: "",
  phone: "", email: "", message: "", company: "", privacy_consent: false,
};

export default function useReservationForm() {
  const t = useTranslations("reservation");
  const tc = useTranslations("common");
  const locale = useLocale();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const monthNames = useMemo(() => [
    t("months.january"), t("months.february"), t("months.march"), t("months.april"),
    t("months.may"), t("months.june"), t("months.july"), t("months.august"),
    t("months.september"), t("months.october"), t("months.november"), t("months.december")
  ], [t]);

  const dayNamesFull = useMemo(() => [
    t("days.sunday"), t("days.monday"), t("days.tuesday"), t("days.wednesday"),
    t("days.thursday"), t("days.friday"), t("days.saturday")
  ], [t]);

  const stepLabels = useMemo(() => t.raw("stepLabels"), [t]);

  const formatDateLocale = useCallback((dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}, ${dayNamesFull[d.getDay()]}`;
  }, [monthNames, dayNamesFull]);

  const getTimeSlotsForDate = useCallback((dateStr) => {
    if (!dateStr) return [];
    const d = new Date(dateStr + "T00:00:00");
    const sched = getScheduleForDay(d.getDay());
    if (!sched) return [];
    const slots = [];
    for (let h = sched.from.hours; h < sched.to.hours; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`);
    }
    return slots;
  }, []);

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
    return allSlots.filter((slot) => {
      const dt = parseDateTimeLocal(values.date, slot);
      return dt && dt.getTime() >= minAllowed.getTime();
    });
  }, [values.date, getTimeSlotsForDate]);

  const validateStep = useCallback((stepNum) => {
    const errs = {};
    if (stepNum === 1) {
      if (!values.date) errs.date = t("dateRequired");
      if (!values.time) errs.time = t("timeRequired");
      if (values.date && values.time) {
        const dt = parseDateTimeLocal(values.date, values.time);
        if (dt) {
          const now = new Date();
          const minAllowed = new Date(now.getTime() + 4 * 60 * 60 * 1000);
          if (dt.getTime() < now.getTime()) errs.time = t("timePast");
          else if (dt.getTime() < minAllowed.getTime())
            errs.time = t("timeMinAdvance", { datetime: "" }).split("(")[0].trim();
        }
      }
    } else if (stepNum === 2) {
      const gn = Number(values.person);
      if (!Number.isFinite(gn) || !Number.isInteger(gn) || gn < 1)
        errs.person = t("guestsMinimum");
      else if (gn > 20)
        errs.person = t("largeGroupMessage").split(".")[0];
      if (!values.first_name || values.first_name.trim().length < 2)
        errs.first_name = t("nameMinLength");
      if (!values.last_name || values.last_name.trim().length < 2)
        errs.last_name = t("lastNameMinLength");
      const phoneCheck = validateBgPhone(values.phone, { emptyMessage: tc("requiredField") });
      if (!phoneCheck.ok) errs.phone = phoneCheck.message;
      if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
        errs.email = t("invalidEmail");
    } else if (stepNum === 3) {
      if (!values.privacy_consent)
        errs.privacy_consent = t("privacyError");
      const gn = Number(values.person);
      if (gn > 10 && (!values.message || values.message.trim().length < 5))
        errs.message = t("largeGroupMessage");
    }
    return errs;
  }, [values, t, tc]);

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

  const generateIcsContent = useCallback((vals) => {
    const dt = parseDateTimeLocal(vals.date, vals.time);
    if (!dt) return null;
    const end = new Date(dt.getTime() + 2 * 60 * 60 * 1000);
    const fmt = (d) =>
      d.getFullYear().toString() +
      String(d.getMonth() + 1).padStart(2, "0") +
      String(d.getDate()).padStart(2, "0") + "T" +
      String(d.getHours()).padStart(2, "0") +
      String(d.getMinutes()).padStart(2, "0") + "00";
    return [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Deliorman//Reservation//LOCAL",
      "BEGIN:VEVENT",
      `DTSTART:${fmt(dt)}`, `DTEND:${fmt(end)}`,
      `SUMMARY:${t("calendarSummary", { guests: vals.person })}`,
      `DESCRIPTION:${t("calendarDescription", { firstName: vals.first_name, lastName: vals.last_name, phone: vals.phone, guests: vals.person })}${vals.message ? "\\n" + t("message") + ": " + vals.message : ""}`,
      `LOCATION:${t("calendarLocation")}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
  }, [t]);

  const downloadIcs = useCallback((vals) => {
    const content = generateIcsContent(vals);
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
  }, [generateIcsContent]);

  const handleSubmit = useCallback(async () => {
    const errs = validateStep(3);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });

    const phoneCheck = validateBgPhone(values.phone, { emptyMessage: tc("requiredField") });
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
        const errorMessages = result.errors?.map((e) => e.message).join(", ") || t("problemOccurred");
        setSubmitStatus({ type: "error", message: errorMessages });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus({ type: "error", message: t("error") });
    }
    setIsSubmitting(false);
  }, [values, validateStep, tc, t]);

  const resetForm = useCallback(() => {
    setSuccessData(null);
    setStep(1);
    setValues(INITIAL_VALUES);
  }, []);

  useEffect(() => {
    if (!termsModalOpen) return;
    const onKeyDown = (e) => { if (e.key === "Escape") setTermsModalOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [termsModalOpen]);

  return {
    step, direction, values, errors, submitStatus, isSubmitting, successData,
    termsModalOpen, setTermsModalOpen,
    stepLabels, timeSlots,
    formatDateLocale, updateField, handleInputChange,
    goNext, goBack, handleSubmit, downloadIcs, getTimeSlotsForDate,
    resetForm, t, tc,
  };
}
