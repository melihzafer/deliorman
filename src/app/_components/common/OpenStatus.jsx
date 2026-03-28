'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import styles from './OpenStatus.module.scss';

// From schedule.json:
// Mon–Wed: 07:00–17:00, Thu–Sun: 07:00–23:00
const SCHEDULE = [
  { day: 0, open: '07:00', close: '23:00' }, // Sunday
  { day: 1, open: '07:00', close: '17:00' }, // Monday
  { day: 2, open: '07:00', close: '17:00' }, // Tuesday
  { day: 3, open: '07:00', close: '17:00' }, // Wednesday
  { day: 4, open: '07:00', close: '23:00' }, // Thursday
  { day: 5, open: '07:00', close: '23:00' }, // Friday
  { day: 6, open: '07:00', close: '23:00' }, // Saturday
];

const TIMEZONE = 'Europe/Sofia';

function getSofiaTime() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: TIMEZONE }));
}

function getStatusData() {
  const now = getSofiaTime();
  const day = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todaySchedule = SCHEDULE[day];
  const [openH, openM] = todaySchedule.open.split(':').map(Number);
  const [closeH, closeM] = todaySchedule.close.split(':').map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  if (isOpen) {
    return { isOpen: true, nextOpenTime: null };
  }

  // Find next opening time
  let nextOpen = todaySchedule.open;
  if (currentMinutes >= closeMinutes) {
    const tomorrow = SCHEDULE[(day + 1) % 7];
    nextOpen = tomorrow.open;
  }

  return { isOpen: false, nextOpenTime: nextOpen };
}

export default function OpenStatus() {
  const t = useTranslations('components.openStatus');
  const [statusData, setStatusData] = useState(null);

  useEffect(() => {
    setStatusData(getStatusData());
    const interval = setInterval(() => setStatusData(getStatusData()), 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!statusData) return null;

  const label = statusData.isOpen 
    ? t('open') 
    : t('closedOpensAt', { time: statusData.nextOpenTime });

  return (
    <span className={`${styles.status} ${statusData.isOpen ? styles.open : styles.closed}`}>
      <span className={`${styles.dot} ${statusData.isOpen ? styles.dotOpen : styles.dotClosed}`} />
      {label}
    </span>
  );
}
