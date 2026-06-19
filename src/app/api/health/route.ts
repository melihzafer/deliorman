import { NextResponse } from 'next/server';

interface HealthCheck {
  status: 'ok' | 'missing';
}

interface HealthResponse {
  status: 'healthy' | 'degraded';
  timestamp: string;
  checks: {
    resend_api_key: HealthCheck;
    telegram_bot_token: HealthCheck;
    telegram_chat_id: HealthCheck;
    mapbox_token: HealthCheck;
  };
  version: string;
}

export function GET(): NextResponse<HealthResponse> {
  const checks = {
    resend_api_key: { status: (process.env.RESEND_API_KEY ? 'ok' : 'missing') as HealthCheck['status'] },
    telegram_bot_token: { status: (process.env.TELEGRAM_BOT_TOKEN ? 'ok' : 'missing') as HealthCheck['status'] },
    telegram_chat_id: { status: (process.env.TELEGRAM_RESERVATIONS_CHAT_ID ? 'ok' : 'missing') as HealthCheck['status'] },
    mapbox_token: { status: (process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? 'ok' : 'missing') as HealthCheck['status'] },
  };

  const allHealthy = Object.values(checks).every(c => c.status === 'ok');

  return NextResponse.json(
    {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
      version: process.env.npm_package_version || '1.0.0',
    },
    { status: allHealthy ? 200 : 503 }
  );
}
