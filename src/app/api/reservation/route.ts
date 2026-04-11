import { NextResponse } from 'next/server';
import { getClientIp } from '@library/clientIp';
import { validateBgPhone } from '@library/bgPhoneUtils';
import { escapeHtml } from '@library/htmlUtils';

export const runtime = 'nodejs';

type ReservationField = 'first_name' | 'last_name' | 'phone' | 'person' | 'date' | 'time' | 'message' | 'privacy_consent';

interface ReservationError {
  field?: ReservationField;
  message: string;
  detail?: string;
}

interface ReservationErrorResponse {
  success: false;
  errors: ReservationError[];
}

interface ReservationMethodNotAllowedResponse {
  success: false;
  error: string;
}

interface ReservationSuccessResponse {
  success: true;
  message?: string;
  data?: {
    phone: string;
  };
}

type ReservationRouteResponse =
  | ReservationSuccessResponse
  | ReservationErrorResponse
  | ReservationMethodNotAllowedResponse;

interface TelegramReplyMarkup {
  [key: string]: unknown;
}

interface TelegramSendParams {
  text: string;
  replyMarkup?: TelegramReplyMarkup;
}

interface TelegramApiResponse {
  ok?: boolean;
  description?: string;
}

/**
 * Send reservation details to Telegram via bot
 */
async function sendTelegramReservation({ text, replyMarkup }: TelegramSendParams): Promise<TelegramApiResponse | { ok: true; skipped: true }> {
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

  const payload = (await res.json().catch(() => null)) as TelegramApiResponse | null;
  if (!res.ok || !payload?.ok) {
    const desc = payload?.description || `Telegram API error (${res.status})`;
    // Don't leak token/chat id; provide actionable message
    throw new Error(`Telegram send failed: ${desc}`);
  }

  return payload;
}

/**
 * Parse date and time from separate strings to JavaScript Date object
 */
function parseDateTimeLocal(dateStr: string | null, timeStr: string | null): Date | null {
  // dateStr: YYYY-MM-DD, timeStr: HH:mm
  if (!dateStr || !timeStr) return null;
  const [y, m, d] = String(dateStr).split('-').map(Number);
  const [hh, mm] = String(timeStr).split(':').map(Number);
  if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

/**
 * Round up a date to the next hour
 */
function roundUpToNextHour(date: Date): Date {
  const d = new Date(date);
  d.setMinutes(0, 0, 0);
  if (date.getMinutes() !== 0 || date.getSeconds() !== 0 || date.getMilliseconds() !== 0) {
    d.setHours(d.getHours() + 1);
  }
  return d;
}

// NOTE: Blacklist / IP audit / KV storage removed per request.
// Rate limiting is handled by middleware — no duplicate in-process limiter needed.

export function GET(): NextResponse<ReservationMethodNotAllowedResponse> {
  return NextResponse.json<ReservationMethodNotAllowedResponse>(
    {
      success: false,
      error: 'Method Not Allowed. Use POST to submit a reservation.',
    },
    {
      status: 405,
      headers: {
        Allow: 'POST, OPTIONS',
      },
    },
  );
}

export function HEAD(): NextResponse {
  return new NextResponse(null, {
    status: 405,
    headers: {
      Allow: 'POST, OPTIONS',
    },
  });
}

export function OPTIONS(): NextResponse {
  // Helps with CORS preflight (even though same-origin usually doesn't need it).
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: 'POST, OPTIONS',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: Request): Promise<NextResponse<ReservationRouteResponse>> {
  try {
    // Capture client IP for security/audit purposes
    const ipInfo = getClientIp(request);
    const clientIp = ipInfo.ip;

    const formData = await request.formData();

    // Honeypot (bots tend to fill it). Field is optional and hidden in UI.
    const hp = formData.get('company');
    if (hp && String(hp).trim() !== '') {
      return NextResponse.json({ success: true });
    }

    // Extract form data
    const firstName = formData.get('first_name') as string | null;
    const lastName = formData.get('last_name') as string | null;
    const phoneRaw = formData.get('phone') as string | null;
    const person = formData.get('person') as string | null;
    const date = formData.get('date') as string | null;
    const time = formData.get('time') as string | null;
    const message = (formData.get('message') as string | null) || 'Няма допълнително съобщение';
    const privacyConsentRaw = formData.get('privacy_consent') as string | null;

    // Validation
    const errors: ReservationError[] = [];

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
      return NextResponse.json<ReservationErrorResponse>({ success: false, errors }, { status: 400 });
    }

    const validatedFirstName = firstName as string;
    const validatedLastName = lastName as string;
    const validatedPerson = person as string;
    const validatedDate = date as string;
    const validatedTime = time as string;
    const phone = phoneCheck.normalized;

    const dateBg = (() => {
      try {
        return new Date(validatedDate).toLocaleDateString('bg-BG', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return validatedDate;
      }
    })();

    const safeMessage = escapeHtml(message);
    const safeName = escapeHtml(`${validatedFirstName} ${validatedLastName}`);

    const telLink = `${phone}`;

    const telegramText = [
      '🍽️ <b>НОВА РЕЗЕРВАЦИЯ</b>',
      '<i>(моля, потвърдете по телефона)</i>',
      '',
      `<b>👤 Име:</b> ${safeName}`,
      `<b>📞 Телефон:</b> <code>${escapeHtml(phone)}</code>`,
      `<b>👥 Гости:</b> ${escapeHtml(validatedPerson)}`,
      `<b>📅 Дата:</b> ${escapeHtml(dateBg)}`,
      `<b>🕒 Час:</b> <b>${escapeHtml(validatedTime)}</b>`,
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

    return NextResponse.json<ReservationSuccessResponse>({
      success: true,
      message: 'Заявката за резервация е изпратена. Очаквайте обаждане за потвърждение.',
      data: { phone },
    });

  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : '';
    const extraHelp = detail.includes('Telegram send failed')
      ? 'Проверете TELEGRAM_BOT_TOKEN, TELEGRAM_RESERVATIONS_CHAT_ID и дали ботът е admin в канала.'
      : '';

    return NextResponse.json<ReservationErrorResponse>(
      {
        success: false,
        errors: [
          {
            message:
              `Възникна грешка при обработката на резервацията. ${extraHelp}`.trim() ||
              'Възникна грешка при обработката на резервацията. Моля, опитайте отново или се обадете на +359 89 4766273.',
            ...(process.env.NODE_ENV !== 'production' && detail ? { detail } : {})
          },
        ],
      },
      { status: 500 },
    );
  }
}
