import { escapeHtml } from '@library/htmlUtils';
import type { FeedbackCategory, FeedbackPayload } from './feedbackValidation';

interface BuildFeedbackEmailParams {
  message: FeedbackPayload['message'];
  rating: FeedbackPayload['rating'];
  category: FeedbackPayload['category'];
  ipAddress: string;
  userAgent: string;
}

interface FeedbackEmailContent {
  text: string;
  html: string;
}

export const categoryLabels: Record<FeedbackCategory, string> = {
  service: 'Обслужване',
  food: 'Храна',
  vibes: 'Атмосфера',
  other: 'Друго',
};

export function buildFeedbackEmail({
  message,
  rating,
  category,
  ipAddress,
  userAgent,
}: BuildFeedbackEmailParams): FeedbackEmailContent {
  const ratingStars = rating ? '⭐'.repeat(rating) : 'Без оценка';
  const categoryLabel = category ? categoryLabels[category] : 'Не е посочена';
  const safeMessage = escapeHtml(message);
  const safeIpAddress = escapeHtml(ipAddress);
  const safeUserAgent = escapeHtml(userAgent);
  const timestamp = new Date().toLocaleString('bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    text: `
Нова анонимна обратна връзка за Ресторант Делиорман

Категория: ${categoryLabel}
Оценка: ${ratingStars}${rating ? ` (${rating}/5)` : ''}

Съобщение:
${message}

---
Получено: ${timestamp}
IP адрес: ${ipAddress}
User Agent: ${userAgent}
    `.trim(),
    html: `
<!DOCTYPE html>
<html lang="bg">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #F39C12 0%, #E67E22 100%); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">💬 Нова обратна връзка</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Ресторант Делиорман</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td width="50%" style="padding-right: 10px;">
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 16px; text-align: center;">
                      <p style="margin: 0 0 8px 0; font-size: 12px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Категория</p>
                      <p style="margin: 0; font-size: 18px; color: #1a2f33; font-weight: 600;">${categoryLabel}</p>
                    </div>
                  </td>
                  <td width="50%" style="padding-left: 10px;">
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 16px; text-align: center;">
                      <p style="margin: 0 0 8px 0; font-size: 12px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Оценка</p>
                      <p style="margin: 0; font-size: 18px; color: #1a2f33; font-weight: 600;">${ratingStars}${rating ? ` (${rating}/5)` : ''}</p>
                    </div>
                  </td>
                </tr>
              </table>
              <div style="background-color: #f8f9fa; border-left: 4px solid #F39C12; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                <p style="margin: 0 0 12px 0; font-size: 12px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Съобщение</p>
                <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #1a2f33; white-space: pre-wrap;">${safeMessage}</p>
              </div>
              <div style="border-top: 1px solid #e9ecef; padding-top: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0;">
                      <p style="margin: 0; font-size: 13px; color: #6c757d;"><strong style="color: #495057;">Получено:</strong> ${timestamp}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <p style="margin: 0; font-size: 13px; color: #6c757d;"><strong style="color: #495057;">IP адрес:</strong> ${safeIpAddress}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <p style="margin: 0; font-size: 11px; color: #adb5bd; word-break: break-all;"><strong style="color: #6c757d;">User Agent:</strong> ${safeUserAgent}</p>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 40px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; font-size: 12px; color: #6c757d;">Автоматично генерирано съобщение от системата за обратна връзка</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  };
}
