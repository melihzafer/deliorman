"use client";

import Sticky from "sticky-js";

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

export const ScrollAnimation = () => {
    const footer = document.querySelector('footer');

    // responsive animation
    if ( window.innerWidth < 992 ) {
        footer.classList.remove('tst-fade-down');
    } else {
        footer.classList.add('tst-fade-down');
    }

    // scrolling fade
    const animatedElements = document.querySelectorAll('.tst-fade-up , .tst-fade-down');
    
    if ( animatedElements !== undefined ) {
        window.addEventListener("scroll", (e) => {
            animatedElements.forEach((element) => {
                let bottom_of_object = element.offsetTop - 200 + element.offsetHeight;
                let bottom_of_window = window.scrollY + window.innerHeight;
                if (bottom_of_window > bottom_of_object) {
                    element.classList.add('tst-active');
                } else {
                    element.classList.remove('tst-active');
                }
            });
        });
    }

    // scrolling main slider
    const animatedMainSliderElements = document.querySelectorAll(".tst-main-title , .tst-main-slider-nav , .tst-main-pagination");

    if ( animatedMainSliderElements !== undefined ) {
        window.addEventListener("scroll", (e) => {
            animatedMainSliderElements.forEach((element) => {
                element.style.opacity = 1 - window.scrollY / 500;
            });
        });
    }

    // scrolling parallax
    const animatedParallaxElements = document.querySelectorAll(".tst-parallax");

    if ( animatedParallaxElements !== undefined ) {
        window.addEventListener("scroll", (e) => {
            animatedParallaxElements.forEach((element) => {
                element.style.position = 'relative';
                element.style.top = (window.scrollY * .3) + 'px';
            });
        });
    }

    // scrolling menu frame
    const animatedMenu = document.querySelector(".tst-menu-frame");

    if ( animatedMenu !== undefined ) {
        window.addEventListener("scroll", (e) => {
            if ( window.scrollY >= 120 ) {
                animatedMenu.classList.add("tst-active");
            } else {
                animatedMenu.classList.remove("tst-active");
            }
        });
    }

    // scrolling counters
    const animatedCounters = document.querySelectorAll(".tst-number");

    if ( animatedCounters !== undefined ) {
        window.addEventListener("scroll", (e) => {
            animatedCounters.forEach((element) => {
                if ( element.innerText == 0 ) {
                    let bottom_of_object = element.getBoundingClientRect().top + window.scrollY - 140;
                    let bottom_of_window = window.scrollY + window.innerHeight/2;

                    if (bottom_of_window > bottom_of_object) {
                        var countTo = element.getAttribute('data-count');
                        numberAnimate(function(newValue) {
                            element.innerText = Math.floor(newValue);
                        }, 0, countTo, 3000, x => x);
                    }
                }
            });
        });
    }

    // resize & orientation change animation
    window.addEventListener("resize", (e) => {
        if ( window.innerWidth < 992 ) {
            footer.classList.remove('tst-fade-down');
        } else {
            footer.classList.add('tst-fade-down');
        }
    });
    window.addEventListener("orientationChange", (e) => {
        if ( window.innerWidth < 992 ) {
            footer.classList.remove('tst-fade-down');
        } else {
            footer.classList.add('tst-fade-down');
        }
    });

    // sticky
    const sticky = new Sticky('.tst-sticky');
    if ( window.innerWidth < 992 ) {
        sticky.destroy();
    }
}