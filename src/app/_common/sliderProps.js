"use client";

import SwiperCore, {
  A11y,
  Autoplay,
  EffectCreative,
  EffectFade,
  Grid,
  HashNavigation,
  History,
  Keyboard,
  Mousewheel,
  Navigation,
  Pagination,
  Scrollbar,
  Thumbs,
  Virtual,
  Parallax,
  FreeMode,
} from "swiper";

SwiperCore.use([
  Mousewheel,
  Pagination,
  Navigation,
  EffectFade,
  Autoplay,
  Grid,
  EffectCreative,
  Virtual,
  HashNavigation,
  History,
  Thumbs,
  Scrollbar,
  Keyboard,
  A11y,
  Parallax,
  FreeMode,
]);

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const SliderProps = {
  heroSlider: {
    slidesPerView: 1,
    speed: 800,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    pagination: {
      el: '.tst-main-pagination',
      clickable: true,
    },
    parallax: true,
    autoplay: {
      delay: 5000,
    },
    navigation: {
      prevEl: '.tst-main-prev',
      nextEl: '.tst-main-next',
    },
  },
  testimonialsSlider: {
    slidesPerView: 3,
    spaceBetween: 30,
    speed: 800,
    centeredSlides: true,
    loop: true,
    navigation: {
      prevEl: '.tst-testi-prev',
      nextEl: '.tst-testi-next',
    },
    pagination: {
      el: '.tst-testi-pagination',
      clickable: true,
    },
    breakpoints: {
      992: {
        slidesPerView: 3,
      },
      0: {
        slidesPerView: 1,
      },
    },
  },
  footerGallerySlider: {
    slidesPerView: 4,
    spaceBetween: 15,
    loop: true,
    speed: 800,
    autoplay: {
      delay: 5000,
    },
    navigation: {
      prevEl: '.tst-fg-prev',
      nextEl: '.tst-fg-next',
    },
  },
  menuSlider: {
    effect: 'fade',
    parallax: true,
    speed: 600,
    autoHeight: true,
    fadeEffect: {
      crossFade: true
    },
    pagination: {
      el: '.swiper-menu-nav',
      clickable: true,
      renderBullet: function(index, className) {
        let menu = [];
        if ( !menu.length ) {
          const menuEl = document.querySelectorAll('.swiper-menu-nav span');
          menuEl.forEach((element, key) => {
            menu[key] = element.innerHTML;
          });
        }
        return '<span class="' + className + '">' + (menu[index]) + '</span>';
      },
    },
  },
  slider: {
    slidesPerView: 3,
    spaceBetween: 30,
    speed: 800,
    navigation: {
      prevEl: '.tst-prev',
      nextEl: '.tst-next',
    },
    pagination: {
      el: '.tst-blog-pagination',
      clickable: true,
    },
    breakpoints: {
      992: {
        slidesPerView: 3,
      },
      768: {
        slidesPerView: 2,
      },
      0: {
        slidesPerView: 1,
      },
    },
  }
};
