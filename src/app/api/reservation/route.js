import { NextResponse } from 'next/server';
import { getClientIp } from '@library/client-ip';

export const runtime = 'nodejs';

/**
 * Normalize Bulgarian phone number to E.164 format
 * @param {string|number} input - The raw phone number input
 * @returns {string} - Normalized phone number in E.164 format
 */
function normalizeBgPhone(input) {
  const raw = String(input ?? '').trim();
  if (!raw) return '';

  let s = raw.replace(/[\s\-()]/g, '');

  // 00359... -> +359...
  if (s.startsWith('00')) s = `+${s.slice(2)}`;

  // 359... -> +359...
  if (s.startsWith('359')) s = `+${s}`;

  // 08XXXXXXXXX -> +3598XXXXXXXX
  if (s.startsWith('08')) s = `+359${s.slice(1)}`;

  return s;
}

/**
 * Validate Bulgarian phone number
 * @param {string|number} input - The raw phone number input
 * @returns {Object} - Validation result { ok, normalized, message }
 */
function validateBgPhone(input) {
  const normalized = normalizeBgPhone(input);
  if (!normalized) {
    return { ok: false, normalized: '', message: 'Моля въведете телефонен номер' };
  }

  if (!/^\+\d+$/.test(normalized)) {
    return { ok: false, normalized, message: 'Невалиден телефон. Пример: +359888123456 или 0888123456.' };
  }

  if (!normalized.startsWith('+359')) {
    return { ok: false, normalized, message: 'Невалиден телефон. Пример: +359888123456 или 0888123456.' };
  }

  // Common BG mobile length
  if (normalized.length !== 13) {
    return { ok: false, normalized, message: 'Невалиден телефон. Пример: +359888123456 или 0888123456.' };
  }

  return { ok: true, normalized, message: '' };
}

/**
 * Escape HTML special characters in a string
 * @param {string} text - The input text
 * @returns {string} - The text with escaped HTML characters
 */
function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Send reservation details to Telegram via bot
 * @param {Object} params - Parameters for sending Telegram message
 * @param {string} params.text - The message text
 * @param {Object} [params.replyMarkup] - Optional reply markup (inline keyboard)
 * @returns {Promise<Object>} - Telegram API response
 */
async function sendTelegramReservation({ text, replyMarkup }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_RESERVATIONS_CHAT_ID;
  const isTelegramDisabled = String(process.env.TELEGRAM_DISABLE || '').toLowerCase() === 'true';

  if (isTelegramDisabled) {
    // Intentionally do nothing when Telegram is disabled.
    return { ok: true, skipped: true };
  }

  if (!token || !chatId) {
    throw new Error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_RESERVATIONS_CHAT_ID env vars');
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    }),
  });

  const payload = await res.json().catch(() => null);
  if (!res.ok || !payload?.ok) {
    const desc = payload?.description || `Telegram API error (${res.status})`;
    // Don't leak token/chat id; provide actionable message
    throw new Error(`Telegram send failed: ${desc}`);
  }

  return payload;
}

/**
 * Parse date and time from separate strings to JavaScript Date object
 * @param {string} dateStr - Date string (YYYY-MM-DD)
 * @param {string} timeStr - Time string (HH:mm)
 * @returns {Date|null} - Parsed Date object or null if invalid
 */
function parseDateTimeLocal(dateStr, timeStr) {
  // dateStr: YYYY-MM-DD, timeStr: HH:mm
  if (!dateStr || !timeStr) return null;
  const [y, m, d] = String(dateStr).split('-').map(Number);
  const [hh, mm] = String(timeStr).split(':').map(Number);
  if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

/**
 * Round up a date to the next hour
 * @param {Date} date - The input date
 * @returns {Date} - The rounded date
 */
function roundUpToNextHour(date) {
  const d = new Date(date);
  d.setMinutes(0, 0, 0);
  if (date.getMinutes() !== 0 || date.getSeconds() !== 0 || date.getMilliseconds() !== 0) {
    d.setHours(d.getHours() + 1);
  }
  return d;
}

// NOTE: Blacklist / IP audit / KV storage removed per request.

const RATE_LIMIT_WINDOW_SECONDS = Number(process.env.RESERVATION_RATE_WINDOW_SECONDS || 600); // 10 min
const RATE_LIMIT_MAX = Number(process.env.RESERVATION_RATE_MAX || 5);

// In-memory rate limiter (per process)
const memoryRate = globalThis.__reservationRate || (globalThis.__reservationRate = new Map());

/**
 * Check if the request is rate limited
 * @param {Request} request - The incoming request object
 * @returns {Promise<boolean>} - True if rate limited, false otherwise
 */
async function isRateLimited(request) {
  // Memory only - using IP as identifier
  const { ip: clientIp } = getClientIp(request);
  const keyBase = `reservation:rate:${clientIp}`;
  const now = Date.now();
  const windowMs = RATE_LIMIT_WINDOW_SECONDS * 1000;
  const entry = memoryRate.get(keyBase) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count += 1;
  memoryRate.set(keyBase, entry);
  return entry.count > RATE_LIMIT_MAX;
}

export function GET() {
  return NextResponse.json(
    {
      success: false,
      error: 'Method Not Allowed. Use POST to submit a reservation.'
    },
    {
      status: 405,
      headers: {
        Allow: 'POST, OPTIONS'
      }
    }
  );
}

export function HEAD() {
  return new NextResponse(null, {
    status: 405,
    headers: {
      Allow: 'POST, OPTIONS'
    }
  });
}

export function OPTIONS() {
  // Helps with CORS preflight (even though same-origin usually doesn't need it).
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: 'POST, OPTIONS',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

export async function POST(request) {
  try {
    // Capture client IP for security/audit purposes
    const ipInfo = getClientIp(request);
    const clientIp = ipInfo.ip;

    // Basic rate limit
    if (await isRateLimited(request)) {
      return NextResponse.json(
        { success: false, errors: [{ message: 'Твърде много заявки. Моля, опитайте отново след малко.' }] },
        { status: 429 }
      );
    }

    const formData = await request.formData();

    // Honeypot (bots tend to fill it). Field is optional and hidden in UI.
    const hp = formData.get('company');
    if (hp && String(hp).trim() !== '') {
      return NextResponse.json({ success: true });
    }

    // Extract form data
    const firstName = formData.get('first_name');
    const lastName = formData.get('last_name');
    const phoneRaw = formData.get('phone');
    const person = formData.get('person');
    const date = formData.get('date');
    const time = formData.get('time');
    const message = formData.get('message') || 'Няма допълнително съобщение';
    const privacyConsentRaw = formData.get('privacy_consent');

    // Validation
    const errors = [];

    const privacyConsent = (() => {
      const v = String(privacyConsentRaw ?? '').trim().toLowerCase();
      return v === 'true' || v === '1' || v === 'on' || v === 'yes';
    })();

    if (!privacyConsent) {
      errors.push({
        field: 'privacy_consent',
        message: 'Моля, потвърдете, че сте се запознали с правилата и условията и информацията за лични данни.'
      });
    }

    if (!firstName || firstName.trim().length < 2) {
      errors.push({ field: 'first_name', message: 'Името трябва да е поне 2 символа' });
    }

    if (!lastName || lastName.trim().length < 2) {
      errors.push({ field: 'last_name', message: 'Фамилията трябва да е поне 2 символа' });
    }

    const phoneCheck = validateBgPhone(phoneRaw);
    if (!phoneCheck.ok) {
      errors.push({ field: 'phone', message: phoneCheck.message });
    }

    // Guests validation (numeric, allow large groups)
    const guestsNum = Number(person);
    if (person === null || String(person).trim() === '') {
      errors.push({ field: 'person', message: 'Моля въведете брой гости' });
    } else if (!Number.isFinite(guestsNum) || !Number.isInteger(guestsNum)) {
      errors.push({ field: 'person', message: 'Моля въведете валиден брой гости' });
    } else if (guestsNum < 1) {
      errors.push({ field: 'person', message: 'Броят гости трябва да е поне 1' });
    } else if (guestsNum > 100) {
      errors.push({ field: 'person', message: 'Максималният брой гости е 100' });
    }

    if (!date) {
      errors.push({ field: 'date', message: 'Моля изберете дата' });
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const maxDate = new Date(today);
      maxDate.setMonth(today.getMonth() + 1);
      // Handle month overflow (e.g. Jan 31 -> Feb 28/29)
      if (today.getDate() !== maxDate.getDate()) {
        maxDate.setDate(0);
      }
      maxDate.setHours(23, 59, 59, 999);

      if (selectedDate < today) {
        errors.push({ field: 'date', message: 'Не може да резервирате за минала дата' });
      } else if (selectedDate > maxDate) {
        errors.push({ field: 'date', message: 'Резервации могат да се правят само до 1 месец напред' });
      }
    }

    if (!time || time === 'Час') {
      errors.push({ field: 'time', message: 'Моля изберете час' });
    }

    // Time validation: not in the past and at least 4 hours from now
    const selectedDateTime = parseDateTimeLocal(date, time);
    if (date && time && selectedDateTime) {
      const now = new Date();
      const minAllowed = new Date(now.getTime() + 4 * 60 * 60 * 1000);

      // disallow past times
      if (selectedDateTime.getTime() < now.getTime()) {
        errors.push({ field: 'time', message: 'Моля изберете бъдещ час' });
      }

      // disallow less than 4 hours from now
      if (selectedDateTime.getTime() < minAllowed.getTime()) {
        const rounded = roundUpToNextHour(minAllowed);
        const dd = String(rounded.getDate()).padStart(2, '0');
        const mm = String(rounded.getMonth() + 1).padStart(2, '0');
        const yyyy = String(rounded.getFullYear());
        const hh = String(rounded.getHours()).padStart(2, '0');
        const min = String(rounded.getMinutes()).padStart(2, '0');
        errors.push({
          field: 'time',
          message: `Резервация може да се направи най-рано след 4 часа (след ${dd}.${mm}.${yyyy} ${hh}:${min})`
        });
      }
    }

    // Require message/details for large groups (> 20)
    if (Number.isFinite(guestsNum) && guestsNum > 20) {
      const msg = String(formData.get('message') || '').trim();
      if (msg.length < 5) {
        errors.push({
          field: 'message',
          message: 'За групи над 20 души, моля напишете кратък коментар (повод, тип събитие, изисквания).'
        });
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const phone = phoneCheck.normalized;

    const dateBg = (() => {
      try {
        return new Date(date).toLocaleDateString('bg-BG', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return date;
      }
    })();

    const safeMessage = escapeHtml(message);
    const safeName = escapeHtml(`${firstName} ${lastName}`);

    const telLink = `${phone}`;

    const telegramText = [
      '🍽️ <b>НОВА РЕЗЕРВАЦИЯ</b>',
      '<i>(моля, потвърдете по телефона)</i>',
      '',
      `<b>👤 Име:</b> ${safeName}`,
      `<b>📞 Телефон:</b> <code>${escapeHtml(phone)}</code>`,
      `<b>👥 Гости:</b> ${escapeHtml(person)}`,
      `<b>📅 Дата:</b> ${escapeHtml(dateBg)}`,
      `<b>🕒 Час:</b> <b>${escapeHtml(time)}</b>`,
      '',
      '<b>📝 Съобщение:</b>',
      safeMessage ? safeMessage : '—',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━',
      '<b>🔒 Информация за сигурност:</b>',
      `<b>🌐 IP адрес:</b> <code>${escapeHtml(clientIp)}</code>`,
      '',
      `<b>⚠️ Статус:</b> <b>НЕПОТВЪРДЕНА</b> (очаква обаждане)`,
      '',
      `📲 За набиране (копирай/тапни): ${escapeHtml(telLink)}`,
      '',
      `<i>⏱️ Изпратено:</i> ${escapeHtml(new Date().toLocaleString('bg-BG', { timeZone: 'Europe/Sofia' }))}`,
    ].join('\n');

    // Reservations are sent to Telegram only (no email).

    // Telegram Bot API rejects tel: URLs in inline_keyboard buttons.
    await sendTelegramReservation({ text: telegramText });

    return NextResponse.json({
      success: true,
      message: 'Заявката за резервация е изпратена. Очаквайте обаждане за потвърждение.',
      data: { phone }
    });

  } catch (error) {
    const detail = typeof error?.message === 'string' ? error.message : '';
    const extraHelp = detail.includes('Telegram send failed')
      ? 'Проверете TELEGRAM_BOT_TOKEN, TELEGRAM_RESERVATIONS_CHAT_ID и дали ботът е admin в канала.'
      : '';

    return NextResponse.json(
      {
        success: false,
        errors: [
          {
            message:
              `Възникна грешка при обработката на резервацията. ${extraHelp}`.trim() ||
              'Възникна грешка при обработката на резервацията. Моля, опитайте отново или се обадете на +359 89 4766273.',
            ...(process.env.NODE_ENV !== 'production' && detail ? { detail } : {})
          }
        ]
      },
      { status: 500 }
    );
  }
}
