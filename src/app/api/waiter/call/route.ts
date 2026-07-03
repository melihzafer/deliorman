import { NextResponse } from 'next/server';
import { escapeHtml } from '@library/htmlUtils';
import { getClientIp } from '@library/clientIp';
import { checkRateLimit } from '@library/rate-limit';
import {
  deactivateSession,
  findLastCallForTable,
  findSessionByToken,
  getWaiterRetryAfterSeconds,
  isSessionFresh,
  isSessionWithinTtl,
  normalizeTableId,
  updateLastCall,
} from '../../../_lib/sheets';
import {
  findMasaDevLastCallForTable,
  findMasaDevSession,
  isLocalMasaDevRequest,
  isMasaDevToken,
  updateMasaDevLastCall,
} from '../../../_lib/masaDevSession';
import { isVipToken } from '../../../_lib/vipSession';
import { sendTelegramMessage } from '../../../_lib/telegram';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface CallBody {
  token?: unknown;
  tableId?: unknown;
  message?: unknown;
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: CallBody;
  try {
    body = (await request.json()) as CallBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const token = typeof body.token === 'string' ? body.token.trim() : '';
  const tableId = normalizeTableId(body.tableId);
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 240) : '';
  if (!token || !tableId) {
    return NextResponse.json({ error: 'token and tableId required' }, { status: 400 });
  }

  const { ip: clientIp } = getClientIp(request);
  const tokenRate = checkRateLimit(`waiter-token:${token}`, { windowSeconds: 180, max: 1 });
  const ipRate = checkRateLimit(`waiter-ip:${clientIp}`, { windowSeconds: 60, max: 30 });
  if (tokenRate.limited || ipRate.limited) {
    return NextResponse.json(
      {
        error: 'Lütfen biraz bekleyin',
        retryAfterSeconds: Math.max(tokenRate.retryAfterSeconds, ipRate.retryAfterSeconds),
      },
      { status: 429 },
    );
  }

  if (isVipToken(token)) {
    return NextResponse.json(
      { error: 'Waiter calling is disabled for VIP sessions' },
      { status: 403 }
    );
  }

  if (isMasaDevToken(token)) {
    if (!isLocalMasaDevRequest(request)) {
      return NextResponse.json({ error: 'Oturumunuz sona erdi' }, { status: 403 });
    }
    const session = findMasaDevSession(token);
    if (
      !session?.active ||
      !isSessionWithinTtl(session.createdAt) ||
      !isSessionFresh(session.lastPing) ||
      session.tableId !== tableId
    ) {
      return NextResponse.json({ error: 'Oturumunuz sona erdi' }, { status: 403 });
    }

    const retryAfterSeconds = getWaiterRetryAfterSeconds(findMasaDevLastCallForTable(tableId));
    if (retryAfterSeconds > 0) {
      return NextResponse.json(
        { error: 'Lütfen biraz bekleyin', retryAfterSeconds },
        { status: 429 }
      );
    }

    const sentAt = new Date();
    const time = sentAt.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Sofia',
    });
    const text = [
      '🔔 Garson Çağrısı',
      `Masa: ${session.tableId}`,
      `Saat: ${time}`,
      'Durum: Aktif ✅',
      message ? `Mesaj: ${escapeHtml(message)}` : '',
    ].filter(Boolean).join('\n');

    try {
      await sendTelegramMessage(text);
    } catch (err) {
      console.error('[waiter/call] local test telegram error:', err);
      return NextResponse.json({ error: 'Notification failed' }, { status: 502 });
    }

    updateMasaDevLastCall(token, sentAt.toISOString());
    return NextResponse.json({ ok: true, localTestSession: true });
  }

  let session;
  try {
    session = await findSessionByToken(token);
  } catch (err) {
    console.error('[waiter/call] sheets error:', err);
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  if (!session || !session.active) {
    return NextResponse.json(
      { error: 'Oturumunuz sona erdi' },
      { status: 403 }
    );
  }

  if (!isSessionWithinTtl(session.createdAt)) {
    await deactivateSession(session.rowIndex).catch((err) => {
      console.error('[waiter/call] deactivate expired session failed:', err);
    });
    return NextResponse.json(
      { error: 'Oturumunuz sona erdi' },
      { status: 403 }
    );
  }

  if (!isSessionFresh(session.lastPing) || session.tableId !== tableId) {
    return NextResponse.json(
      { error: 'Oturumunuz sona erdi' },
      { status: 403 }
    );
  }

  let retryAfterSeconds = 0;
  try {
    retryAfterSeconds = getWaiterRetryAfterSeconds(await findLastCallForTable(tableId));
  } catch (err) {
    console.error('[waiter/call] rate limit sheets error:', err);
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  if (retryAfterSeconds > 0) {
    return NextResponse.json(
      { error: 'Lütfen biraz bekleyin', retryAfterSeconds },
      { status: 429 }
    );
  }

  const time = new Date().toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Sofia',
  });

  const text = [
    '🔔 Garson Çağrısı',
    `Masa: ${session.tableId}`,
    `Saat: ${time}`,
    'Durum: Aktif ✅',
    message ? `Mesaj: ${escapeHtml(message)}` : '',
  ].filter(Boolean).join('\n');

  try {
    await sendTelegramMessage(text);
  } catch (err) {
    console.error('[waiter/call] telegram error:', err);
    return NextResponse.json({ error: 'Notification failed' }, { status: 502 });
  }

  try {
    await updateLastCall(session.rowIndex, new Date().toISOString());
  } catch (err) {
    console.error('[waiter/call] last_call sheets error:', err);
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
