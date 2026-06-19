/**
 * Shared in-memory rate limiter for API route handlers.
 *
 * Same trade-offs as the middleware limiter: per-instance state that resets on
 * redeploy. Good enough as defense-in-depth behind the middleware checks; for
 * strict global limits move to Redis/Vercel KV.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitOptions {
  /** Length of the rolling window in seconds. */
  windowSeconds: number;
  /** Maximum number of requests allowed inside the window. */
  max: number;
}

export interface RateLimitResult {
  limited: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

declare global {
  var __apiRateLimitStore: Map<string, RateLimitEntry> | undefined;
}

const store =
  globalThis.__apiRateLimitStore ?? (globalThis.__apiRateLimitStore = new Map<string, RateLimitEntry>());

const MAX_STORE_ENTRIES = 5000;

function evictExpired(now: number): void {
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

/**
 * Count a hit for `key` and report whether it exceeded the limit.
 *
 * @param key Unique identifier, e.g. `ai:{clientIp}`.
 */
export function checkRateLimit(key: string, { windowSeconds, max }: RateLimitOptions): RateLimitResult {
  const now = Date.now();

  if (store.size > MAX_STORE_ENTRIES) {
    evictExpired(now);
  }

  const windowMs = windowSeconds * 1000;
  const entry = store.get(key) ?? { count: 0, resetAt: now + windowMs };

  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }

  entry.count += 1;
  store.set(key, entry);

  return {
    limited: entry.count > max,
    remaining: Math.max(0, max - entry.count),
    retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}

/**
 * Read a positive integer limit from an environment variable with a fallback.
 */
export function envLimit(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}
