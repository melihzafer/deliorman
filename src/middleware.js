import { NextResponse } from 'next/server';

const DEFAULT_LOCALE = 'bg';
const SUPPORTED_LOCALES = ['bg', 'en', 'tr'];
const LOCALE_COOKIE = 'NEXT_LOCALE';
const LOCALIZED_PATH_PREFIXES = [
  '/about',
  '/menu',
  '/menu-2',
  '/lunch-menu',
  '/reservation',
  '/reservation-2',
  '/terms',
  '/gallery',
  '/history',
  '/catering-services',
  '/services',
  '/special-days',
  '/contact',
  '/shop',
  '/products',
  '/product',
  '/feedback',
  '/cart',
  '/checkout',
  '/search',
  '/home-2',
  '/home-3',
  '/onepage',
];

// Comma-separated list of allowed origins, e.g.
// ALLOWED_ORIGINS=https://deliorman.bg,https://www.deliorman.bg
const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3010',
  'https://deliorman.vercel.app',
  'https://restorantdeliorman.com',
  'https://www.restorantdeliorman.com',
  'https://deliorman-git-dev-mzh-projcets.vercel.app',
  'https://www.deliorman-git-dev-mzh-projcets.vercel.app',
];
const NEXT_INTL_LOCALE_HEADER = 'X-NEXT-INTL-LOCALE';

function getAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGINS || '';
  const fromEnv = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return [...new Set([...DEFAULT_ALLOWED_ORIGINS, ...fromEnv])];
}

function getLocaleFromPathname(pathname) {
  const locale = pathname.split('/')[1];
  return SUPPORTED_LOCALES.includes(locale) ? locale : null;
}

function removeDefaultLocalePrefix(pathname) {
  const updatedPath = pathname.replace(/^\/bg(?=\/|$)/, '');
  return updatedPath || '/';
}

function getLocalizedPathname(pathname, locale) {
  if (locale === DEFAULT_LOCALE) return pathname;
  return pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
}

function hasLocalizedVariant(pathname) {
  return LOCALIZED_PATH_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function nextWithLocale(request, locale) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(NEXT_INTL_LOCALE_HEADER, locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// ============================================
// IP-based Rate Limiting for Spam Protection
// ============================================

// In-memory store for rate limiting
// LIMITATIONS:
// - Resets on every server restart or redeployment
// - In serverless environments (e.g., Vercel), each function instance maintains
//   its own Map, so limits apply per instance rather than globally
// RECOMMENDATIONS:
// - For production with multiple instances or serverless deployments, use Redis
//   (e.g. @upstash/ratelimit) or Vercel KV for cross-instance state
// - This in-memory approach works well for:
//   * Single-instance deployments
//   * Low-traffic scenarios
//   * Development/testing environments
const rateLimitStore = new Map();

// Rate limit configuration per route type
const RATE_LIMITS = {
  feedback: {
    windowMs: 60 * 60 * 1000, // 1 hour window
    maxRequests: 2,           // 2 requests per hour per IP
  },
  contact: {
    windowMs: 60 * 60 * 1000, // 1 hour window
    maxRequests: 2,           // 2 requests per hour per IP
  },
  reservation: {
    windowMs: 60 * 60 * 1000, // 1 hour window
    maxRequests: 2,          // 2 requests per hour per IP
  },
  ai: {
    windowMs: 10 * 60 * 1000, // 10 minute window
    maxRequests: 30,          // 30 requests per 10 minutes per IP
  },
};

// Clean up expired entries periodically (every 10 minutes)
const CLEANUP_INTERVAL = 10 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.windowStart + data.windowMs) {
      rateLimitStore.delete(key);
    }
  }
}

function getClientIP(request) {
  // Check various headers for the real client IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Take the first IP in the list (original client)
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;

  // Fallback (may not work in all environments)
  return request.headers.get('cf-connecting-ip') || 'unknown';
}

function checkRateLimit(ip, routeType) {
  cleanupExpiredEntries();

  const config = RATE_LIMITS[routeType];
  if (!config) return { allowed: true };

  const key = `${routeType}:${ip}`;
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.windowStart + config.windowMs) {
    // New window or expired - reset
    rateLimitStore.set(key, {
      windowStart: now,
      windowMs: config.windowMs,
      count: 1,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    };
  }

  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.windowStart + config.windowMs,
      retryAfter: Math.ceil((record.windowStart + config.windowMs - now) / 1000),
    };
  }

  // Increment count
  record.count += 1;
  rateLimitStore.set(key, record);

  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.windowStart + config.windowMs,
  };
}

// ============================================
// Origin Validation
// ============================================

function validateOrigin(request) {
  const allowedOrigins = getAllowedOrigins();
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  // Same-origin requests may not send Origin header; validate Host in that case.
  if (origin) return allowedOrigins.includes(origin);

  if (!host) return false;
  const allowedHosts = allowedOrigins
    .map((o) => {
      try {
        return new URL(o).host;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return allowedHosts.includes(host);
}

// ============================================
// Main Middleware
// ============================================

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const pathLocale = getLocaleFromPathname(pathname);

  // Determine which route type we're handling
  let routeType = null;
  if (pathname.startsWith('/api/feedback')) {
    routeType = 'feedback';
  } else if (pathname.startsWith('/api/contact')) {
    routeType = 'contact';
  } else if (pathname.startsWith('/api/reservation')) {
    routeType = 'reservation';
  } else if (pathname.startsWith('/api/ai')) {
    routeType = 'ai';
  }

  // Handle localized page routing and locale persistence for non-API routes
  if (!routeType) {
    if (pathLocale === DEFAULT_LOCALE) {
      const url = request.nextUrl.clone();
      url.pathname = removeDefaultLocalePrefix(pathname);

      const response = NextResponse.redirect(url);
      response.cookies.set(LOCALE_COOKIE, DEFAULT_LOCALE, {
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        sameSite: 'lax',
      });

      return response;
    }

    if (pathLocale) {
      const response = nextWithLocale(request, pathLocale);
      response.cookies.set(LOCALE_COOKIE, pathLocale, {
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
        sameSite: 'lax',
      });

      return response;
    }

    const preferredLocale = request.cookies.get(LOCALE_COOKIE)?.value;

    if (
      preferredLocale &&
      SUPPORTED_LOCALES.includes(preferredLocale) &&
      preferredLocale !== DEFAULT_LOCALE &&
      pathname !== '/' &&
      hasLocalizedVariant(pathname)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = getLocalizedPathname(pathname, preferredLocale);
      return NextResponse.redirect(url);
    }

    return nextWithLocale(request, DEFAULT_LOCALE);
  }

  // Only apply rate limiting and validation to POST requests
  if (request.method !== 'POST') {
    return NextResponse.next();
  }

  // Step 1: Validate origin
  if (!validateOrigin(request)) {
    return NextResponse.json(
      { success: false, errors: [{ message: 'Forbidden origin' }] },
      { status: 403 }
    );
  }

  // Step 2: Check rate limit (IP-based spam protection)
  const clientIP = getClientIP(request);
  const rateLimit = checkRateLimit(clientIP, routeType);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        errors: [{
          message: 'Твърде много заявки. Моля, опитайте отново по-късно.',
          code: 'RATE_LIMIT_EXCEEDED',
        }],
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfter),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rateLimit.resetTime),
        },
      }
    );
  }

  // Add rate limit info to response headers
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
  response.headers.set('X-RateLimit-Reset', String(rateLimit.resetTime));

  return response;
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
