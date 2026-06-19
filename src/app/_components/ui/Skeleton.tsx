'use client';

import type { CSSProperties } from 'react';
import styles from './Skeleton.module.scss';

type SkeletonVariant = 'text' | 'circle' | 'rect' | 'card';
type SkeletonSize = string | number;

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: SkeletonSize;
  height?: SkeletonSize;
  count?: number;
  className?: string;
}

function toCssSize(value: SkeletonSize): string {
  return typeof value === 'number' ? `${value}px` : value;
}

export default function Skeleton({
  variant = 'text',
  width = '100%',
  height,
  count = 1,
  className = '',
}: SkeletonProps) {
  const style: CSSProperties = {
    width: toCssSize(width),
    ...(height != null && {
      height: toCssSize(height),
    }),
    ...(variant === 'circle' && !height && { height: toCssSize(width) }),
  };

  const classes = [styles.skeleton, styles[variant], className]
    .filter(Boolean)
    .join(' ');

  if (count <= 1) {
    return <div className={classes} style={style} aria-hidden="true" />;
  }

  return (
    <div className={styles.wrapper} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={classes}
          style={{
            ...style,
            // last line is shorter for a natural look
            ...(variant === 'text' && index === count - 1 && { width: '70%' }),
          }}
        />
      ))}
    </div>
  );
}
