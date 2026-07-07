'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './DailySpecial.module.scss';

export default function DailySpecial() {
  const t = useTranslations('components.dailySpecial');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price) => {
    const formattedNumber = new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : locale === 'tr' ? 'tr-TR' : 'en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
    
    return `€${formattedNumber}`;
  };

  const DAILY_SPECIALS = {
    1: { name: t('chickenSoup'), description: t('chickenSoupDesc'), price: 2.81 },
    2: { name: t('moussaka'), description: t('moussakaDesc'), price: 5.06 },
    3: { name: t('kebapcheta'), description: `5 ${t('kebapchetaDesc')}`, price: 4.35 },
    4: { name: t('tripe'), description: t('tripeDesc'), price: 3.32 },
    5: { name: t('grilledFish'), description: t('grilledFishDesc'), price: 6.60 },
    6: { name: t('mixedGrill'), description: t('mixedGrillDesc'), price: 12.73 },
    0: { name: t('roastLamb'), description: t('roastLambDesc'), price: 8.13 },
  };

  const today = new Date().getDay();
  const special = DAILY_SPECIALS[today];

  if (!mounted || !special || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.banner}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
      >
        <div className={styles.content}>
          <span className={styles.label}>🍽️ {t('dailyOffer')}:</span>
          <span className={styles.name}>{special.name}</span>
          <span className={styles.desc}>— {special.description}</span>
          <span className={styles.price}>{formatPrice(special.price)}</span>
          <button
            className={styles.dismiss}
            onClick={() => setDismissed(true)}
            aria-label={tCommon('close')}
          >
            ×
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
