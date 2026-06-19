/**
 * @jest-environment node
 */

import { POST } from '../contact/route';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('@library/clientIp', () => ({
  getClientIp: jest.fn(() => ({ ip: 'localhost', source: 'dev-fallback', chain: [] })),
}));

jest.mock('@library/htmlUtils', () => ({
  escapeHtml: jest.fn((text) =>
    String(text ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;'),
  ),
}));

const mockSend = jest.fn().mockResolvedValue({ id: 'test-email-id' });

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: mockSend,
    },
  })),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

beforeAll(() => {
  process.env.RESEND_API_KEY = 'test-api-key';
  process.env.TELEGRAM_BOT_TOKEN = 'test-token';
  process.env.TELEGRAM_RESERVATIONS_CHAT_ID = 'test-chat-id';
});

beforeEach(() => {
  mockSend.mockClear();

  // Mock global.fetch for Telegram fire-and-forget calls
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

function createFormDataRequest(fields) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    body: formData,
    headers: { 'x-forwarded-for': '127.0.0.1' },
  });
}

function validFields(overrides = {}) {
  return {
    first_name: 'Иван',
    last_name: 'Петров',
    email: 'ivan@example.com',
    phone: '+359888123456',
    message: 'Това е тестово съобщение за контакт',
    privacy_consent: 'true',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Contact API Route', () => {
  // 1. Valid contact submission returns success
  test('Valid contact submission returns success', async () => {
    const req = createFormDataRequest(validFields());
    const res = await POST(req);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  // 2. Missing first_name
  test('Missing first_name returns 400', async () => {
    const req = createFormDataRequest(validFields({ first_name: '' }));
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.errors.some((e) => e.field === 'first_name')).toBe(true);
  });

  // 3. Invalid email
  test('Invalid email returns 400', async () => {
    const req = createFormDataRequest(validFields({ email: 'not-an-email' }));
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.errors.some((e) => e.field === 'email')).toBe(true);
  });

  // 4. Short message (<10 chars)
  test('Short message returns 400', async () => {
    const req = createFormDataRequest(validFields({ message: 'Кратко' }));
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.errors.some((e) => e.field === 'message')).toBe(true);
  });

  // 5. Missing privacy_consent
  test('Missing privacy_consent returns 400', async () => {
    const req = createFormDataRequest(validFields({ privacy_consent: '' }));
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.errors.some((e) => e.field === 'privacy_consent')).toBe(true);
  });

  // 6. Multiple validation errors returned at once
  test('Multiple validation errors returned at once', async () => {
    const req = createFormDataRequest({
      first_name: '',
      last_name: '',
      email: 'bad',
      phone: '12',
      message: 'short',
      privacy_consent: '',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    // Should have errors for every invalid field
    const fields = body.errors.map((e) => e.field);
    expect(fields).toContain('first_name');
    expect(fields).toContain('last_name');
    expect(fields).toContain('email');
    expect(fields).toContain('phone');
    expect(fields).toContain('message');
    expect(fields).toContain('privacy_consent');
  });

  // 7. XSS in message field – escapeHtml is applied for Telegram, raw text used for email
  test('XSS in message field – escapeHtml is used for Telegram message', async () => {
    const { escapeHtml } = require('@library/htmlUtils');
    escapeHtml.mockClear();

    const xssPayload = '<script>alert("xss")</script>';
    const req = createFormDataRequest(validFields({ message: xssPayload }));
    const res = await POST(req);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);

    // escapeHtml should have been called (used in the Telegram message)
    expect(escapeHtml).toHaveBeenCalled();
    // At least one call should have received the XSS payload
    const calledWithPayload = escapeHtml.mock.calls.some(
      (args) => String(args[0]) === xssPayload,
    );
    expect(calledWithPayload).toBe(true);

    // The plain-text email sent via Resend should contain the raw message
    expect(mockSend).toHaveBeenCalledTimes(1);
    const sendArgs = mockSend.mock.calls[0][0];
    expect(sendArgs.text).toContain(xssPayload);
  });
});
