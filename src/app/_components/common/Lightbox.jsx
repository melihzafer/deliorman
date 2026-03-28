'use client';

import { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import styles from './Lightbox.module.scss';

export default function Lightbox({
  src,
  alt,
  isOpen,
  onClose,
  onPrev,
  onNext,
  counter,
  dialogAriaLabel,
}) {
  const t = useTranslations('components.lightbox');
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose?.();
    if (e.key === 'ArrowLeft') onPrev?.();
    if (e.key === 'ArrowRight') onNext?.();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    if (!isOpen) return;
    previouslyFocusedRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    const frameId = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });
    return () => {
      window.cancelAnimationFrame(frameId);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && src && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.content}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={dialogAriaLabel ?? t('viewImage')}
          >
            <button
              type="button"
              ref={closeButtonRef}
              className={styles.close}
              onClick={onClose}
              aria-label={t('closeImage')}
            >
              ×
            </button>

            {onPrev && (
              <button
                type="button"
                className={`${styles.navBtn} ${styles.prev}`}
                onClick={onPrev}
                aria-label={t('showPrevious')}
              >
                ‹
              </button>
            )}

            <Image
              src={src}
              alt={alt || t('enlargedImage')}
              width={1200}
              height={800}
              className={styles.image}
              style={{ objectFit: 'contain' }}
              priority
            />

            {onNext && (
              <button
                type="button"
                className={`${styles.navBtn} ${styles.next}`}
                onClick={onNext}
                aria-label={t('showNext')}
              >
                ›
              </button>
            )}

            {counter && <div className={styles.counter} aria-live="polite">{counter}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
