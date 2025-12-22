import { NextResponse } from 'next/server';

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const ADMIN_TOKEN = process.env.ADMIN_BLACKLIST_TOKEN;

function assertAdmin(request) {
  const token = request.headers.get('x-admin-token');
  return Boolean(ADMIN_TOKEN) && token === ADMIN_TOKEN;
}

async function kvGet(key) {
  if (!KV_URL || !KV_TOKEN) return null;
  const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  return json?.result ?? null;
}

async function kvSet(key, value) {
  if (!KV_URL || !KV_TOKEN) throw new Error('KV not configured');
  const res = await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(value),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`KV set failed: ${res.status} ${txt}`);
  }
}

export async function GET(request) {
  if (!assertAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const list = (await kvGet('reservation:blacklist')) || [];
  return NextResponse.json({ success: true, data: { blacklist: list } });
}

export async function POST(request) {
  if (!assertAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const ip = body?.ip;
  const reason = body?.reason || 'manual';
  if (!ip || typeof ip !== 'string') {
    return NextResponse.json({ success: false, error: 'Missing ip' }, { status: 400 });
  }

  const list = (await kvGet('reservation:blacklist')) || [];
  const next = list.filter((x) => x?.ip !== ip);
  next.push({ ip, reason, createdAt: new Date().toISOString() });
  await kvSet('reservation:blacklist', next);

  return NextResponse.json({ success: true, data: { blacklist: next } });
}

export async function DELETE(request) {
  if (!assertAdmin(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const ip = body?.ip;
  if (!ip || typeof ip !== 'string') {
    return NextResponse.json({ success: false, error: 'Missing ip' }, { status: 400 });
  }

  const list = (await kvGet('reservation:blacklist')) || [];
  const next = list.filter((x) => x?.ip !== ip);
  await kvSet('reservation:blacklist', next);

  return NextResponse.json({ success: true, data: { blacklist: next } });
}
