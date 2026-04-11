'use client';

import type { ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';

const variants: Variants = {
  hidden: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export default function PageTransition({
  children,
  className,
}: PageTransitionProps) {
  return (
    <motion.div
      variants={variants}
      initial="enter"
      animate="enter"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
