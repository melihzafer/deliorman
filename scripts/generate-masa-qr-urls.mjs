/* global console, process, URL */
import { createHmac } from 'node:crypto';

const secret = process.env.QR_MENU_SECRET;
const baseUrl = process.env.QR_MENU_BASE_URL || 'https://restorantdeliorman.com';
const tablesArg = process.argv[2] || '1-20';

if (!secret || secret.length < 16) {
  console.error('QR_MENU_SECRET must be set and at least 16 characters long.');
  process.exit(1);
}

function expandTables(value) {
  const range = value.match(/^(\d+)-(\d+)$/);
  if (range) {
    const start = Number(range[1]);
    const end = Number(range[2]);
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start) {
      throw new Error('Invalid table range.');
    }
    return Array.from({ length: end - start + 1 }, (_, index) => String(start + index));
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function sign(tableId) {
  return createHmac('sha256', secret).update(tableId).digest('hex');
}

for (const tableId of expandTables(tablesArg)) {
  if (!/^[1-9]\d{0,2}$/.test(tableId)) {
    throw new Error(`Invalid table id: ${tableId}`);
  }

  const url = new URL('/masa', baseUrl);
  url.searchParams.set('id', tableId);
  url.searchParams.set('key', sign(tableId));
  console.log(url.toString());
}
