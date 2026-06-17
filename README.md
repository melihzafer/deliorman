# 🍽️ Ресторант Делиорман — Restaurant Website & Ordering Platform

> A modern, trilingual, production-grade website for **Deliorman Restaurant** in Samuil, Razgrad, Bulgaria. Built with Next.js 16 (App Router), it combines a digital menu, online ordering, table reservations, catering, a customer feedback system, and a blog — all optimized for performance, SEO, and accessibility.

[![Live Site](https://img.shields.io/badge/live-restorantdeliorman.com-success)](https://restorantdeliorman.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![i18n](https://img.shields.io/badge/i18n-BG%20%7C%20EN%20%7C%20TR-blue)](#-internationalization)
[![Deploy](https://img.shields.io/badge/deploy-Vercel-black?logo=vercel)](https://vercel.com/)

---

## ✨ Features

- **🍴 Digital Menu** — Classic menu, lunch menu, and specialty dishes with categories, pricing, and per-locale translations.
- **🛒 Online Ordering** — Product catalog, cart, and checkout flow for orders and pickups.
- **📅 Table Reservations** — Date/time picker, guest count, and notes, with instant **Telegram** and **email** notifications to staff (plus rate limiting to prevent spam).
- **🎉 Catering & Special Days** — Dedicated pages for catering services and event bookings.
- **⭐ Customer Feedback & Reviews** — Built-in feedback form and review display system with its own API.
- **📝 Blog** — Markdown-powered posts with authors, tags, and categories.
- **🖼️ Gallery** — Image gallery with lightbox.
- **📍 Mapbox Integration** — Interactive location map and directions.
- **🌐 Trilingual (BG / EN / TR)** — Full internationalization via `next-intl` with locale-based routing.
- **📱 PWA-ready** — Offline fallback page and responsive design across mobile, tablet, and desktop.
- **🔒 Hardened** — Security headers (HSTS, CSP-related, X-Frame-Options, etc.) and structured data (JSON-LD) for SEO.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router, Webpack build) |
| **Language** | JavaScript + TypeScript (incremental migration) |
| **Styling** | SCSS / Sass + CSS |
| **i18n** | next-intl (BG, EN, TR) |
| **Email** | Resend |
| **Notifications** | Telegram Bot API |
| **Maps** | Mapbox GL |
| **UI / Media** | Swiper, Framer Motion, react-modal-video, yet-another-react-lightbox |
| **Content** | Markdown via remark / gray-matter |
| **Images** | next/image + Sharp (AVIF / WebP) |
| **Testing** | Playwright (E2E + performance/Web Vitals) |
| **Deployment** | Vercel |
| **Analytics** | Vercel Analytics + Speed Insights |

## 📋 Prerequisites

- Node.js 18.17 or later
- npm or yarn

## 🚀 Getting Started

```bash
# 1. Clone
git clone https://github.com/melihzafer/deliorman.git
cd deliorman

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# fill in your values (see below)

# 4. Run the dev server
npm run dev
# open http://localhost:3000
```

## ⚙️ Environment Variables

Create a `.env` from `.env.example`. **Never commit `.env`** — it is already gitignored.

### Required (server-side)

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Resend API key for transactional email |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token from BotFather |
| `TELEGRAM_RESERVATIONS_CHAT_ID` | Chat/channel ID for reservation alerts |

### Optional

| Variable | Purpose |
|----------|---------|
| `TELEGRAM_DISABLE` | Set `true` to disable Telegram (useful locally) |
| `NEXT_PUBLIC_SITE_URL` | Production URL (e.g. `https://restorantdeliorman.com`) |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox token for the location map |
| `RESERVATION_RATE_WINDOW_SECONDS` | Rate-limit window (default `86400`) |
| `RESERVATION_RATE_MAX` | Max reservations per window (default `5`) |

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run analyze` | Build with bundle analyzer |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:perf` | Run Web Vitals performance tests |

## 🌐 Internationalization

The app serves three locales with locale-prefixed routes (`/bg`, `/en`, `/tr`) handled by `next-intl` and `src/middleware.js`. Translation files live in `messages/{bg,en,tr}.json`, and menu data has dedicated per-locale translations.

## 🧱 Project Structure

```
src/
├─ app/
│  ├─ [locale]/(pages)/   # localized routes: menu, shop, cart, checkout,
│  │                      # reservation, catering, feedback, gallery, about…
│  ├─ api/                # contact, menu, reservation, feedback endpoints
│  ├─ _components/        # home, menu, order, products, reviews, forms, ui…
│  ├─ _layouts/           # headers, footers, cart, preloader
│  └─ offline/            # PWA offline fallback
├─ data/                  # menu, products, posts, testimonials, sliders…
├─ i18n/                  # next-intl request config
└─ middleware.js          # locale routing
```

## 🔌 API Endpoints

| Route | Purpose |
|-------|---------|
| `POST /api/reservation` | Submit a reservation (email + Telegram, rate-limited) |
| `POST /api/contact` | Contact form submissions |
| `POST /api/feedback` | Customer feedback / reviews |
| `GET  /api/menu` | Menu data |

## 🔧 Configuration

- **Site info, contact, social, coordinates, menu:** `src/data/app.json` and related data files.
- **Domain / canonical URLs:** `src/app/layout.jsx`, `robots.ts`, `sitemap.ts`, `StructuredData.jsx`.

## 🚢 Deployment (Vercel)

1. Push to GitHub.
2. Import the project in Vercel.
3. Add the environment variables listed above.
4. Deploy. Vercel Analytics and Speed Insights are wired in automatically.

## ⚡ Performance

- Automatic AVIF/WebP image optimization via next/image + Sharp.
- `optimizePackageImports` for Swiper, Framer Motion, date-fns, and more.
- Long-lived image cache TTL and responsive device sizes.
- Lazy loading, static generation where possible, and bundle analysis.

## 📞 Contact & Links

- **Live:** [restorantdeliorman.com](https://restorantdeliorman.com)
- **Facebook:** [Restaurant Deliorman](https://www.facebook.com/profile.php?id=100063542858187)
- **Phone:** +359 89 4766273
- **Email:** restaurantdeliorman@gmail.com
- **Location:** с. Самуил, ул. „Хаджи Димитър" №6, обл. Разград

## 👨‍💻 Developer

**Melih Zafer Hyusein**
- Portfolio: [portfolio.melihzafer.me](https://portfolio.melihzafer.me)
- GitHub: [@melihzafer](https://github.com/melihzafer)
- Company: OMNI Tech Solutions

## 📄 License

© Restaurant Deliorman. All rights reserved.

---

**Built with ❤️ for local businesses in Bulgaria.**
