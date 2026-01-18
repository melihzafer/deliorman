import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const feedbackSchema = z.object({
  message: z
    .string({
      required_error: 'Моля, въведете съобщение',
      invalid_type_error: 'Моля, въведете съобщение',
    })
    .trim()
    .min(10, 'Съобщението трябва да съдържа поне 10 символа')
    .max(1000, 'Съобщението не може да надвишава 1000 символа'),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  category: z.enum(['service', 'food', 'vibes', 'other']).optional().nullable(),
  termsAccepted: z
    .boolean({
      required_error: 'Моля, приемете условията за ползване',
      invalid_type_error: 'Невалидна стойност за условията',
    })
    .refine((val) => val === true, {
      message: 'Моля, приемете условията за ползване преди изпращане',
    }),
});

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate the request body
    const validation = feedbackSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { message, rating, category } = validation.data;

    // Prepare email content
    const categoryLabels = {
      service: 'Обслужване',
      food: 'Храна',
      vibes: 'Атмосфера',
      other: 'Друго',
    };

    const ratingStars = rating ? '⭐'.repeat(rating) : 'Без оценка';
    const categoryLabel = category ? categoryLabels[category] : 'Не е посочена';
    const timestamp = new Date().toLocaleString('bg-BG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Plain text version
    const emailContent = `
Нова анонимна обратна връзка за Ресторант Делиорман

Категория: ${categoryLabel}
Оценка: ${ratingStars}${rating ? ` (${rating}/5)` : ''}

Съобщение:
${message}

---
Получено: ${timestamp}
IP адрес: ${request.headers.get('x-forwarded-for') || 'N/A'}
User Agent: ${request.headers.get('user-agent') || 'N/A'}
    `.trim();

    // HTML version with beautiful styling
    const emailHtml = `
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

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #F39C12 0%, #E67E22 100%); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                💬 Нова обратна връзка
              </h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                Ресторант Делиорман
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">

              <!-- Category & Rating -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td width="50%" style="padding-right: 10px;">
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 16px; text-align: center;">
                      <p style="margin: 0 0 8px 0; font-size: 12px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                        Категория
                      </p>
                      <p style="margin: 0; font-size: 18px; color: #1a2f33; font-weight: 600;">
                        ${categoryLabel}
                      </p>
                    </div>
                  </td>
                  <td width="50%" style="padding-left: 10px;">
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 16px; text-align: center;">
                      <p style="margin: 0 0 8px 0; font-size: 12px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                        Оценка
                      </p>
                      <p style="margin: 0; font-size: 18px; color: #1a2f33; font-weight: 600;">
                        ${ratingStars}${rating ? ` (${rating}/5)` : ''}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <div style="background-color: #f8f9fa; border-left: 4px solid #F39C12; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                <p style="margin: 0 0 12px 0; font-size: 12px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                  Съобщение
                </p>
                <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #1a2f33; white-space: pre-wrap;">
${message}
                </p>
              </div>

              <!-- Metadata -->
              <div style="border-top: 1px solid #e9ecef; padding-top: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0;">
                      <p style="margin: 0; font-size: 13px; color: #6c757d;">
                        <strong style="color: #495057;">Получено:</strong> ${timestamp}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <p style="margin: 0; font-size: 13px; color: #6c757d;">
                        <strong style="color: #495057;">IP адрес:</strong> ${request.headers.get('x-forwarded-for') || 'N/A'}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <p style="margin: 0; font-size: 11px; color: #adb5bd; word-break: break-all;">
                        <strong style="color: #6c757d;">User Agent:</strong> ${request.headers.get('user-agent') || 'N/A'}
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 40px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; font-size: 12px; color: #6c757d;">
                Автоматично генерирано съобщение от системата за обратна връзка
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    // Log to console
    console.log('=== NEW FEEDBACK SUBMISSION ===');
    console.log(emailContent);
    console.log('===============================');

    // Send email using Resend
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured. Cannot send email.');
      return NextResponse.json(
        {
          success: false,
          errors: [{ message: 'Системата за обратна връзка не е конфигурирана. Моля, свържете се с нас директно.' }],
        },
        { status: 503 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const recipientEmail = process.env.FEEDBACK_EMAIL || 'restaurantdeliorman@gmail.com';
    const senderEmail = process.env.FEEDBACK_SENDER_EMAIL || 'Deliorman Feedback <onboarding@resend.dev>';

    try {
      await resend.emails.send({
        from: senderEmail,
        to: recipientEmail,
        subject: `Нова обратна връзка${category ? ` - ${categoryLabels[category]}` : ''}${rating ? ` (${rating}⭐)` : ''}`,
        text: emailContent,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return NextResponse.json(
        {
          success: false,
          errors: [{ message: 'Грешка при изпращане на обратната връзка. Моля, опитайте отново.' }],
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Благодарим за вашата обратна връзка! Вашето мнение е важно за нас.',
    });

  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      {
        success: false,
        errors: [{ message: 'Възникна грешка при обработката на формата. Моля, опитайте отново.' }],
      },
      { status: 500 }
    );
  }
}
