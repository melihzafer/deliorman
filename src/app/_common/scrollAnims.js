"use client";

import Sticky from "sticky-js";

// Global scroll animation listener - only attached once
let scrollListenerAttached = false;

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

// Initialize scroll animations (safely - only once)
const initScrollListeners = () => {
    if (scrollListenerAttached) return; // Prevent duplicate listeners
    scrollListenerAttached = true;

    // Cache elements to avoid repeated DOM queries
    let cachedAnimatedElements = null;
    let cachedMainSliderElements = null;
    let cachedParallaxElements = null;
    let cachedMenu = null;
    let cachedCounters = null;
    
    // Refresh cache when needed
    const refreshCache = () => {
        cachedAnimatedElements = document.querySelectorAll('.tst-fade-up');
        cachedMainSliderElements = document.querySelectorAll(".tst-main-title , .tst-main-slider-nav , .tst-main-pagination");
        cachedParallaxElements = document.querySelectorAll(".tst-parallax");
        cachedMenu = document.querySelector(".tst-menu-frame");
        cachedCounters = document.querySelectorAll(".tst-number");
    };
    
    // Initial cache
    setTimeout(refreshCache, 100);

    // scrolling fade - optimized with will-change hint
    const handleScrollFade = () => {
        if (!cachedAnimatedElements || cachedAnimatedElements.length === 0) return;
        
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;
        
        cachedAnimatedElements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollY;
            const bottom_of_object = elementTop - 200 + rect.height;
            const bottom_of_window = scrollY + windowHeight;
            
            if (bottom_of_window > bottom_of_object) {
                if (!element.classList.contains('tst-active')) {
                    element.classList.add('tst-active');
                }
            }
        });
    };

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

    // scrolling counters
    const handleScrollCounters = () => {
        if (!cachedCounters || cachedCounters.length === 0) return;
        
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;
        
        cachedCounters.forEach((element) => {
            if (!element.classList.contains('tst-counted')) {
                let bottom_of_object = element.offsetTop - 200;
                let bottom_of_window = scrollY + windowHeight;
                if (bottom_of_window > bottom_of_object) {
                    element.classList.add('tst-counted');
                    var countTo = element.getAttribute('data-count');
                    numberAnimate(function(newValue) {
                        element.innerText = Math.floor(newValue);
                    }, 0, countTo, 3000, x => x);
                }
            }
        });
    };

    // Combined scroll handler with requestAnimationFrame for smooth 60fps
    let ticking = false;
    
    const scrollHandler = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScrollFade();
                handleScrollSlider();
                handleScrollParallax();
                handleScrollMenu();
                handleScrollCounters();
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