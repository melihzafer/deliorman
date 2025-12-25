# 🍽️ Restaurant Deliorman

> Modern, responsive website for Restaurant Deliorman (Samuil, Razgrad, Bulgaria) built with Next.js.

[![Live](https://img.shields.io/badge/demo-live-success)](https://restorantdeliorman.com)

## ✨ Features

- **📅 Online Reservations** – date/time + guest count + notes
- **🍴 Digital Menu** – menu pages + categorized display
- **🖼️ Gallery** – photos and lightbox
- **📱 Fully Responsive** – mobile/tablet/desktop
- **⚡ Performance-minded** – image caching headers, optimized build
- **🔎 SEO-ready** – metadata, OpenGraph, sitemap/robots
- **🧩 CMS-ready (optional)** – Sanity content fetching via API routes

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **UI:** React
- **Styling:** SCSS + CSS
- **Forms:** Formik
- **Deployment:** Vercel
- **CMS (optional):** Sanity

## 📦 Project Structure (important)

This repo contains **two separate apps**:

1) **Website (Next.js)** – the root project (this folder)
2) **Sanity Studio (Dashboard)** – in `studio/` (separate `package.json`)

They are intentionally separated to avoid dependency conflicts during deploy.

## 🚀 Getting Started (Website)

Install and run the website locally:

```powershell
npm install
npm run dev
```

Build locally:

```powershell
npm run build
npm run start
```

## 🧠 Sanity CMS (how this project uses it)

The website **does not embed Sanity Studio**. Instead, it reads content using API endpoints:

- `GET /api/sanity/menu`
- `GET /api/sanity/promos`
- `GET /api/sanity/cta`

### Environment variables

Create `.env` (or set them in Vercel) if you want to connect to your Sanity project:

- `SANITY_PROJECT_ID` (or `NEXT_PUBLIC_SANITY_PROJECT_ID`)
- `SANITY_DATASET` (or `NEXT_PUBLIC_SANITY_DATASET`)
- `SANITY_API_VERSION` (or `NEXT_PUBLIC_SANITY_API_VERSION`)
- `SANITY_TOKEN` (optional – only needed for private datasets / authenticated queries)

## 🧩 Sanity Studio (Dashboard)

Run the Studio locally from the `studio/` folder:

```powershell
cd studio
npm install
npm run dev
```

### Deploy Sanity Studio

Recommended: deploy Studio as a **separate Vercel project** with **Root Directory = `studio`**.

## 📸 Screenshots

![Homepage](./screenshots/homepage.png)
![Menu](./screenshots/menu.png)

## 📞 Contact & Links

- **Live Website:** https://restorantdeliorman.com
- **Facebook:** https://www.facebook.com/p/%D0%A0%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD%D1%82-%D0%94%D0%B5%D0%BB%D0%B8%D0%BE%D1%80%D0%BC%D0%B0%D0%BD-100078695683893/?locale=bg_BG
- **Instagram:** https://www.instagram.com/restorant_deliorman
- **TikTok:** https://www.tiktok.com/@restorantdeliorman
- **Phone:** +359 89 476 6273
- **Email:** restaurantdeliorman@gmail.com
- **Location:** с. Самуил, ул. „Хаджи Димитър“ №6, обл. Разград

## 📝 License

© Restaurant Deliorman. All rights reserved.

---

**Built with ❤️ for local businesses in Bulgaria**
