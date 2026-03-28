'use client';

import { useCallback, useState } from 'react';
import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import styles from './RippleEffect.module.scss';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface RippleEffectProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export default function RippleEffect({
  children,
  className,
  ...props
}: RippleEffectProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 600);
  }, []);

  const classes = [styles.rippleContainer, className].filter(Boolean).join(' ');

  return (
    <div className={classes} onClick={handleClick} {...props}>
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className={styles.ripple}
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
    </div>
  );
}
