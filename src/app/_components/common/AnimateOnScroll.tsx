'use client';

import type { ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { fadeUp } from '@library/animations';
import { useReducedMotion } from '@library/useReducedMotion';

interface AnimateOnScrollProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  initialVisible?: boolean;
}

export default function AnimateOnScroll({
  children,
  variants = fadeUp as Variants,
  className,
  delay = 0,
  initialVisible = false,
}: AnimateOnScrollProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={variants}
      initial={initialVisible ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
