import { randomUUID } from 'node:crypto';

const LOCAL_TEST_HOSTS = new Set([
  'localhost:3000',
  'localhost:3001',
  'localhost:3010',
  '127.0.0.1:3000',
  '127.0.0.1:3001',
  '127.0.0.1:3010',
  '192.168.0.108:3000',
  '192.168.0.108:3001',
  '192.168.0.108:3010',
  '100.112.143.11:3000',
  '100.112.143.11:3001',
  '100.112.143.11:3010',
]);

const DEV_TOKEN_PREFIX = 'dev-local-';

export interface MasaDevSession {
  token: string;
  tableId: string;
  createdAt: string;
  lastPing: string;
  active: boolean;
  lastCall: string;
}

type GlobalWithMasaDevSessions = typeof globalThis & {
  __deliormanMasaDevSessions?: Map<string, MasaDevSession>;
};

function getStore(): Map<string, MasaDevSession> {
  const globalStore = globalThis as GlobalWithMasaDevSessions;
  if (!globalStore.__deliormanMasaDevSessions) {
    globalStore.__deliormanMasaDevSessions = new Map();
  }
  return globalStore.__deliormanMasaDevSessions;
}

function getOriginHost(request: Request): string {
  const origin = request.headers.get('origin');
  if (!origin) return '';
  try {
    return new URL(origin).host.toLowerCase();
  } catch {
    return '';
  }
}

export function isLocalMasaDevRequest(request: Request): boolean {
  if (process.env.VERCEL_ENV === 'production') return false;
  const candidates = [
    request.headers.get('host')?.toLowerCase() ?? '',
    request.headers.get('x-forwarded-host')?.toLowerCase() ?? '',
    getOriginHost(request),
  ];
  return candidates.some((host) => LOCAL_TEST_HOSTS.has(host));
}

export function isMasaDevToken(token: string): boolean {
  return token.startsWith(DEV_TOKEN_PREFIX);
}

export function createMasaDevSession(tableId: string, now = new Date().toISOString()): MasaDevSession {
  const session = {
    token: `${DEV_TOKEN_PREFIX}${randomUUID()}`,
    tableId,
    createdAt: now,
    lastPing: now,
    active: true,
    lastCall: '',
  };
  getStore().set(session.token, session);
  return session;
}

export function findMasaDevSession(token: string): MasaDevSession | null {
  return getStore().get(token) ?? null;
}

export function updateMasaDevLastPing(token: string, lastPing: string): void {
  const session = getStore().get(token);
  if (session) session.lastPing = lastPing;
}

export function updateMasaDevLastCall(token: string, lastCall: string): void {
  const session = getStore().get(token);
  if (session) session.lastCall = lastCall;
}

export function findMasaDevLastCallForTable(tableId: string): string | null {
  const timestamps = [...getStore().values()]
    .filter((session) => session.tableId === tableId && session.lastCall)
    .map((session) => session.lastCall)
    .filter((value) => !Number.isNaN(Date.parse(value)))
    .sort((a, b) => Date.parse(b) - Date.parse(a));
  return timestamps[0] ?? null;
}
