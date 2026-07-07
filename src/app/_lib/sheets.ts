import { createHmac, timingSafeEqual } from 'node:crypto';
import { google, sheets_v4 } from 'googleapis';

const SHEET_NAME = 'sessions';
const RANGE = `${SHEET_NAME}!A:F`;
const HEADER = ['token', 'masa_id', 'created_at', 'last_ping', 'active', 'last_call'];

export const SESSION_TTL_MS = 30 * 60 * 1000;
export const SESSION_FRESH_MS = 90 * 1000;
export const WAITER_CALL_COOLDOWN_MS = 3 * 60 * 1000;

let cachedClient: sheets_v4.Sheets | null = null;

function readEnv(primary: string, fallback: string): string | undefined {
  return process.env[primary] || process.env[fallback];
}

function getClient(): sheets_v4.Sheets {
  if (cachedClient) return cachedClient;

  const clientEmail = readEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_SHEETS_CLIENT_EMAIL');
  const privateKey = readEnv('GOOGLE_PRIVATE_KEY', 'GOOGLE_SHEETS_PRIVATE_KEY')?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error('Google Sheets credentials not configured');
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  cachedClient = google.sheets({ version: 'v4', auth });
  return cachedClient;
}

function getSpreadsheetId(): string {
  const id = readEnv('GOOGLE_SHEETS_ID', 'GOOGLE_SHEETS_SPREADSHEET_ID');
  if (!id) throw new Error('Google Sheets spreadsheet id not configured');
  return id;
}

function getQrSecret(): string {
  const secret = process.env.QR_MENU_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('QR_MENU_SECRET must be configured with at least 16 characters');
  }
  return secret;
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err: unknown) {
    const status =
      (err as { code?: number; response?: { status?: number } }).code ??
      (err as { response?: { status?: number } }).response?.status;
    if (status === 429) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fn();
    }
    throw err;
  }
}

export interface SessionRow {
  rowIndex: number;
  token: string;
  tableId: string;
  createdAt: string;
  lastPing: string;
  active: boolean;
  lastCall: string;
}

export function normalizeTableId(value: unknown): string {
  const tableId = String(value ?? '').trim();
  if (!/^[1-9]\d{0,2}$/.test(tableId)) return '';
  return tableId;
}

export function signTableId(tableId: string): string {
  return createHmac('sha256', getQrSecret()).update(tableId).digest('hex');
}

export function verifyTableKey(tableId: string, key: string): boolean {
  if (!key || !/^[a-f0-9]{64}$/i.test(key)) return false;
  const expected = signTableId(tableId);
  const actualBuffer = Buffer.from(key.toLowerCase(), 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

function parseRow(row: unknown[], index: number): SessionRow {
  return {
    rowIndex: index + 1,
    token: String(row[0] ?? ''),
    tableId: String(row[1] ?? ''),
    createdAt: String(row[2] ?? ''),
    lastPing: String(row[3] ?? ''),
    active: String(row[4] ?? '').toUpperCase() === 'TRUE',
    lastCall: String(row[5] ?? ''),
  };
}

async function ensureHeader(): Promise<void> {
  const client = getClient();
  const spreadsheetId = getSpreadsheetId();
  const res = await withRetry(() =>
    client.spreadsheets.values.get({ spreadsheetId, range: `${SHEET_NAME}!A1:F1` })
  );
  const current = res.data.values?.[0] ?? [];
  const matches = HEADER.every((name, index) => current[index] === name);

  if (!matches) {
    await withRetry(() =>
      client.spreadsheets.values.update({
        spreadsheetId,
        range: `${SHEET_NAME}!A1:F1`,
        valueInputOption: 'RAW',
        requestBody: { values: [HEADER] },
      })
    );
  }
}

async function getRows(): Promise<SessionRow[]> {
  await ensureHeader();
  const client = getClient();
  const res = await withRetry(() =>
    client.spreadsheets.values.get({ spreadsheetId: getSpreadsheetId(), range: RANGE })
  );
  const rows = res.data.values ?? [];
  return rows.slice(1).map((row, index) => parseRow(row, index + 1));
}

export async function appendSession(row: {
  token: string;
  tableId: string;
  createdAt: string;
  lastPing: string;
  active: boolean;
  lastCall?: string;
}): Promise<void> {
  await ensureHeader();
  const client = getClient();
  await withRetry(() =>
    client.spreadsheets.values.append({
      spreadsheetId: getSpreadsheetId(),
      range: RANGE,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[
          row.token,
          row.tableId,
          row.createdAt,
          row.lastPing,
          row.active ? 'TRUE' : 'FALSE',
          row.lastCall ?? '',
        ]],
      },
    })
  );
}

export async function findSessionByToken(token: string): Promise<SessionRow | null> {
  const rows = await getRows();
  return rows.find((row) => row.token === token) ?? null;
}

export async function updateLastPing(rowIndex: number, lastPing: string): Promise<void> {
  const client = getClient();
  await withRetry(() =>
    client.spreadsheets.values.update({
      spreadsheetId: getSpreadsheetId(),
      range: `${SHEET_NAME}!D${rowIndex}:D${rowIndex}`,
      valueInputOption: 'RAW',
      requestBody: { values: [[lastPing]] },
    })
  );
}

export async function updateSessionActive(rowIndex: number, active: boolean): Promise<void> {
  const client = getClient();
  await withRetry(() =>
    client.spreadsheets.values.update({
      spreadsheetId: getSpreadsheetId(),
      range: `${SHEET_NAME}!E${rowIndex}:E${rowIndex}`,
      valueInputOption: 'RAW',
      requestBody: { values: [[active ? 'TRUE' : 'FALSE']] },
    })
  );
}

export async function deactivateSession(rowIndex: number): Promise<void> {
  await updateSessionActive(rowIndex, false);
}

export async function updateLastCall(rowIndex: number, lastCall: string): Promise<void> {
  const client = getClient();
  await withRetry(() =>
    client.spreadsheets.values.update({
      spreadsheetId: getSpreadsheetId(),
      range: `${SHEET_NAME}!F${rowIndex}:F${rowIndex}`,
      valueInputOption: 'RAW',
      requestBody: { values: [[lastCall]] },
    })
  );
}

export async function findLastCallForTable(tableId: string): Promise<string | null> {
  const rows = await getRows();
  const timestamps = rows
    .filter((row) => row.tableId === tableId && row.lastCall)
    .map((row) => row.lastCall)
    .filter((value) => !Number.isNaN(Date.parse(value)))
    .sort((a, b) => Date.parse(b) - Date.parse(a));
  return timestamps[0] ?? null;
}

export function isSessionWithinTtl(createdAt: string, nowMs = Date.now()): boolean {
  const created = Date.parse(createdAt);
  if (Number.isNaN(created)) return false;
  return nowMs - created <= SESSION_TTL_MS;
}

export function isSessionFresh(lastPing: string, thresholdMs = SESSION_FRESH_MS): boolean {
  const ping = Date.parse(lastPing);
  if (Number.isNaN(ping)) return false;
  return Date.now() - ping <= thresholdMs;
}

export function getWaiterRetryAfterSeconds(lastCall: string | null): number {
  if (!lastCall) return 0;
  const lastCallMs = Date.parse(lastCall);
  if (Number.isNaN(lastCallMs)) return 0;
  const retryAfterMs = WAITER_CALL_COOLDOWN_MS - (Date.now() - lastCallMs);
  return retryAfterMs > 0 ? Math.ceil(retryAfterMs / 1000) : 0;
}
