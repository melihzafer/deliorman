import { randomUUID, timingSafeEqual } from 'node:crypto';

const VIP_TOKEN_PREFIX = 'vip-';
const MIN_SECRET_LENGTH = 24;

export interface VipSession {
  token: string;
  createdAt: string;
  lastPing: string;
}

type GlobalWithVipSessions = typeof globalThis & {
  __deliormanVipSessions?: Map<string, VipSession>;
};

function getStore(): Map<string, VipSession> {
  const globalStore = globalThis as GlobalWithVipSessions;
  if (!globalStore.__deliormanVipSessions) {
    globalStore.__deliormanVipSessions = new Map();
  }
  return globalStore.__deliormanVipSessions;
}

function getVipSecret(): string | null {
  const secret = process.env.VIP_MENU_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) return null;
  return secret;
}

export function isVipSecretConfigured(): boolean {
  return getVipSecret() !== null;
}

export function isVipToken(token: string): boolean {
  return typeof token === 'string' && token.startsWith(VIP_TOKEN_PREFIX);
}

export function validateVipSecret(secret: string): boolean {
  const expected = getVipSecret();
  if (!expected) return false;
  if (typeof secret !== 'string' || secret.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(secret, 'utf8'), Buffer.from(expected, 'utf8'));
  } catch {
    return false;
  }
}

export function createVipSession(now = new Date().toISOString()): VipSession {
  const session: VipSession = {
    token: `${VIP_TOKEN_PREFIX}${randomUUID()}`,
    createdAt: now,
    lastPing: now,
  };
  getStore().set(session.token, session);
  return session;
}

export function findVipSession(token: string): VipSession | null {
  if (!isVipToken(token)) return null;
  return getStore().get(token) ?? null;
}

export function touchVipSession(token: string, lastPing: string): void {
  const session = getStore().get(token);
  if (session) session.lastPing = lastPing;
}
