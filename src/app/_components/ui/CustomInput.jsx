"use client";

import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const CustomInput = ({
  label,
  error,
  touched,
  className,
  ...props
}) => {
  return (
    <div className="tst-group-input">
      {label && <label>{label}</label>}
      <div className="relative">
        <input
          className={cn(
            "tst-input",
            touched && error && "error",
            className
          )}
          {...props}
        />
        <AnimatePresence>
          {touched && error && (
            <motion.div
              initial={{ opacity: 0, y: -10, x: 0 }}
              animate={{ opacity: 1, y: 0, x: [0, -2, 2, -2, 2, 0] }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="error-message text-red-500"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
