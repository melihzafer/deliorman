/**
 * @jest-environment node
 */

import { POST, GET } from '../reservation/route';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('@library/client-ip', () => ({
  getClientIp: jest.fn(() => ({ ip: 'localhost', source: 'dev-fallback', chain: [] })),
}));

jest.mock('@library/bgPhoneUtils', () => ({
  validateBgPhone: jest.fn((input) => {
    const raw = String(input ?? '').replace(/[\s\-()]/g, '');
    let s = raw;
    if (s.startsWith('00')) s = `+${s.slice(2)}`;
    if (s.startsWith('359')) s = `+${s}`;
    if (s.startsWith('08')) s = `+359${s.slice(1)}`;
    if (/^\+359\d{9}$/.test(s)) {
      return { ok: true, normalized: s, message: '' };
    }
    return { ok: false, normalized: s, message: 'Невалиден телефон. Пример: +359888123456 или 0888123456.' };
  }),
}));

jest.mock('@library/htmlUtils', () => ({
  escapeHtml: jest.fn((text) =>
    String(text ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;'),
  ),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

beforeAll(() => {
  process.env.TELEGRAM_BOT_TOKEN = 'test-token';
  process.env.TELEGRAM_RESERVATIONS_CHAT_ID = 'test-chat-id';
});

beforeEach(() => {
  // Clear the in-memory rate limiter so every test starts fresh.
  // The route module captures a reference to the Map at import time,
  // so we must .clear() the existing Map rather than replacing it.
  if (globalThis.__reservationRate) {
    globalThis.__reservationRate.clear();
  } else {
    globalThis.__reservationRate = new Map();
  }

  // Mock global.fetch for Telegram calls
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    }),
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

/**
 * Build a Request object whose body is a FormData.
 */
function createFormDataRequest(fields) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }
  return new Request('http://localhost/api/reservation', {
    method: 'POST',
    body: formData,
    headers: { 'x-forwarded-for': '127.0.0.1' },
  });
}

/**
 * Return a date string (YYYY-MM-DD) and a time string (HH:mm) that are
 * guaranteed to be at least 5 hours from now.
 */
function futureDateTime() {
  const d = new Date(Date.now() + 6 * 60 * 60 * 1000); // +6 h
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return { date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${min}` };
}

/**
 * Return a past date (yesterday) at 10:00.
 */
function pastDateTime() {
  const d = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return { date: `${yyyy}-${mm}-${dd}`, time: '10:00' };
}

function validFields(overrides = {}) {
  const { date, time } = futureDateTime();
  return {
    first_name: 'Иван',
    last_name: 'Петров',
    phone: '+359888123456',
    person: '4',
    date,
    time,
    message: 'Тестово съобщение',
    privacy_consent: 'true',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Reservation API Route', () => {
  // 1. GET returns 405
  test('GET returns 405 Method Not Allowed', async () => {
    const res = GET();
    expect(res.status).toBe(405);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  // 2. Valid reservation returns success
  test('Valid reservation returns success', async () => {
    const req = createFormDataRequest(validFields());
    const res = await POST(req);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.phone).toBe('+359888123456');
    expect(global.fetch).toHaveBeenCalled();
  });

  // 3. Missing first_name
  test('Missing first_name returns 400', async () => {
    const req = createFormDataRequest(validFields({ first_name: '' }));
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.errors.some((e) => e.field === 'first_name')).toBe(true);
  });

  // 4. Missing last_name
  test('Missing last_name returns 400', async () => {
    const req = createFormDataRequest(validFields({ last_name: 'A' }));
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.errors.some((e) => e.field === 'last_name')).toBe(true);
  });

  // 5. Invalid phone format
  test('Invalid phone format returns 400', async () => {
    const req = createFormDataRequest(validFields({ phone: '123' }));
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.errors.some((e) => e.field === 'phone')).toBe(true);
  });

  // 6. Invalid person count
  describe('Invalid person count returns 400', () => {
    test.each([
      ['0', 'zero'],
      ['101', 'over max'],
      ['abc', 'non-numeric'],
    ])('person=%s (%s)', async (person) => {
      const req = createFormDataRequest(validFields({ person }));
      const res = await POST(req);
      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.errors.some((e) => e.field === 'person')).toBe(true);
    });
  });

  // 7. Past date returns 400
  test('Past date returns 400', async () => {
    const { date, time } = pastDateTime();
    const req = createFormDataRequest(validFields({ date, time }));
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(
      body.errors.some((e) => e.field === 'date' || e.field === 'time'),
    ).toBe(true);
  });

  // 8. Missing time returns 400
  test('Missing time returns 400', async () => {
    const req = createFormDataRequest(validFields({ time: 'Час' }));
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.errors.some((e) => e.field === 'time')).toBe(true);
  });

  // 9. Missing privacy_consent returns 400
  test('Missing privacy_consent returns 400', async () => {
    const req = createFormDataRequest(validFields({ privacy_consent: '' }));
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.errors.some((e) => e.field === 'privacy_consent')).toBe(true);
  });

  // 10. Honeypot filled returns fake success
  test('Honeypot filled returns fake success (200)', async () => {
    const req = createFormDataRequest(validFields({ company: 'SpamBot Inc.' }));
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    // Telegram should NOT have been called
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
