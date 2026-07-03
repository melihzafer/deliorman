import { NextResponse } from 'next/server';
import { getClientIp } from '@library/clientIp';
import { buildTelegramReservationMessage, sendTelegramReservation } from './reservationTelegram';
import { validateReservationForm } from './reservationValidation';
import type {
  ReservationErrorResponse,
  ReservationMethodNotAllowedResponse,
  ReservationRouteResponse,
  ReservationSuccessResponse,
} from './reservationValidation';

export const runtime = 'nodejs';
const MAX_RESERVATION_BODY_BYTES = 16 * 1024;

function validateReservationRequest(request: Request): NextResponse<ReservationErrorResponse> | null {
  const contentLengthHeader = request.headers.get('content-length');
  const contentLength = Number(contentLengthHeader);
  if (!contentLengthHeader || !Number.isFinite(contentLength) || contentLength < 0) {
    return NextResponse.json<ReservationErrorResponse>(
      {
        success: false,
        errors: [{ message: 'Невалиден размер на заявката.' }],
      },
      { status: 411 },
    );
  }

  if (contentLength > MAX_RESERVATION_BODY_BYTES) {
    return NextResponse.json<ReservationErrorResponse>(
      {
        success: false,
        errors: [{ message: 'Формата е твърде голяма. Моля, съкратете съобщението и опитайте отново.' }],
      },
      { status: 413 },
    );
  }

  const contentType = request.headers.get('content-type') || '';
  if (
    contentType &&
    !contentType.includes('multipart/form-data') &&
    !contentType.includes('application/x-www-form-urlencoded')
  ) {
    return NextResponse.json<ReservationErrorResponse>(
      {
        success: false,
        errors: [{ message: 'Невалиден формат на заявката.' }],
      },
      { status: 415 },
    );
  }

  return null;
}

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
    const requestError = validateReservationRequest(request);
    if (requestError) return requestError;

    const ipInfo = getClientIp(request);
    const formData = await request.formData();

    const hp = formData.get('company');
    if (hp && String(hp).trim() !== '') {
      return NextResponse.json({ success: true });
    }

    const validation = validateReservationForm(formData);
    if (!validation.success) {
      return NextResponse.json<ReservationErrorResponse>(
        { success: false, errors: validation.errors },
        { status: 400 },
      );
    }

    const telegramText = buildTelegramReservationMessage({
      reservation: validation.data,
      clientIp: ipInfo.ip,
    });

    await sendTelegramReservation({ text: telegramText });

    return NextResponse.json<ReservationSuccessResponse>({
      success: true,
      message: 'Заявката за резервация е изпратена. Очаквайте обаждане за потвърждение.',
      data: { phone: validation.data.phone },
    });
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : '';
    console.error('Reservation submission error:', error);

    return NextResponse.json<ReservationErrorResponse>(
      {
        success: false,
        errors: [
          {
            message:
              'Възникна грешка при обработката на резервацията. Моля, опитайте отново или се обадете на +359 89 4766273.',
            ...(process.env.NODE_ENV !== 'production' && detail ? { detail } : {}),
          },
        ],
      },
      { status: 500 },
    );
  }
}
