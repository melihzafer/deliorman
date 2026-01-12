"use client";

import { motion } from "framer-motion";
import { CreditCard, Banknote } from "lucide-react";

export const PaymentSelector = ({ value, onChange }) => {
  const options = [
    {
      id: "cash",
      label: "Наложен платеж",
      subtitle: "Платете при доставка (лв.)",
      icon: <Banknote className="w-6 h-6" />,
    },
    {
      id: "card",
      label: "Банкова карта",
      subtitle: "Сигурно плащане чрез Stripe",
      icon: <CreditCard className="w-6 h-6" />,
    },
  ];

  return (
    <div className="payment-selector-grid">
      {options.map((option) => (
        <motion.div
          key={option.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(option.id)}
          className={`payment-option ${value === option.id ? "active" : ""}`}
        >
          <div className="icon-container">
            {option.icon}
          </div>
          <div className="text-container">
            <div className="option-label">
              {option.label}
            </div>
            <div className="option-subtitle">
              {option.subtitle}
            </div>
          </div>
          {value === option.id && (
            <motion.div 
              layoutId="active-indicator"
              className="active-indicator"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

