import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { buildFeedbackEmail, categoryLabels } from './feedbackEmail';
import { feedbackSchema } from './feedbackValidation';
import type {
  FeedbackErrorResponse,
  FeedbackRouteResponse,
  FeedbackSuccessResponse,
} from './feedbackValidation';

const MAX_FEEDBACK_BODY_BYTES = 16 * 1024;

function validateFeedbackRequest(request: Request): NextResponse<FeedbackErrorResponse> | null {
  const contentLengthHeader = request.headers.get('content-length');
  const contentLength = Number(contentLengthHeader);
  if (!contentLengthHeader || !Number.isFinite(contentLength) || contentLength < 0) {
    return NextResponse.json<FeedbackErrorResponse>(
      {
        success: false,
        errors: [{ message: 'Невалиден размер на заявката.' }],
      },
      { status: 411 },
    );
  }

  if (contentLength > MAX_FEEDBACK_BODY_BYTES) {
    return NextResponse.json<FeedbackErrorResponse>(
      {
        success: false,
        errors: [{ message: 'Формата е твърде голяма. Моля, съкратете съобщението и опитайте отново.' }],
      },
      { status: 413 },
    );
  }

  const contentType = request.headers.get('content-type') || '';
  if (contentType && !contentType.includes('application/json')) {
    return NextResponse.json<FeedbackErrorResponse>(
      {
        success: false,
        errors: [{ message: 'Невалиден формат на заявката.' }],
      },
      { status: 415 },
    );
  }

  return null;
}

export async function POST(request: Request): Promise<NextResponse<FeedbackRouteResponse>> {
  try {
    const requestError = validateFeedbackRequest(request);
    if (requestError) return requestError;

    const body: unknown = await request.json();
    const validation = feedbackSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json<FeedbackErrorResponse>(
        {
          success: false,
          errors: validation.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const { message, rating, category } = validation.data;
    const email = buildFeedbackEmail({
      message,
      rating,
      category,
      ipAddress: request.headers.get('x-forwarded-for') || 'N/A',
      userAgent: request.headers.get('user-agent') || 'N/A',
    });

    console.log(`[feedback] New submission: category=${category ?? 'none'}, rating=${rating ?? 'none'}`);

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured. Cannot send email.');
      return NextResponse.json<FeedbackErrorResponse>(
        {
          success: false,
          errors: [
            {
              message:
                'Системата за обратна връзка не е конфигурирана. Моля, свържете се с нас директно.',
            },
          ],
        },
        { status: 503 },
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
        text: email.text,
        html: email.html,
      });
    } catch (emailError: unknown) {
      console.error('Email sending failed:', emailError);
      return NextResponse.json<FeedbackErrorResponse>(
        {
          success: false,
          errors: [{ message: 'Грешка при изпращане на обратната връзка. Моля, опитайте отново.' }],
        },
        { status: 500 },
      );
    }

    return NextResponse.json<FeedbackSuccessResponse>({
      success: true,
      message: 'Благодарим за вашата обратна връзка! Вашето мнение е важно за нас.',
    });
  } catch (error: unknown) {
    console.error('Feedback submission error:', error);
    return NextResponse.json<FeedbackErrorResponse>(
      {
        success: false,
        errors: [{ message: 'Възникна грешка при обработката на формата. Моля, опитайте отново.' }],
      },
      { status: 500 },
    );
  }
}
