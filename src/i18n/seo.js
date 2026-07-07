import { routing } from './routing';

// The canonical host is www — restorantdeliorman.com 307-redirects here at
// the Vercel domain level. Every canonical/hreflang/sitemap/JSON-LD URL must
// use this same host or the redirect and the metadata contradict each other.
export const SITE_URL = 'https://www.restorantdeliorman.com';

export function getLocalizedPath(pathname = '/', locale = routing.defaultLocale) {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  if (locale === routing.defaultLocale) {
    return normalizedPath;
  }

  return normalizedPath === '/' ? `/${locale}` : `/${locale}${normalizedPath}`;
}

export function getAlternateLanguages(pathname = '/', locales = routing.locales) {
  return Object.fromEntries(
    locales.map((locale) => [locale, getLocalizedPath(pathname, locale)])
  );
}

export function buildAlternates(
  pathname = '/',
  currentLocale = routing.defaultLocale,
  locales = routing.locales
) {
  return {
    canonical: getLocalizedPath(pathname, currentLocale),
    languages: getAlternateLanguages(pathname, locales),
  };
}

export function getLocalizedUrl(pathname = '/', locale = routing.defaultLocale) {
  return `${SITE_URL}${getLocalizedPath(pathname, locale)}`;
}
