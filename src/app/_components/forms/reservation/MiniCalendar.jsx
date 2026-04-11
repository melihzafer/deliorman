import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { toDateStr, isRestaurantOpen } from "./scheduleUtils";

export default function MiniCalendar({ selectedDate, onSelect }) {
  const t = useTranslations("reservation");
  const locale = useLocale();
  
  const monthNames = useMemo(() => [
    t("months.january"), t("months.february"), t("months.march"), t("months.april"),
    t("months.may"), t("months.june"), t("months.july"), t("months.august"),
    t("months.september"), t("months.october"), t("months.november"), t("months.december")
  ], [t]);

  const dayNamesShort = useMemo(() => [
    t("daysShort.mon"), t("daysShort.tue"), t("daysShort.wed"), 
    t("daysShort.thu"), t("daysShort.fri"), t("daysShort.sat"), t("daysShort.sun")
  ], [t]);

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
          })} aria-label={t("previousMonth")}>‹</button>
        <span className="rsv-cal-title">
          {monthNames[viewMonth.month]?.charAt(0).toUpperCase() + monthNames[viewMonth.month]?.slice(1)}{" "}{viewMonth.year}
        </span>
        <button type="button" className="rsv-cal-nav" disabled={!canGoForward}
          onClick={() => setViewMonth((v) => {
            const d = new Date(v.year, v.month + 1, 1);
            return { year: d.getFullYear(), month: d.getMonth() };
          })} aria-label={t("nextMonth")}>›</button>
      </div>
      <div className="rsv-calendar-weekdays">
        {dayNamesShort.map((d) => (
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
              aria-label={`${cell.day} ${monthNames[viewMonth.month]}`}
              aria-pressed={cell.isSelected}>{cell.day}</button>
          );
        })}
      </div>
      <div className="rsv-calendar-legend">
        <span className="rsv-legend-item"><span className="rsv-legend-dot rsv-legend-today" /> {t("legendToday")}</span>
        <span className="rsv-legend-item"><span className="rsv-legend-dot rsv-legend-closed" /> {t("legendClosed")}</span>
      </div>
    </div>
  );
}
