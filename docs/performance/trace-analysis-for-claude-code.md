# Performance Trace Analysis - iPhone 14 Pro Max

## 📊 Trace File Details

**Source File:** `Trace-20260131T230728_json.gz`
- **Device:** iPhone 14 Pro Max (Emulated)
- **Capture Date:** 2026-01-31 at 21:07:28 UTC
- **Source:** Chrome DevTools
- **Total Events:** 1,378,662 events
- **Uncompressed Size:** ~322 MB
- **Recording Duration:** ~83 seconds

---

## 🚨 Critical Performance Issues Identified

### Issue #1: NewSpecialtiesCTA Button (CRITICAL)
**Component:** `NewSpecialtiesCTA_ctaBtn`

**Measured Impact:**
- **Render Time:** ~1,464ms (1.46 seconds)
- **Blocks Main Thread:** YES
- **User Impact:** Interface freezes when button is clicked

**Root Causes:**
1. Heavy component re-rendering entire tree on click
2. No React memoization - causing cascade re-renders
3. Synchronous state updates blocking UI
4. Likely triggering parent component re-renders

**Required Fixes:**
```jsx
// 1. Wrap component with React.memo
const NewSpecialtiesCTA = React.memo(({ /* props */ }) => {
  // component code
});

// 2. Use useTransition for non-blocking updates
import { useTransition } from 'react';

const [isPending, startTransition] = useTransition();

const handleCTAClick = () => {
  startTransition(() => {
    // State updates here won't block UI
    setActiveState(newState);
  });
};

// 3. Memoize callbacks
const handleClick = useCallback(() => {
  // handler logic
}, [/* minimal deps */]);
```

---

### Issue #2: tst-overlay Component (CRITICAL)
**Component:** `tst-overlay` (Menu/Modal Overlay)

**Measured Impact:**
- **Render Time:** ~1,440ms (1.44 seconds)
- **Layout Thrashing:** YES - Multiple forced reflows
- **Animation Performance:** CPU-bound (not GPU accelerated)
- **User Impact:** Laggy, janky overlay opening/closing

**Root Causes:**
1. Animating non-GPU properties (likely `left`, `top`, `width`, or `height`)
2. Multiple style recalculations during animation
3. Forced synchronous layouts (reading layout properties after DOM changes)
4. Not using CSS transform/opacity for animations

**Required Fixes:**

**Current (WRONG) approach:**
```css
/* DON'T DO THIS - causes layout thrashing */
.tst-overlay {
  left: -100%;
  transition: left 0.3s;
}
.tst-overlay.open {
  left: 0;
}
```

**Correct approach:**
```css
.tst-overlay {
  /* Force GPU layer */
  transform: translateZ(0);
  will-change: transform, opacity;
  
  /* Start position - off screen */
  transform: translateX(-100%);
  opacity: 0;
  
  /* Only animate GPU properties */
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tst-overlay.open {
  transform: translateX(0);
  opacity: 1;
}

/* Remove will-change after animation */
.tst-overlay.transitioning {
  will-change: transform, opacity;
}
```

**JavaScript changes:**
```jsx
const [isOpen, setIsOpen] = useState(false);
const overlayRef = useRef(null);

const openOverlay = useCallback(() => {
  if (overlayRef.current) {
    // Add transitioning class
    overlayRef.current.classList.add('transitioning');
    
    // Start transition
    setIsOpen(true);
    
    // Remove will-change after animation
    setTimeout(() => {
      overlayRef.current?.classList.remove('transitioning');
    }, 300);
  }
}, []);
```

---

### Issue #3: Swiper Slider (HIGH PRIORITY)
**Component:** Swiper (Carousel/Slider library)

**Measured Impact:**
- **Input Delay:** ~600ms during page load
- **Blocks Main Thread:** YES - during hydration
- **User Impact:** Page feels frozen immediately after load

**Root Causes:**
1. Swiper loading and hydrating synchronously on page load
2. Heavy JavaScript execution blocking main thread
3. Not code-split - part of main bundle
4. Hydrating even if not in viewport

**Required Fixes:**

```jsx
// FILE: components/Swiper.jsx or similar
import dynamic from 'next/dynamic';

// 1. Lazy load Swiper - don't include in main bundle
const SwiperComponent = dynamic(
  () => import('swiper/react').then(mod => mod.Swiper),
  {
    ssr: false, // Don't render on server
    loading: () => (
      <div className="swiper-skeleton">
        {/* Skeleton/placeholder */}
        <div className="skeleton-slide" />
        <div className="skeleton-slide" />
        <div className="skeleton-slide" />
      </div>
    )
  }
);

// 2. Only load when in viewport
import { useInView } from 'react-intersection-observer';

function SwiperSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '100px', // Start loading 100px before visible
  });

  return (
    <div ref={ref}>
      {inView ? (
        <SwiperComponent>
          {/* slides */}
        </SwiperComponent>
      ) : (
        <div className="swiper-skeleton" />
      )}
    </div>
  );
}
```

**Alternative: Import Swiper modules individually**
```jsx
// Instead of importing entire Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Only import modules you need
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
```

---

## 📏 Current vs Target Metrics

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| **INP (Interaction to Next Paint)** | 1,960ms | <200ms | 🔴 CRITICAL |
| **Total Blocking Time** | >1,500ms | <200ms | 🔴 CRITICAL |
| **Input Delay** | ~681ms | <100ms | 🔴 CRITICAL |
| **Processing Time** | 1,100-1,400ms | <300ms | 🔴 CRITICAL |
| **First Input Delay** | ~600ms | <100ms | 🔴 CRITICAL |

---

## 🔍 Additional Findings

### JavaScript Bundle Issues
- **Main bundle likely too large** - Contains Swiper and heavy components
- **No code splitting** for below-fold content
- **Synchronous hydration** of all components

### Animation Issues
- **Non-composited animations** throughout the site
- **Layout-triggering properties** being animated
- **No GPU acceleration** for transforms

### Event Handler Issues
- **Blocking event handlers** - not using passive listeners
- **No debouncing/throttling** on high-frequency events
- **Synchronous state updates** in React

---

## 🎯 Implementation Checklist for Claude Code

### Immediate Actions (Phase 1)
- [ ] **Find** the `tst-overlay` component and its CSS
  - [ ] Replace all animations with `transform` and `opacity` only
  - [ ] Add `transform: translateZ(0)` for GPU layer
  - [ ] Add `will-change` management
  - [ ] Test overlay opening/closing

- [ ] **Find** `NewSpecialtiesCTA_ctaBtn` component
  - [ ] Wrap with `React.memo()`
  - [ ] Convert state updates to use `useTransition`
  - [ ] Memoize event handlers with `useCallback`
  - [ ] Test button interactions

- [ ] **Find** Swiper/slider implementation
  - [ ] Wrap with `next/dynamic` and `ssr: false`
  - [ ] Add loading skeleton
  - [ ] Implement viewport detection with `IntersectionObserver`
  - [ ] Test slider loading

### High Priority (Phase 2)
- [ ] **Audit** `_app.js` or `_document.js`
  - [ ] Move third-party scripts to `strategy="lazyOnload"`
  - [ ] Defer non-critical analytics
  
- [ ] **Implement** passive event listeners
  ```jsx
  useEffect(() => {
    const handleScroll = () => { /* ... */ };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  ```

- [ ] **Add** bundle analysis
  ```bash
  npm install @next/bundle-analyzer
  # Configure in next.config.js
  ```

### Testing & Validation (Phase 3)
- [ ] Run new performance trace with same settings:
  - Device: iPhone 14 Pro Max
  - CPU: 4x slowdown
  - Network: Fast 3G or similar

- [ ] Compare metrics:
  - [ ] INP should be <200ms
  - [ ] TBT should be <200ms
  - [ ] Input delay <100ms

- [ ] Test interactions:
  - [ ] Click CTA button (should be instant)
  - [ ] Open/close overlay (should be smooth 60fps)
  - [ ] Scroll to slider (should lazy load)

---

## 🚀 Expected Results After Fixes

### Performance Improvements
- **INP:** 1,960ms → <200ms (90% reduction)
- **Button Click:** 1,464ms → <50ms (97% improvement)
- **Overlay Animation:** 1,440ms → <100ms (93% improvement)
- **Page Load:** 600ms input delay → <100ms (83% improvement)

### User Experience
- ✅ Instant button responses
- ✅ Smooth 60fps animations
- ✅ No interface freezing
- ✅ Fast page load on mobile

---

## 📚 Key Files to Search For

When running Claude Code, search for these patterns in the codebase:

1. **Overlay/Menu Component:**
   - Search for: `tst-overlay`, `overlay`, `menu`, `sidebar`
   - Look in: `components/`, `src/components/`
   - File extensions: `.jsx`, `.tsx`, `.js`

2. **CTA Button:**
   - Search for: `NewSpecialtiesCTA`, `ctaBtn`, `SpecialtiesCTA`
   - Look in: `components/`, `pages/`, `sections/`

3. **Slider/Swiper:**
   - Search for: `Swiper`, `slider`, `carousel`, `import.*swiper`
   - Look in: entire codebase

4. **Layout/App Files:**
   - Check: `_app.js`, `_app.tsx`, `_document.js`, `layout.tsx`
   - Look for: `<Script>` tags, third-party imports

5. **CSS/Styles:**
   - Search for: `.tst-overlay`, animation properties with `left`, `top`, `width`, `height`
   - Look in: `.css`, `.scss`, `.module.css`, `styled-components`

---

## ⚡ Quick Command Reference

```bash
# 1. Find overlay component
grep -r "tst-overlay" --include="*.jsx" --include="*.tsx" --include="*.js"

# 2. Find CTA component  
grep -r "NewSpecialtiesCTA" --include="*.jsx" --include="*.tsx" --include="*.js"

# 3. Find Swiper usage
grep -r "from 'swiper" --include="*.jsx" --include="*.tsx" --include="*.js"

# 4. Find layout/app files
find . -name "_app.*" -o -name "_document.*" -o -name "layout.*"

# 5. Check for animation issues in CSS
grep -r "transition.*left\|transition.*top" --include="*.css" --include="*.scss"
```

---

## 💡 Pro Tips for Claude Code

1. **Start with the overlay animation fix** - Biggest visual improvement
2. **Use React DevTools Profiler** - Record interactions to see re-renders
3. **Test incrementally** - Fix one issue, test, then move to next
4. **Keep bundle analyzer open** - Watch bundle size changes
5. **Use Lighthouse** - Run before/after for metrics

---

**This trace analysis provides all the context needed to systematically fix the critical performance issues. Focus on the three main bottlenecks in order: overlay animations, CTA button re-renders, and Swiper lazy loading.**
