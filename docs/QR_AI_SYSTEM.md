# QR Code Menu System & AI Assistant

This document describes the QR code system and the AI menu assistant added to the
Deliorman site, the limits that protect them, and a brainstorm/roadmap for taking
the system further.

## What was built

### 1. QR code generator — `GET /api/qr`

Server-side SVG QR generation (via the [`qrcode`](https://github.com/soldair/node-qrcode)
package). The endpoint **never encodes arbitrary input** — the destination URL is
built server-side from validated parameters, so it cannot be abused as a free QR
generator for phishing links.

| Param    | Values                                                       | Default |
| -------- | ------------------------------------------------------------ | ------- |
| `path`   | `/menu`, `/menu-2`, `/lunch-menu`, `/feedback`, `/reservation`, `/` | `/menu` |
| `locale` | `bg`, `en`, `tr`                                             | `bg`    |
| `table`  | integer `1..QR_TABLE_LIMIT`                                  | none    |
| `size`   | integer `96..1024` (px)                                      | `512`   |

Example: `/api/qr?path=/menu&locale=en&table=12` →
QR pointing at `https://www.restorantdeliorman.com/en/menu?table=12`.

Responses are deterministic, so they are cached aggressively (`max-age=86400`,
`s-maxage=604800`).

### 2. Staff tool — `/qr-menu`

A printable, brandable generator for per-table QR cards:

- choose the page, the language and a table range,
- preview all cards in a grid,
- print everything with a dedicated print stylesheet (controls hidden, cut-out borders),
- download individual SVGs.

The page is `noindex` — it's an internal tool.

### 3. AI menu assistant — `POST /api/ai/menu-assistant` + "Ask Deli" modal

Guests who scan a table QR land on `/menu?table=N` and can chat with **Deli**, the
restaurant's digital waiter:

- **two pluggable providers**, selected by environment variables:
  - **Groq (default, zero cost)** — `llama-3.1-8b-instant` on Groq's free tier
    (14,400 requests/day) via the OpenAI-compatible endpoint
    `https://api.groq.com/openai/v1`. Set `GROQ_API_KEY` and you're live.
  - **Claude (optional upgrade)** — the official Anthropic TypeScript SDK
    ([`anthropics/anthropic-sdk-typescript`](https://github.com/anthropics/anthropic-sdk-typescript))
    running `claude-opus-4-8`, with prompt caching (`cache_control: ephemeral`)
    for ~90% cheaper cached input. Set `AI_PROVIDER=anthropic` +
    `ANTHROPIC_API_KEY` to switch — no code changes needed.
- the **entire localized menu** (bg/en/tr) is rendered into the system prompt as
  compact text, so answers are grounded in real dishes and prices,
- responses **stream** to the browser, so the first words appear immediately,
- the assistant knows the guest's table number from the QR deep link,
- scope-locked by the system prompt: menu/restaurant questions only, no invented
  dishes or prices, allergen questions are deferred to staff.

The modal follows the site's design system (Playfair/Josefin typography, the
orange accent, the dark-teal palette) and the same accessibility conventions as
the existing feedback modal: focus trap, ESC to close, `aria-modal`, body scroll
lock, mobile bottom-sheet layout.

## Limits (defense in depth)

| Layer                   | Limit                                                       | Configurable via                      |
| ----------------------- | ----------------------------------------------------------- | ------------------------------------- |
| Middleware (`/api/ai`)  | 30 POSTs / 10 min / IP + origin allowlist                   | `src/middleware.js`                   |
| AI route                | 20 requests / 10 min / IP                                   | `AI_RATE_MAX`, `AI_RATE_WINDOW_SECONDS` |
| AI route                | message ≤ 500 chars, history ≤ 12 msgs × 2000 chars, body ≤ 50 KB | constants in route                |
| AI route                | response ≤ 1024 tokens                                      | `AI_MAX_TOKENS`                        |
| QR route                | 120 requests / min / IP                                     | `QR_RATE_MAX`, `QR_RATE_WINDOW_SECONDS` |
| QR route                | table `1..100`, size `96..1024`, allowlisted paths only     | `QR_TABLE_LIMIT`                       |
| QR staff tool           | ≤ 50 codes per batch                                        | `MAX_BATCH` in `QRMenuTool.jsx`        |

> Note: the in-memory rate limiters are per serverless instance. For strict
> global limits on Vercel, swap `src/app/_lib/rate-limit.ts` for
> `@upstash/ratelimit` + Redis — the call sites won't change.

## Setup

```bash
# .env.local (never commit this file!)
GROQ_API_KEY=gsk_...           # free at https://console.groq.com
NEXT_PUBLIC_SITE_URL=https://www.restorantdeliorman.com

# Optional: switch to Claude instead of the free Groq tier
# AI_PROVIDER=anthropic
# ANTHROPIC_API_KEY=sk-ant-...
```

Without any AI key the assistant degrades gracefully: the API returns 503 and
the modal shows a friendly "ask our staff" message. If the upstream provider
errors, the API returns 502 with the same friendly client behavior.

## Brainstorm: where to take the QR system next

**Quick wins**
1. **Scan analytics** — add `?src=qr&table=N` to QR URLs and track scans in
   Vercel Analytics; learn which tables/pages convert.
2. **PDF sheet export** — one A4 PDF with 6 cards per page for lamination
   (e.g. `pdf-lib` client-side).
3. **PNG export** — some printers handle PNG better than SVG; `qrcode` already
   supports `toBuffer()`.
4. **Wi-Fi QR card** — `WIFI:T:WPA;S:...;P:...;;` payload for a guest Wi-Fi card
   (admin-configured, not user input).
5. **Feedback QR on the receipt** — point at `/feedback?table=N` so feedback is
   attributable to a visit.

**Medium**
6. **Logo-branded QR codes** — embed the Deliorman mark in the QR center
   (error-correction level `H` keeps them scannable).
7. **Dynamic short links** — encode `/q/{id}` and resolve server-side, so printed
   codes never go stale when URLs change (needs a small KV store).
8. **Daily specials in the AI prompt** — pull `specialties.json` / lunch menu by
   weekday into the assistant's context.
9. **AI-aware upsell** — when the guest asks for a main, the assistant already
   suggests a matching side/drink; measure and tune with a feedback thumbs-up on
   each answer.

**Ambitious**
10. **Order-by-QR** — the cart flow already exists (`/cart`, `/checkout`); a
    table-scoped session could let guests compose an order and send it to the
    kitchen's Telegram channel like reservations do.
11. **Tool use for the assistant** — give Claude tools (`make_reservation`,
    `call_waiter`, `get_todays_specials`) so "book a table for 4 tomorrow"
    completes the reservation flow end-to-end.
12. **Voice mode** — Web Speech API on the menu page for hands-free ordering.

## Security notes

- `.env.local` was removed from git tracking in this change. **The previously
  committed keys (Resend, Telegram bot, Statsig) must be rotated** — they remain
  in git history.
- The QR endpoint only encodes allowlisted same-site paths.
- The AI endpoint is origin-validated by the middleware, rate-limited twice,
  schema-validated with zod, and size-capped.
- The Anthropic key is server-side only; the client only ever talks to
  `/api/ai/menu-assistant`.
