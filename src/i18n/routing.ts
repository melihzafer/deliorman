import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['bg', 'en', 'tr'],
  defaultLocale: 'bg',
  // Default locale (bg) uses no prefix: /menu, /contact, etc.
  // Other locales use prefix: /en/menu, /tr/contact, etc.
  localePrefix: 'as-needed',
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365,
  },
});
