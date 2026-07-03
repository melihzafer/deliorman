"use client";

import { useTranslations } from 'next-intl';
import AnimateOnScroll from "@components/common/AnimateOnScroll";
import AnimatedCounter from "@components/common/AnimatedCounter";
import styles from "./StatsCounter.module.scss";

const StatsCounter = () => {
  const t = useTranslations('components.statsCounter');

  const stats = [
    {
      icon: "fas fa-calendar-alt",
      target: 15,
      suffix: "+",
      label: t('yearsExperience'),
    },
    {
      icon: "fas fa-users",
      target: 500,
      suffix: "+",
      label: t('happyClients'),
    },
    {
      icon: "fas fa-utensils",
      target: 150,
      suffix: "+",
      label: t('menuDishes'),
    },
    {
      icon: "fas fa-glass-cheers",
      target: 50,
      suffix: "+",
      label: t('eventsHosted'),
    },
  ];

  return (
    <div className={styles.statsCounter}>
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <AnimateOnScroll key={`stat-${index}`} delay={index * 0.1} initialVisible={true}>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <i className={stat.icon}></i>
              </div>
              <div className={styles.statNumber}>
                <AnimatedCounter
                  target={stat.target}
                  suffix={stat.suffix}
                  duration={2}
                />
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </div>
  );
};

export default StatsCounter;
