import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { appendSession } from '../../../_lib/sheets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface CreateBody {
  tableId?: unknown;
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: CreateBody;
  try {
    body = (await request.json()) as CreateBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const tableId = typeof body.tableId === 'string' ? body.tableId.trim() : '';
  if (!tableId || tableId.length > 64) {
    return NextResponse.json({ error: 'tableId required' }, { status: 400 });
  }

  const token = randomUUID();
  const now = new Date().toISOString();

  try {
    await appendSession({ token, tableId, createdAt: now, lastPing: now, active: true });
  } catch (err) {
    console.error('[session/create] sheets error:', err);
    return NextResponse.json({ error: 'Session service unavailable' }, { status: 503 });
  }

  return NextResponse.json({ token });
}
