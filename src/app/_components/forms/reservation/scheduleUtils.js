// Restaurant schedule: Mon-Wed 07-17, Thu-Sun 07-23 (from schedule.json)
export const SCHEDULE = [
  { days: [1, 2, 3], from: { hours: 7, minutes: 0 }, to: { hours: 17, minutes: 0 } },
  { days: [4, 5, 6, 0], from: { hours: 7, minutes: 0 }, to: { hours: 23, minutes: 0 } },
];

export function parseDateTimeLocal(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const [y, m, d] = String(dateStr).split("-").map(Number);
  const [hh, mm] = String(timeStr).split(":").map(Number);
  if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

export function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getScheduleForDay(dayOfWeek) {
  return SCHEDULE.find((s) => s.days.includes(dayOfWeek)) || null;
}

export function isRestaurantOpen(dayOfWeek) {
  return !!getScheduleForDay(dayOfWeek);
}
