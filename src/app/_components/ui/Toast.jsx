'use client';

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './Toast.module.scss';

/* ── context ─────────────────────────────────── */

const ToastContext = createContext(null);

/**
 * Hook to show toast notifications.
 * @returns {{ toast: (opts: {message:string, type?:string, duration?:number}) => void }}
 */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

/* ── icons ───────────────────────────────────── */

const ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

/* ── single toast ────────────────────────────── */

function ToastItem({ id, message, type = 'info', duration = 4000, onClose }) {
  return (
    <motion.div
      layout
      className={`${styles.toast} ${styles[type] || styles.info}`}
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      role="alert"
      onAnimationComplete={(definition) => {
        // auto-dismiss after enter animation
        if (definition === 'animate') {
          const timer = setTimeout(() => onClose(id), duration);
          // cleanup on unmount handled by AnimatePresence
          return () => clearTimeout(timer);
        }
      }}
    >
      <span className={styles.icon}>{ICONS[type]}</span>
      <div className={styles.body}>
        <span className={styles.message}>{message}</span>
      </div>
      <button
        className={styles.close}
        onClick={() => onClose(id)}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </motion.div>
  );
}

/* ── provider ────────────────────────────────── */

/**
 * Wrap your app with `<ToastProvider>` to enable `useToast()`.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const prefix = useId();
  let counter = 0;

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ message, type = 'info', duration = 4000 }) => {
      const id = `${prefix}-${++counter}-${Date.now()}`;
      setToasts((prev) => [...prev, { id, message, type, duration }]);
      // auto-dismiss fallback
      setTimeout(() => dismiss(id), duration + 300);
    },
    [prefix, dismiss]
  );

  const ctx = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div className={styles.container}>
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastItem key={t.id} {...t} onClose={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

/**
 * Standalone Toast component (for manual placement).
 * @param {object} props
 * @param {string} props.message
 * @param {'success'|'error'|'warning'|'info'} [props.type='info']
 * @param {number} [props.duration=4000]
 * @param {() => void} [props.onClose]
 */
export default function Toast({
  message,
  type = 'info',
  duration = 4000,
  onClose,
}) {
  return (
    <motion.div
      className={`${styles.toast} ${styles[type] || styles.info}`}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      role="alert"
    >
      <span className={styles.icon}>{ICONS[type]}</span>
      <div className={styles.body}>
        <span className={styles.message}>{message}</span>
      </div>
      {onClose && (
        <button
          className={styles.close}
          onClick={onClose}
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </motion.div>
  );
}
