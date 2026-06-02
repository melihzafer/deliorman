import { NextResponse } from 'next/server';
import {
  deactivateSession,
  findSessionByToken,
  isSessionWithinTtl,
  updateLastPing,
} from '../../../_lib/sheets';
import {
  findMasaDevSession,
  isLocalMasaDevRequest,
  isMasaDevToken,
  updateMasaDevLastPing,
} from '../../../_lib/masaDevSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PingBody {
  token?: unknown;
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: PingBody;
  try {
    body = (await request.json()) as PingBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const token = typeof body.token === 'string' ? body.token.trim() : '';
  if (!token) {
    return NextResponse.json({ error: 'token required' }, { status: 400 });
  }

  if (isMasaDevToken(token)) {
    if (!isLocalMasaDevRequest(request)) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }
    const session = findMasaDevSession(token);
    if (!session?.active || !isSessionWithinTtl(session.createdAt)) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }
    updateMasaDevLastPing(token, new Date().toISOString());
    return NextResponse.json({ ok: true, localTestSession: true });
  }

  try {
    const session = await findSessionByToken(token);
    if (!session || !session.active) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }
    if (!isSessionWithinTtl(session.createdAt)) {
      await deactivateSession(session.rowIndex).catch((err) => {
        console.error('[session/ping] deactivate expired session failed:', err);
      });
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }
    await updateLastPing(session.rowIndex, new Date().toISOString());
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[session/ping] sheets error:', err);
    return NextResponse.json({ error: 'Session service unavailable' }, { status: 503 });
  }
}
