"use client";

import { useEffect } from 'react';
import { ScrollAnimation } from '@common/scrollAnims';

/**
 * Global scroll animation initializer
 * Ensures animations work consistently across all pages
 */
const ScrollAnimationInit = () => {
  useEffect(() => {
    // Initialize scroll animations once when component mounts
    ScrollAnimation();
    
    // Trigger initial check after a short delay to catch any late-loaded content
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('scroll'));
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
};

export default ScrollAnimationInit;
