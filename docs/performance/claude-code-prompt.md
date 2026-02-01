# Critical Mobile Performance Fix: INP Optimization for Next.js Site

## 🎯 Objective
Fix critical Interaction to Next Paint (INP) latency issue causing 1,960ms delays on mobile viewport. The site becomes unresponsive when users interact with buttons and menu overlays, particularly in the "Specialties" section.

## 📊 Performance Trace Analysis
Based on Chrome DevTools trace (iPhone 14 Pro Max emulation):
- **Current INP**: 1,960ms (Critical - should be <200ms)
- **Total Blocking Time**: >1,500ms
- **Input Delay**: ~681ms
- **Processing Time**: 1,100-1,400ms (React render/commit)
- **Device**: iPhone 14 Pro Max emulation with 4x CPU slowdown

## 🔍 Identified Bottlenecks

### Primary Issues:
1. **NewSpecialtiesCTA_ctaBtn Component**
   - Render time: ~1,464ms
   - Blocking main thread during interaction
   - Likely causing unnecessary re-renders

2. **tst-overlay Component**
   - Render time: ~1,440ms
   - Expensive style calculations (layout thrashing)
   - Non-GPU accelerated animations

3. **Swiper Slider**
   - Input delay: ~600ms during page load
   - Heavy hydration blocking main thread
   - Not lazy loaded

## 🛠️ Required Fixes

### 1. Implement Code Splitting & Lazy Loading

**Tasks:**
- [ ] Wrap Swiper component with `next/dynamic` 
  - Set `ssr: false` to prevent hydration blocking
  - Add loading skeleton for better UX
  - Only load when component enters viewport (use `IntersectionObserver`)

- [ ] Lazy load NewSpecialtiesCTA component
  - Split into separate chunk
  - Use `React.lazy()` or `next/dynamic`
  - Add placeholder/skeleton during load

- [ ] Identify and lazy load other heavy components below the fold

**Example pattern:**
```jsx
const HeavySlider = dynamic(
  () => import('./components/Swiper'),
  { 
    ssr: false,
    loading: () => <SliderSkeleton />
  }
);

// For viewport-based loading
const LazyComponent = dynamic(
  () => import('./components/Heavy'),
  { 
    ssr: false,
    loading: () => <Skeleton />,
  }
);

// Wrap with IntersectionObserver wrapper
<ViewportLoader>
  <LazyComponent />
</ViewportLoader>
```

### 2. Optimize React Re-renders

**Tasks:**
- [ ] Audit NewSpecialtiesCTA component for unnecessary re-renders
  - Check if entire component tree re-renders on button click
  - Use React DevTools Profiler to identify render cascades

- [ ] Implement `React.memo()` for expensive child components
  - Memoize components that don't need to re-render
  - Use `useMemo` for expensive calculations
  - Use `useCallback` for event handlers passed as props

- [ ] Wrap state updates with `useTransition` (React 18+)
  ```jsx
  import { useTransition } from 'react';
  
  const [isPending, startTransition] = useTransition();
  
  const handleClick = () => {
    startTransition(() => {
      // Non-urgent state updates here
      setOverlayOpen(true);
    });
  };
  ```

- [ ] Consider splitting state management
  - Move overlay state to separate context/store
  - Prevent parent re-renders from affecting children

### 3. Fix tst-overlay Animation Performance

**Tasks:**
- [ ] Move animations to GPU-accelerated properties ONLY
  - Replace `top`, `left`, `width`, `height` with `transform`
  - Replace visibility changes with `opacity`
  - Add `will-change: transform, opacity` hint

- [ ] Implement proper CSS compositing
  ```css
  .tst-overlay {
    /* Force GPU layer */
    transform: translateZ(0);
    will-change: transform, opacity;
    
    /* Use only these for animations */
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  
  /* Instead of animating left/top */
  .tst-overlay.open {
    transform: translateX(0);
    opacity: 1;
  }
  
  .tst-overlay.closed {
    transform: translateX(-100%);
    opacity: 0;
  }
  ```

- [ ] Remove any layout-triggering property changes during animation
  - Avoid changing: `width`, `height`, `padding`, `margin`, `border`
  - Check for forced synchronous layouts (reading layout properties after changes)

### 4. Optimize Event Handlers

**Tasks:**
- [ ] Add debouncing/throttling to high-frequency events
  ```jsx
  import { useMemo } from 'react';
  import { debounce } from 'lodash'; // or custom implementation
  
  const debouncedHandler = useMemo(
    () => debounce(handleHeavyOperation, 150),
    []
  );
  ```

- [ ] Use passive event listeners for scroll/touch events
  ```jsx
  useEffect(() => {
    const handleTouch = (e) => { /* ... */ };
    element.addEventListener('touchstart', handleTouch, { passive: true });
    return () => element.removeEventListener('touchstart', handleTouch);
  }, []);
  ```

- [ ] Batch DOM updates
  - Use `ReactDOM.flushSync()` sparingly
  - Let React batch updates naturally
  - Avoid forcing synchronous updates

### 5. Audit Third-Party Scripts

**Tasks:**
- [ ] Review all `<Script>` tags in `_app.js` or `_document.js`
- [ ] Move non-critical scripts to `strategy="lazyOnload"`
  ```jsx
  <Script 
    src="https://third-party.com/script.js"
    strategy="lazyOnload"
  />
  ```
- [ ] Consider removing or deferring analytics/tracking during initial load
- [ ] Use `strategy="worker"` for analytics if available (Partytown)

### 6. Implement Performance Monitoring

**Tasks:**
- [ ] Add Web Vitals tracking
  ```jsx
  // pages/_app.js
  export function reportWebVitals(metric) {
    if (metric.label === 'web-vital') {
      console.log(metric);
      // Send to analytics
      if (metric.name === 'INP') {
        // Track INP specifically
      }
    }
  }
  ```

- [ ] Add performance marks for key interactions
  ```jsx
  performance.mark('cta-click-start');
  // ... operation
  performance.mark('cta-click-end');
  performance.measure('cta-click', 'cta-click-start', 'cta-click-end');
  ```

### 7. Hydration Optimization

**Tasks:**
- [ ] Audit components hydrating on initial load
- [ ] Use `next/dynamic` with `ssr: false` for interactive widgets
- [ ] Consider selective hydration (React 18 feature)
- [ ] Reduce initial JavaScript bundle size
  - Check bundle analyzer output
  - Remove unused dependencies
  - Tree-shake properly

### 8. Mobile-Specific Optimizations

**Tasks:**
- [ ] Reduce JavaScript execution on mobile
  - Check for mobile viewport and conditionally load features
  - Use responsive imports

- [ ] Optimize touch event handling
  - Ensure touch targets are ≥48px
  - Prevent default on touch events if needed
  - Use CSS `touch-action` property

- [ ] Test with real device metrics
  - Use Lighthouse CI with mobile throttling
  - Test on actual devices if possible

## 🎯 Success Criteria

### Performance Targets:
- **INP**: < 200ms (Good), currently 1,960ms
- **Total Blocking Time**: < 200ms, currently >1,500ms
- **Input Delay**: < 100ms, currently ~681ms
- **Processing Time**: < 300ms, currently 1,100-1,400ms

### Testing Requirements:
1. Test on Chrome DevTools with iPhone 14 Pro Max emulation
2. Use 4x CPU slowdown to simulate lower-end devices
3. Record new Performance trace and compare
4. Verify INP in Chrome's Performance Insights panel
5. Test actual interactions:
   - Click CTA button in Specialties section
   - Open/close overlay menu
   - Scroll and interact with Swiper

## 🔧 Implementation Priority

### Phase 1 (Immediate - Biggest Impact):
1. GPU-accelerate tst-overlay animations
2. Lazy load Swiper component with `next/dynamic`
3. Wrap state updates in `useTransition`

### Phase 2 (High Priority):
4. Optimize NewSpecialtiesCTA re-renders with `React.memo`
5. Defer third-party scripts
6. Add viewport-based lazy loading

### Phase 3 (Follow-up):
7. Implement performance monitoring
8. Mobile-specific optimizations
9. Continuous monitoring setup

## 📝 Files to Examine

Please locate and audit these files:
1. Component containing `NewSpecialtiesCTA_ctaBtn`
2. Component/CSS for `tst-overlay`
3. Swiper/slider implementation
4. `_app.js` / `_document.js` for script loading
5. Any state management for overlay/menu

## 🚀 Execution Instructions

1. **Start with a performance baseline**
   - Run Lighthouse on mobile
   - Record current metrics

2. **Apply fixes in priority order**
   - Implement Phase 1 fixes first
   - Test after each major change
   - Record new metrics

3. **Validate improvements**
   - Re-run trace with same conditions
   - Compare INP, TBT, Input Delay metrics
   - Ensure no regressions

4. **Document changes**
   - Note what was changed
   - Include before/after metrics
   - Update README with performance best practices

## ⚠️ Common Pitfalls to Avoid

- Don't use `will-change` on too many elements (max 4-5)
- Don't lazy load above-the-fold content
- Don't over-optimize - measure first
- Don't break existing functionality - test thoroughly
- Don't forget to remove console.logs from production

## 📚 Additional Resources

- [Next.js Dynamic Imports](https://nextjs.org/docs/advanced-features/dynamic-import)
- [React useTransition](https://react.dev/reference/react/useTransition)
- [Web Vitals INP](https://web.dev/inp/)
- [GPU Animation](https://web.dev/animations-guide/)

---

**Expected Outcome**: Reduce INP from 1,960ms to <200ms, making the site responsive and smooth on mobile devices.
