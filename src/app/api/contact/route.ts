import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getClientIp } from '@library/clientIp';
import { escapeHtml } from '@library/htmlUtils';

export const runtime = 'nodejs';

type ContactField = 'first_name' | 'last_name' | 'email' | 'phone' | 'message' | 'privacy_consent';

interface ContactError {
  field?: ContactField;
  message: string;
}

interface ContactErrorResponse {
  success: false;
  errors: ContactError[];
}

interface ContactSuccessResponse {
  success: true;
  message: string;
}

type ContactRouteResponse = ContactSuccessResponse | ContactErrorResponse;

// Contact submissions are small; anything bigger is abuse.
const MAX_BODY_BYTES = 50_000;

export async function POST(request: Request): Promise<NextResponse<ContactRouteResponse>> {
  try {
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json<ContactErrorResponse>(
        { success: false, errors: [{ message: 'Заявката е твърде голяма.' }] },
        { status: 413 },
      );
    }

    // Capture client IP for security/audit purposes
    const ipInfo = getClientIp(request);
    const clientIp = ipInfo.ip;

    const formData = await request.formData();

    // Honeypot (bots tend to fill it). Field is optional and hidden in UI.
    const hp = formData.get('company');
    if (hp && String(hp).trim() !== '') {
      return NextResponse.json<ContactSuccessResponse>({
        success: true,
        message: 'Благодарим за вашето съобщение! Ще се свържем с вас скоро.',
      });
    }

    // Extract form data
    const firstName = formData.get('first_name') as string | null;
    const lastName = formData.get('last_name') as string | null;
    const email = formData.get('email') as string | null;
    const phone = formData.get('phone') as string | null;
    const message = formData.get('message') as string | null;
    const privacyConsentRaw = formData.get('privacy_consent') as string | null;

    // Validation
    const errors: ContactError[] = [];

    const privacyConsent = (() => {
      const v = String(privacyConsentRaw ?? '').trim().toLowerCase();
      return v === 'true' || v === '1' || v === 'on' || v === 'yes';
    })();

    if (!privacyConsent) {
      errors.push({
        field: 'privacy_consent',
        message: 'Моля, потвърдете, че сте се запознали с правилата и условията и информацията за лични данни.',
      });
    }

    if (!firstName || firstName.trim().length < 2) {
      errors.push({ field: 'first_name', message: 'Името трябва да е поне 2 символа' });
    }

    if (!lastName || lastName.trim().length < 2) {
      errors.push({ field: 'last_name', message: 'Фамилията трябва да е поне 2 символа' });
    }

    if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.push({ field: 'email', message: 'Невалиден имейл адрес' });
    }

    if (!phone || phone.trim().length < 9) {
      errors.push({ field: 'phone', message: 'Невалиден телефонен номер' });
    }

    if (!message || message.trim().length < 10) {
      errors.push({ field: 'message', message: 'Съобщението трябва да е поне 10 символа' });
    }

    if (errors.length > 0) {
      return NextResponse.json<ContactErrorResponse>(
        { success: false, errors },
        { status: 400 },
      );
    }

    const validatedFirstName = firstName as string;
    const validatedLastName = lastName as string;
    const validatedEmail = email as string;
    const validatedPhone = phone as string;
    const validatedMessage = message as string;

    // Prepare email content with Client IP
    const emailContent = `
═══════════════════════════════════════
📧 НОВО КОНТАКТНО СЪОБЩЕНИЕ
═══════════════════════════════════════

👤 ИМЕ: ${validatedFirstName} ${validatedLastName}
📧 ИМЕЙЛ: ${validatedEmail}
📞 ТЕЛЕФОН: ${validatedPhone}

💬 СЪОБЩЕНИЕ:
${validatedMessage}

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
      `<b>👤 Име:</b> ${escapeHtml(`${validatedFirstName} ${validatedLastName}`)}`,
      `<b>📧 Имейл:</b> <code>${escapeHtml(validatedEmail)}</code>`,
      `<b>📞 Телефон:</b> <code>${escapeHtml(validatedPhone)}</code>`,
      '',
      '<b>💬 Съобщение:</b>',
      escapeHtml(validatedMessage),
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━',
      '<b>🔒 Информация за сигурност:</b>',
      `<b>🌐 IP адрес:</b> <code>${escapeHtml(clientIp)}</code>`,
      `<i>⏱️ Изпратено:</i> ${escapeHtml(new Date().toLocaleString('bg-BG', { timeZone: 'Europe/Sofia' }))}`,
    ].join('\n');

    // Send email via Resend
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured. Cannot send contact email.');
      return NextResponse.json<ContactErrorResponse>(
        { success: false, errors: [{ message: 'Формата за контакт не е конфигурирана. Моля, обадете се на +359 89 476 6273 (резервации) / +359 89 608 8804 (поръчки).' }] },
        { status: 503 },
      );
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Deliorman Contact <onboarding@resend.dev>',
      to: 'restaurantdeliorman@gmail.com',
      subject: `Ново съобщение от ${validatedFirstName} ${validatedLastName}`,
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

    return NextResponse.json<ContactSuccessResponse>({
      success: true,
      message: 'Благодарим за вашето съобщение! Ще се свържем с вас скоро.',
    });
  } catch (error: unknown) {
    return NextResponse.json<ContactErrorResponse>(
      {
        success: false,
        errors: [{ message: 'Възникна грешка при обработката на формата. Моля, опитайте отново.' }],
      },
      { status: 500 },
    );
  }
}
