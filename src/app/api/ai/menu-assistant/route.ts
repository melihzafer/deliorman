import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getClientIp } from '@library/clientIp';
import { checkRateLimit, envLimit } from '@library/rate-limit';
import { getLocalizedMenuData } from '@data/getLocalizedMenuData';

export const runtime = 'nodejs';
// Streaming model responses can outlive the default function duration.
export const maxDuration = 60;

/**
 * Providers, cheapest first:
 * - groq (default): llama-3.1-8b-instant on Groq's free tier
 *   (OpenAI-compatible API, 14,400 req/day at no cost).
 * - anthropic (optional upgrade): Claude via the official SDK, enabled by
 *   setting AI_PROVIDER=anthropic + ANTHROPIC_API_KEY.
 */
const GROQ_BASE_URL = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';
const GROQ_MODEL = process.env.AI_MODEL || 'llama-3.1-8b-instant';
const ANTHROPIC_MODEL = process.env.AI_MODEL || 'claude-opus-4-8';

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

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
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
    '- Phone for reservations: +359 89 476 62273.',
    '- Phone for orders: +359 89 608 8804.',
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

function getProvider(): 'groq' | 'anthropic' | null {
  const requested = (process.env.AI_PROVIDER || '').toLowerCase();
  if (requested === 'anthropic' && process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (requested === 'groq' && process.env.GROQ_API_KEY) return 'groq';
  if (requested) return null;
  // No explicit provider: prefer the free tier, fall back to Anthropic.
  if (process.env.GROQ_API_KEY) return 'groq';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  return null;
}

/**
 * Stream text deltas from Groq's OpenAI-compatible chat completions API.
 */
async function streamGroq(
  system: string,
  messages: ChatMessage[],
  maxTokens: number,
): Promise<ReadableStream<Uint8Array>> {
  const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      stream: true,
      max_tokens: maxTokens,
      temperature: 0.4,
      messages: [{ role: 'system', content: system }, ...messages],
    }),
  });

  if (!response.ok || !response.body) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Groq API error ${response.status}: ${detail.slice(0, 300)}`);
  }

  const upstream = response.body;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.getReader();
      let buffer = '';
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // OpenAI-compatible SSE: lines of `data: {...}` ending with `data: [DONE]`.
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === '[DONE]') continue;
            try {
              const parsed = JSON.parse(payload) as {
                choices?: { delta?: { content?: string } }[];
              };
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // Ignore malformed keep-alive/partial lines.
            }
          }
        }
      } catch (error) {
        console.error('[ai] groq stream error:', error);
        controller.enqueue(encoder.encode('\n[error]'));
      } finally {
        controller.close();
      }
    },
    cancel() {
      upstream.cancel().catch(() => undefined);
    },
  });
}

/**
 * Stream text deltas from Claude via the official Anthropic SDK.
 */
function streamAnthropic(
  system: string,
  messages: ChatMessage[],
  maxTokens: number,
): ReadableStream<Uint8Array> {
  const client = new Anthropic();
  const stream = client.messages.stream({
    model: ANTHROPIC_MODEL,
    max_tokens: maxTokens,
    system: [
      {
        type: 'text',
        text: system,
        // The menu prompt is identical for every guest per locale — cache it.
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages,
  });

  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (error) {
        if (error instanceof Anthropic.APIError) {
          console.error(`[ai] anthropic stream error ${error.status}: ${error.message}`);
        } else {
          console.error('[ai] anthropic stream error:', error);
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
}

export function GET(): NextResponse {
  return NextResponse.json(
    { success: false, error: 'Method Not Allowed. Use POST.' },
    { status: 405, headers: { Allow: 'POST' } },
  );
}

export async function POST(request: Request): Promise<Response> {
  const provider = getProvider();
  if (!provider) {
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

  const system = buildSystemPrompt(locale);
  const maxTokens = envLimit('AI_MAX_TOKENS', 1024);
  const messages: ChatMessage[] = [
    ...history.map((entry) => ({ role: entry.role, content: entry.content })),
    {
      role: 'user',
      content: table ? `[Guest is seated at table ${table}]\n${message}` : message,
    },
  ];

  let readable: ReadableStream<Uint8Array>;
  try {
    readable =
      provider === 'groq'
        ? await streamGroq(system, messages, maxTokens)
        : streamAnthropic(system, messages, maxTokens);
  } catch (error) {
    console.error('[ai] upstream request failed:', error);
    return errorJson(502, 'upstream_error', 'AI assistant is temporarily unavailable.');
  }

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-RateLimit-Remaining': String(rate.remaining),
    },
  });
}
