import { routing } from './routing';

export const SITE_URL = 'https://restorantdeliorman.com';

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
