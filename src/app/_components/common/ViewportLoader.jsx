"use client";

import { useRef, useState, useEffect, memo } from "react";

/**
 * ViewportLoader - Delays rendering children until component enters viewport
 * Uses IntersectionObserver for efficient viewport detection
 *
 * @param {React.ReactNode} children - Content to render when visible
 * @param {React.ReactNode} fallback - Placeholder content while not visible
 * @param {string} rootMargin - Margin around viewport for early loading (default: "200px")
 * @param {number} threshold - Visibility threshold (default: 0.1)
 * @param {boolean} once - If true, stays visible after first intersection (default: true)
 */
const ViewportLoader = memo(({
  children,
  fallback = null,
  rootMargin = "200px",
  threshold = 0.1,
  once = true,
  className = "",
  style = {}
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Skip if IntersectionObserver is not supported
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return (
    <div ref={ref} className={className} style={style}>
      {isVisible ? children : fallback}
    </div>
  );
});

ViewportLoader.displayName = "ViewportLoader";

export default ViewportLoader;
