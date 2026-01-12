"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const CustomButton = ({
  children,
  className,
  type = "button",
  loading = false,
  variant = "primary",
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      disabled={loading}
      className={cn(
        "tst-btn",
        variant === "primary" ? "tst-btn-main" : "tst-btn-secondary",
        loading && "opacity-70 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 00 5.373 3.373 0 7.625l1.288 1.763A7.962 7.962 0 014 12z" />
          </svg>
          Зареждане...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};
