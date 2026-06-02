import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';


const intlMiddleware = createMiddleware(routing);

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

const LOCAL_TEST_ALLOWED_ORIGINS = [
  'http://192.168.0.108:3000',
  'http://192.168.0.108:3001',
  'http://192.168.0.108:3010',
  'http://100.112.143.11:3000',
  'http://100.112.143.11:3001',
  'http://100.112.143.11:3010',
];

function getAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGINS || '';
  const fromEnv = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const localTestOrigins = process.env.VERCEL_ENV === 'production'
    ? []
    : LOCAL_TEST_ALLOWED_ORIGINS;
  return [...new Set([...DEFAULT_ALLOWED_ORIGINS, ...localTestOrigins, ...fromEnv])];
}

const rateLimitStore = new Map();

const RATE_LIMITS = {
  feedback: {
    windowMs: 60 * 60 * 1000, 
    maxRequests: 2,           
  },
  contact: {
    windowMs: 60 * 60 * 1000, 
    maxRequests: 2,           
  },
  reservation: {
    windowMs: 60 * 60 * 1000, 
    maxRequests: 2,          
  },
};

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
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP;
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

  record.count += 1;
  rateLimitStore.set(key, record);

  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.windowStart + config.windowMs,
  };
}

function validateOrigin(request) {
  const allowedOrigins = getAllowedOrigins();
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

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

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Generate request correlation ID
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();

  let routeType = null;
  if (pathname.startsWith('/api/feedback')) {
    routeType = 'feedback';
  } else if (pathname.startsWith('/api/contact')) {
    routeType = 'contact';
  } else if (pathname.startsWith('/api/reservation')) {
    routeType = 'reservation';
  }

  if (pathname.startsWith('/api/')) {
    if (!routeType) {
      const response = NextResponse.next();
      response.headers.set('x-request-id', requestId);
      return response;
    }
  }

  if (pathname === '/masa' || pathname.startsWith('/masa/')) {
    const response = NextResponse.next();
    response.headers.set('x-request-id', requestId);
    return response;
  }

  if (!routeType) {
    const response = intlMiddleware(request);
    response.headers.set('x-request-id', requestId);
    return response;
  }

  if (request.method !== 'POST') {
    const response = NextResponse.next();
    response.headers.set('x-request-id', requestId);
    return response;
  }

  if (!validateOrigin(request)) {
    return NextResponse.json(
      { success: false, errors: [{ message: 'Forbidden origin' }] },
      { status: 403, headers: { 'x-request-id': requestId } }
    );
  }

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
          'x-request-id': requestId,
        },
      }
    );
  }

  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
  response.headers.set('X-RateLimit-Reset', String(rateLimit.resetTime));
  response.headers.set('x-request-id', requestId);

  return response;
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};