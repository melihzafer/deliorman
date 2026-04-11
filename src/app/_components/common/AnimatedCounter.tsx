'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  target: number | string;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export default function AnimatedCounter({
  target,
  duration = 2,
  suffix = '',
  prefix = '',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true });
  
  const end = typeof target === 'number' ? target : parseInt(target, 10);
  
  // Start with end value for SSR, will be replaced by 0 on mount if not in view
  const [count, setCount] = useState(end);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isInView) {
      setCount(0);
    }
  }, []);

  useEffect(() => {
    if (!mounted || !isInView) return;

    if (!Number.isFinite(end) || end <= 0) return;
    if (duration <= 0) {
      setCount(end);
      return;
    }

    let start = 0;
    const step = Math.ceil(end / (duration * 60));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [mounted, isInView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}
