'use client';

import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import styles from './Card.module.scss';

const PADDING_MAP = {
  none: 'padNone',
  sm: 'padSm',
  md: 'padMd',
  lg: 'padLg',
} as const;

type CardVariant = 'default' | 'elevated' | 'outlined';
type CardPadding = keyof typeof PADDING_MAP;

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: CardVariant;
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: CardPadding;
}

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant = 'default',
    children,
    className = '',
    hoverable = false,
    padding = 'md',
    ...rest
  },
  ref
) {
  const classes = [
    styles.card,
    styles[variant],
    styles[PADDING_MAP[padding] || 'padMd'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const hoverAnim = hoverable
    ? { y: -4, boxShadow: '0 12px 28px rgba(26,47,51,0.16)' }
    : undefined;

  return (
    <motion.div
      ref={ref}
      className={classes}
      whileHover={hoverAnim}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      {...rest}
    >
      {children}
    </motion.div>
  );
});

export default Card;
