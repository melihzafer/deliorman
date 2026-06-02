import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import {
  appendSession,
  normalizeTableId,
  SESSION_TTL_MS,
  verifyTableKey,
} from '../../../_lib/sheets';
import {
  createMasaDevSession,
  isLocalMasaDevRequest,
} from '../../../_lib/masaDevSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface StartBody {
  tableId?: unknown;
  key?: unknown;
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: StartBody;
  try {
    body = (await request.json()) as StartBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const tableId = normalizeTableId(body.tableId);
  const key = typeof body.key === 'string' ? body.key.trim() : '';
  const isLocalDevRequest = isLocalMasaDevRequest(request);

  if (!tableId || (!key && !isLocalDevRequest)) {
    return NextResponse.json({ error: 'Invalid session request' }, { status: 400 });
  }

  if (isLocalDevRequest) {
    const session = createMasaDevSession(tableId);
    return NextResponse.json({
      token: session.token,
      expiresInSeconds: SESSION_TTL_MS / 1000,
      localTestSession: true,
    });
  }

  try {
    if (!verifyTableKey(tableId, key)) {
      return NextResponse.json({ error: 'Invalid QR session' }, { status: 401 });
    }
  } catch (err) {
    console.error('[session/start] QR secret error:', err);
    return NextResponse.json({ error: 'Session service unavailable' }, { status: 503 });
  }

  const token = randomUUID();
  const now = new Date().toISOString();

  try {
    await appendSession({
      token,
      tableId,
      createdAt: now,
      lastPing: now,
      active: true,
    });
  } catch (err) {
    console.error('[session/start] sheets error:', err);
    return NextResponse.json({ error: 'Session service unavailable' }, { status: 503 });
  }

  return NextResponse.json({
    token,
    expiresInSeconds: SESSION_TTL_MS / 1000,
  });
}
