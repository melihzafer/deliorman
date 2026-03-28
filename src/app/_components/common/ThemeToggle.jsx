'use client';
import { useTheme } from '@library/ThemeContext';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import styles from './ThemeToggle.module.scss';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations('components.themeToggle');

  return (
    <button
      onClick={toggleTheme}
      className={styles.toggle}
      aria-label={theme === 'light' ? t('switchToDark') : t('switchToLight')}
      title={theme === 'light' ? t('dark') : t('light')}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ display: 'inline-block', fontSize: '18px' }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </motion.span>
    </button>
  );
}
