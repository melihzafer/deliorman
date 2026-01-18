import { NextResponse } from 'next/server';

// Comma-separated list of allowed origins, e.g.
// ALLOWED_ORIGINS=https://deliorman.bg,https://www.deliorman.bg
const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3010',
  'https://deliorman.vercel.app',
  'https://restorantdeliorman.com',
  'https://www.restorantdeliorman.com',
  'https://deliorman-git-dev-mzh-projcets.vercel.app/',
];

function getAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGINS || '';
  const fromEnv = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return [...new Set([...DEFAULT_ALLOWED_ORIGINS, ...fromEnv])];
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only protect reservation API
  if (!pathname.startsWith('/api/reservation')) {
    return NextResponse.next();
  }

  const allowedOrigins = getAllowedOrigins();
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  // Same-origin requests may not send Origin header; validate Host in that case.
  const isAllowed = (() => {
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
  })();

  if (!isAllowed) {
    return NextResponse.json(
      { success: false, errors: [{ message: 'Forbidden origin' }] },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/reservation/:path*'],
};
