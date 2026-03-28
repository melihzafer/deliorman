'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import styles from './Button.module.scss';

/**
 * Reusable Button component with Framer Motion animations.
 * @param {object} props
 * @param {'primary'|'secondary'|'outline'|'ghost'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.loading] - Shows spinner and disables interaction
 * @param {React.ReactNode} [props.icon] - Icon element rendered before children
 * @param {React.ElementType} [props.as='button'] - Render as a different element (e.g. 'a' or Link)
 */
const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    disabled = false,
    loading = false,
    icon,
    as: Tag = 'button',
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading;

  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const MotionTag = motion.create(Tag);

  return (
    <MotionTag
      ref={ref}
      className={classes}
      disabled={Tag === 'button' ? isDisabled : undefined}
      aria-disabled={isDisabled || undefined}
      whileHover={isDisabled ? {} : { scale: 1.03 }}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {!loading && icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </MotionTag>
  );
});

export default Button;
