import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getClientIp } from '@library/client-ip';
import { checkRateLimit, envLimit } from '@library/rate-limit';
import { getLocalizedMenuData } from '@data/getLocalizedMenuData';

export const runtime = 'nodejs';
// Streaming model responses can outlive the default function duration.
export const maxDuration = 60;

const MODEL = process.env.AI_MODEL || 'claude-opus-4-8';
const MAX_BODY_BYTES = 50_000;
const MAX_MESSAGE_CHARS = 500;
const MAX_HISTORY_MESSAGES = 12;
const MAX_HISTORY_CHARS = 2000;

const SUPPORTED_LOCALES = ['bg', 'en', 'tr'] as const;

const requestSchema = z.object({
  message: z.string().trim().min(1).max(MAX_MESSAGE_CHARS),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().trim().min(1).max(MAX_HISTORY_CHARS),
      }),
    )
    .max(MAX_HISTORY_MESSAGES)
    .optional()
    .default([]),
  locale: z.enum(SUPPORTED_LOCALES).optional().default('bg'),
  table: z.number().int().min(1).max(500).optional().nullable(),
});

const LANGUAGE_NAMES: Record<(typeof SUPPORTED_LOCALES)[number], string> = {
  bg: 'Bulgarian',
  en: 'English',
  tr: 'Turkish',
};

interface MenuItem {
  title: string;
  amount?: string;
  price?: number;
  text?: string;
}

interface MenuCategory {
  name: string;
  subtitle?: string;
  description?: string;
  items: MenuItem[];
}

/**
 * Render the menu as compact plain text — far fewer tokens than raw JSON,
 * and a byte-stable string per locale so the prompt prefix stays cacheable.
 */
function renderMenuForPrompt(locale: string): string {
  const menu = getLocalizedMenuData(locale) as { categories: MenuCategory[] };
  const lines: string[] = [];

  for (const category of menu.categories) {
    lines.push(`## ${category.name}`);
    for (const item of category.items) {
      const details = [item.amount, item.text].filter(Boolean).join('; ');
      const price = typeof item.price === 'number' ? `${item.price.toFixed(2)} лв` : '';
      lines.push(`- ${item.title}${details ? ` (${details})` : ''}${price ? ` — ${price}` : ''}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function buildSystemPrompt(locale: (typeof SUPPORTED_LOCALES)[number]): string {
  return [
    'You are "Дели" (Deli), the friendly digital waiter of restaurant "Делиорман" (Deliorman) in Bulgaria.',
    'Guests scan a QR code at their table and chat with you while browsing the digital menu.',
    '',
    'RESTAURANT FACTS:',
    '- Name: Ресторант Делиорман (Restaurant Deliorman)',
    '- Cuisine: traditional Bulgarian and Deliorman-region dishes, grilled specialties, salads, homemade desserts.',
    '- Phone for reservations and questions: +359 89 4766273.',
    '- Reservations can also be made online on the /reservation page.',
    '- All prices are in Bulgarian leva (лв).',
    '',
    'FULL MENU:',
    renderMenuForPrompt(locale),
    'YOUR JOB:',
    '- Help guests choose dishes and drinks: recommend combinations, explain dishes, compare options, total up rough costs.',
    '- Answer ONLY questions related to the restaurant, its menu, dietary needs, and visiting (hours, reservations, location). For anything else, politely steer the conversation back to the menu.',
    '- If asked about allergens or ingredients not listed in the menu data, say you are not certain and recommend confirming with the staff.',
    '- Never invent dishes, prices, or promotions that are not in the menu above.',
    '- Keep answers short and warm: 1-4 sentences, or a short list of up to 5 items when recommending. No headings, no tables.',
    `- Reply in ${LANGUAGE_NAMES[locale]} unless the guest clearly writes in another language — then mirror their language.`,
    '- Respond only with your final answer. Do not include exploratory reasoning or meta-commentary about your process.',
  ].join('\n');
}

function errorJson(status: number, code: string, message: string): NextResponse {
  return NextResponse.json({ success: false, code, message }, { status });
}

export function GET(): NextResponse {
  return NextResponse.json(
    { success: false, error: 'Method Not Allowed. Use POST.' },
    { status: 405, headers: { Allow: 'POST' } },
  );
}

export async function POST(request: Request): Promise<Response> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return errorJson(503, 'not_configured', 'AI assistant is not configured.');
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return errorJson(413, 'too_large', 'Request body too large.');
  }

  const { ip: clientIp } = getClientIp(request);
  const rate = checkRateLimit(`ai:${clientIp}`, {
    windowSeconds: envLimit('AI_RATE_WINDOW_SECONDS', 600),
    max: envLimit('AI_RATE_MAX', 20),
  });
  if (rate.limited) {
    return NextResponse.json(
      { success: false, code: 'rate_limited', message: 'Too many requests.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rate.retryAfterSeconds),
          'X-RateLimit-Remaining': '0',
        },
      },
    );
  }

  let parsed: z.infer<typeof requestSchema>;
  try {
    const body: unknown = await request.json();
    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      return errorJson(400, 'invalid_request', 'Invalid request payload.');
    }
    parsed = validation.data;
  } catch {
    return errorJson(400, 'invalid_request', 'Invalid JSON body.');
  }

  const { message, history, locale, table } = parsed;

  const client = new Anthropic();

  const messages: Anthropic.MessageParam[] = [
    ...history.map((entry) => ({ role: entry.role, content: entry.content })),
    {
      role: 'user' as const,
      content: table ? `[Guest is seated at table ${table}]\n${message}` : message,
    },
  ];

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: envLimit('AI_MAX_TOKENS', 1024),
    system: [
      {
        type: 'text',
        text: buildSystemPrompt(locale),
        // The menu prompt is identical for every guest per locale — cache it.
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (error) {
        if (error instanceof Anthropic.APIError) {
          console.error(`[ai] stream error ${error.status}: ${error.message}`);
        } else {
          console.error('[ai] stream error:', error);
        }
        controller.enqueue(encoder.encode('\n[error]'));
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-RateLimit-Remaining': String(rate.remaining),
    },
  });
}
