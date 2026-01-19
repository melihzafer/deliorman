import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getClientIp } from '@library/client-ip';

export const runtime = 'nodejs';

/**
 * Escape HTML special characters in a string
 * @param {string} text - The input string
 * @returns {string} - The escaped string
 */
function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function POST(request) {
  try {
    // Capture client IP for security/audit purposes
    const ipInfo = getClientIp(request);
    const clientIp = ipInfo.ip;

    const formData = await request.formData();

    // Extract form data
    const firstName = formData.get('first_name');
    const lastName = formData.get('last_name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const message = formData.get('message');
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

    if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}/i.test(email)) {
      errors.push({ field: 'email', message: 'Невалиден имейл адрес' });
    }

    if (!phone || phone.trim().length < 9) {
      errors.push({ field: 'phone', message: 'Невалиден телефонен номер' });
    }

    if (!message || message.trim().length < 10) {
      errors.push({ field: 'message', message: 'Съобщението трябва да е поне 10 символа' });
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Prepare email content with Client IP
    const emailContent = `
═══════════════════════════════════════
📧 НОВО КОНТАКТНО СЪОБЩЕНИЕ
═══════════════════════════════════════

👤 ИМЕ: ${firstName} ${lastName}
📧 ИМЕЙЛ: ${email}
📞 ТЕЛЕФОН: ${phone}

💬 СЪОБЩЕНИЕ:
${message}

═══════════════════════════════════════
🔒 ИНФОРМАЦИЯ ЗА СИГУРНОСТ
═══════════════════════════════════════
🌐 IP адрес: ${clientIp}
⏱️  Изпратено: ${new Date().toLocaleString('bg-BG', { timeZone: 'Europe/Sofia' })}
═══════════════════════════════════════
    `.trim();

    // Prepare Telegram message with IP
    const telegramText = [
      '📧 <b>НОВО КОНТАКТНО СЪОБЩЕНИЕ</b>',
      '',
      `<b>👤 Име:</b> ${escapeHtml(`${firstName} ${lastName}`)}`,
      `<b>📧 Имейл:</b> <code>${escapeHtml(email)}</code>`,
      `<b>📞 Телефон:</b> <code>${escapeHtml(phone)}</code>`,
      '',
      '<b>💬 Съобщение:</b>',
      escapeHtml(message),
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━',
      '<b>🔒 Информация за сигурност:</b>',
      `<b>🌐 IP адрес:</b> <code>${escapeHtml(clientIp)}</code>`,
      `<i>⏱️ Изпратено:</i> ${escapeHtml(new Date().toLocaleString('bg-BG', { timeZone: 'Europe/Sofia' }))}</i>`,
    ].join('\n');

    // Send email via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Deliorman Contact <onboarding@resend.dev>',
      to: 'restaurantdeliorman@gmail.com',
      subject: `Ново съобщение от ${firstName} ${lastName}`,
      text: emailContent,
    });

    // Send to Telegram
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_RESERVATIONS_CHAT_ID;
    const isTelegramDisabled = String(process.env.TELEGRAM_DISABLE || '').toLowerCase() === 'true';

    if (!isTelegramDisabled && token && chatId) {
      // fire-and-forget; ignore any Telegram errors
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramText,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }).catch(() => undefined);
    }

    return NextResponse.json({
      success: true,
      message: 'Благодарим за вашето съобщение! Ще се свържем с вас скоро.'
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        errors: [{ message: 'Възникна грешка при обработката на формата. Моля, опитайте отново.' }]
      },
      { status: 500 }
    );
  }
}
