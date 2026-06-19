import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { getClientIp } from '@library/clientIp';
import { checkRateLimit, envLimit } from '@library/rate-limit';

export const runtime = 'nodejs';

/**
 * QR code generator for the restaurant's own pages.
 *
 * Security model: this endpoint never encodes arbitrary input. The destination
 * is built server-side from an allowlisted path + validated table/locale, so it
 * cannot be abused as a free QR generator for phishing links.
 */

const ALLOWED_PATHS = ['/menu', '/menu-2', '/lunch-menu', '/feedback', '/reservation', '/table', '/'] as const;
const SUPPORTED_LOCALES = ['bg', 'en', 'tr'] as const;

const MIN_SIZE = 96;
const MAX_SIZE = 1024;
const DEFAULT_SIZE = 512;

function getSiteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) {
    try {
      return new URL(fromEnv).origin;
    } catch {
      // Fall through to default below.
    }
  }
  return 'https://www.restorantdeliorman.com';
}

function badRequest(message: string): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

export async function GET(request: Request): Promise<Response> {
  const { ip: clientIp } = getClientIp(request);
  const rate = checkRateLimit(`qr:${clientIp}`, {
    windowSeconds: envLimit('QR_RATE_WINDOW_SECONDS', 60),
    max: envLimit('QR_RATE_MAX', 120),
  });
  if (rate.limited) {
    return NextResponse.json(
      { success: false, error: 'Too many requests.' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } },
    );
  }

  const url = new URL(request.url);

  const path = url.searchParams.get('path') || '/menu';
  if (!(ALLOWED_PATHS as readonly string[]).includes(path)) {
    return badRequest(`Invalid path. Allowed: ${ALLOWED_PATHS.join(', ')}`);
  }

  const localeParam = url.searchParams.get('locale') || 'bg';
  if (!(SUPPORTED_LOCALES as readonly string[]).includes(localeParam)) {
    return badRequest(`Invalid locale. Allowed: ${SUPPORTED_LOCALES.join(', ')}`);
  }

  const tableLimit = envLimit('QR_TABLE_LIMIT', 100);
  const tableParam = url.searchParams.get('table');
  let table: number | null = null;
  if (tableParam !== null && tableParam !== '') {
    table = Number(tableParam);
    if (!Number.isInteger(table) || table < 1 || table > tableLimit) {
      return badRequest(`Invalid table. Must be an integer between 1 and ${tableLimit}.`);
    }
  }

  const sizeParam = url.searchParams.get('size');
  let size = DEFAULT_SIZE;
  if (sizeParam !== null && sizeParam !== '') {
    size = Number(sizeParam);
    if (!Number.isInteger(size) || size < MIN_SIZE || size > MAX_SIZE) {
      return badRequest(`Invalid size. Must be an integer between ${MIN_SIZE} and ${MAX_SIZE}.`);
    }
  }

  // Non-default locales are prefixed (/en/menu); Bulgarian is unprefixed.
  const localizedPath = localeParam === 'bg' ? path : `/${localeParam}${path === '/' ? '' : path}`;
  const target = new URL(localizedPath || '/', getSiteOrigin());
  if (table) {
    target.searchParams.set('table', String(table));
  }

  try {
    const svg = await QRCode.toString(target.toString(), {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 2,
      width: size,
      color: { dark: '#1a2f33', light: '#ffffff' },
    });

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        // Output is deterministic for given params — cache aggressively.
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, immutable',
        'X-QR-Target': target.toString(),
      },
    });
  } catch (error) {
    console.error('[qr] generation failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate QR code.' },
      { status: 500 },
    );
  }
}
