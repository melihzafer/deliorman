"use client";

// Global scroll animation listener - only attached once
let scrollListenerAttached = false;
let fadeObserver = null;
let counterObserver = null;

const numberAnimate = (render, from, to, duration, timeFx) => {
    let startTime = performance.now();
    requestAnimationFrame(function step(time) {
        let pTime = (time - startTime) / duration;
        if (pTime > 1) pTime = 1;
        render(from + (to - from) * timeFx(pTime));
        if (pTime < 1) {
            requestAnimationFrame(step);
        }
    });
}

// Initialize IntersectionObserver for fade animations (replaces scroll-based checks)
const initFadeObserver = () => {
    if (fadeObserver) return;
    
    fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !entry.target.classList.contains('tst-active')) {
                entry.target.classList.add('tst-active');
                // Once activated, no need to observe anymore
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -200px 0px', // Trigger 200px before entering viewport
        threshold: 0
    });
    
    // Observe initial elements
    const observeFadeElements = () => {
        document.querySelectorAll('.tst-fade-up:not(.tst-active)').forEach((el) => {
            fadeObserver.observe(el);
        });
    };
    
    // Initial observation + delayed for dynamic content
    observeFadeElements();
    setTimeout(observeFadeElements, 500);
    setTimeout(observeFadeElements, 1000);
};

// Initialize IntersectionObserver for counters
const initCounterObserver = () => {
    if (counterObserver) return;
    
    counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !entry.target.classList.contains('tst-counted')) {
                entry.target.classList.add('tst-counted');
                const countTo = entry.target.getAttribute('data-count');
                numberAnimate(function(newValue) {
                    entry.target.innerText = Math.floor(newValue);
                }, 0, countTo, 3000, x => x);
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -200px 0px',
        threshold: 0
    });
    
    const observeCounters = () => {
        document.querySelectorAll('.tst-number:not(.tst-counted)').forEach((el) => {
            counterObserver.observe(el);
        });
    };
    
    observeCounters();
    setTimeout(observeCounters, 500);
};

// Initialize scroll animations (safely - only once)
const initScrollListeners = () => {
    if (scrollListenerAttached) return; // Prevent duplicate listeners
    scrollListenerAttached = true;

    // Use IntersectionObserver for fade and counter animations (much more efficient)
    initFadeObserver();
    initCounterObserver();

    // Cache elements for scroll-based animations (only parallax, slider, menu)
    let cachedMainSliderElements = null;
    let cachedParallaxElements = null;
    let cachedMenu = null;
    
    // Refresh cache when needed
    const refreshCache = () => {
        cachedMainSliderElements = document.querySelectorAll(".tst-main-title , .tst-main-slider-nav , .tst-main-pagination");
        cachedParallaxElements = document.querySelectorAll(".tst-parallax");
        cachedMenu = document.querySelector(".tst-menu-frame");
    };
    
    // Initial cache and periodic refresh for dynamic content
    setTimeout(refreshCache, 100);
    setTimeout(refreshCache, 500);

    // scrolling main slider - with GPU acceleration
    const handleScrollSlider = () => {
        if (!cachedMainSliderElements || cachedMainSliderElements.length === 0) return;
        
        const opacity = Math.max(0, 1 - window.scrollY / 500);
        cachedMainSliderElements.forEach((element) => {
            element.style.opacity = opacity;
        });
    };

    // scrolling parallax - optimized with transform3d for GPU
    const handleScrollParallax = () => {
        if (!cachedParallaxElements || cachedParallaxElements.length === 0) return;
        
        const translateY = window.scrollY * 0.3;
        cachedParallaxElements.forEach((element) => {
            element.style.transform = `translate3d(0, ${translateY}px, 0)`;
        });
    };

    // scrolling menu frame
    const handleScrollMenu = () => {
        if (!cachedMenu) return;
        
        if (window.scrollY >= 120) {
            if (!cachedMenu.classList.contains("tst-active")) {
                cachedMenu.classList.add("tst-active");
            }
        } else {
            if (cachedMenu.classList.contains("tst-active")) {
                cachedMenu.classList.remove("tst-active");
            }
        }
    };

    // Combined scroll handler with requestAnimationFrame for smooth 60fps
    // Only parallax, slider opacity, and menu need per-frame updates
    let ticking = false;
    
    const scrollHandler = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScrollSlider();
                handleScrollParallax();
                handleScrollMenu();
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });
    
    // Refresh cache when DOM might have changed
    window.addEventListener("load", refreshCache, { once: true });
};

export const ScrollAnimation = () => {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
        initScrollListeners();
    }
};