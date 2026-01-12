"use client";

import { motion } from "framer-motion";
import { CreditCard, Banknote, Check } from "lucide-react";
import styles from '@/app/_styles/scss/Checkout.module.scss';

export const PaymentSelector = ({ value, onChange }) => {
  const options = [
    {
      id: "cash",
      label: "Наложен платеж",
      subtitle: "Платете при доставка в брой",
      icon: <Banknote size={24} />,
    },
    {
      id: "card",
      label: "Банкова карта",
      subtitle: "Сигурно плащане чрез Stripe",
      icon: <CreditCard size={24} />,
    },
  ];

  return (
    <div className={styles.paymentGrid}>
      {options.map((option) => (
        <motion.div
          key={option.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(option.id)}
          className={`${styles.paymentOption} ${value === option.id ? styles.active : ''}`}
        >
          <div className={styles.iconContainer}>
            {option.icon}
          </div>
          <div className={styles.textContainer}>
            <div className={styles.optionLabel}>
              {option.label}
            </div>
            <div className={styles.optionSubtitle}>
              {option.subtitle}
            </div>
          </div>
          {value === option.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={styles.activeIndicator}
            >
              <Check size={14} strokeWidth={3} />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
