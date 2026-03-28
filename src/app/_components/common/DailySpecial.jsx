'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './DailySpecial.module.scss';

export default function DailySpecial() {
  const t = useTranslations('components.dailySpecial');
  const tCommon = useTranslations('common');
  const [dismissed, setDismissed] = useState(false);

  const DAILY_SPECIALS = {
    1: { name: t('chickenSoup'), description: t('chickenSoupDesc'), price: '5.50 лв.' },
    2: { name: t('moussaka'), description: t('moussakaDesc'), price: '9.90 лв.' },
    3: { name: t('kebapcheta'), description: `5 ${t('kebapchetaDesc')}`, price: '8.50 лв.' },
    4: { name: t('tripe'), description: t('tripeDesc'), price: '6.50 лв.' },
    5: { name: t('grilledFish'), description: t('grilledFishDesc'), price: '12.90 лв.' },
    6: { name: t('mixedGrill'), description: t('mixedGrillDesc'), price: '24.90 лв.' },
    0: { name: t('roastLamb'), description: t('roastLambDesc'), price: '15.90 лв.' },
  };

  const today = new Date().getDay();
  const special = DAILY_SPECIALS[today];

  if (!special || dismissed) return null;

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
          <span className={styles.price}>{special.price}</span>
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
