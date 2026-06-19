import { escapeHtml } from '@library/htmlUtils';
import type { ValidReservation } from './reservationValidation';

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

interface BuildTelegramReservationMessageParams {
  reservation: ValidReservation;
  clientIp: string;
}

export async function sendTelegramReservation({
  text,
  replyMarkup,
}: TelegramSendParams): Promise<TelegramApiResponse | { ok: true; skipped: true }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_RESERVATIONS_CHAT_ID;
  const isTelegramDisabled = String(process.env.TELEGRAM_DISABLE || '').toLowerCase() === 'true';

  if (isTelegramDisabled) {
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
    throw new Error(`Telegram send failed: ${desc}`);
  }

  return payload;
}

export function buildTelegramReservationMessage({
  reservation,
  clientIp,
}: BuildTelegramReservationMessageParams): string {
  const safeMessage = escapeHtml(reservation.message);
  const safeName = escapeHtml(`${reservation.firstName} ${reservation.lastName}`);
  const telLink = `${reservation.phone}`;

  return [
    '🍽️ <b>НОВА РЕЗЕРВАЦИЯ</b>',
    '<i>(моля, потвърдете по телефона)</i>',
    '',
    `<b>👤 Име:</b> ${safeName}`,
    `<b>📞 Телефон:</b> <code>${escapeHtml(reservation.phone)}</code>`,
    `<b>👥 Гости:</b> ${escapeHtml(reservation.person)}`,
    `<b>📅 Дата:</b> ${escapeHtml(reservation.dateBg)}`,
    `<b>🕒 Час:</b> <b>${escapeHtml(reservation.time)}</b>`,
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
}
