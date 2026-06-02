# Cerebrum

> OpenWolf's learning memory. Updated automatically as the AI learns from interactions.
> Do not edit manually unless correcting an error.
> Last updated: 2026-05-17

## User Preferences

<!-- How the user likes things done. Code style, tools, patterns, communication. -->

## Key Learnings

- **Project:** deliorman
- **Description:** > A modern, fully responsive restaurant website for Deliorman Restaurant located in Samuil, Razgrad, Bulgaria. Features online table reservations, interactive menu showcase, and elegant UI/UX design.
- Architect audit found `src/graphify-out/cache` contains generated Graphify JSON artifacts under the source root; future cleanup should remove or ignore it instead of treating it as app code.
- Architect audit found `.gitignore` currently contains unresolved conflict markers and does not protect against several generated artifacts (`src/graphify-out/`, `.graphify_*`, `tsconfig.tsbuildinfo`).
- The `/masa` QR menu client is now split across `src/app/masa/` modules: hooks own session/waiter state, helper files own locale/menu logic, and presentational components receive the shared table stylesheet as props.
- Public feedback/reservation route guards require valid `Content-Length` before parsing bodies; browser/proxy submissions must preserve that header.
- Menu localization is split across `src/data/menu.json` for the Bulgarian source of truth, `src/data/menu.translations.en.js` and `src/data/menu.translations.tr.js` for item-level translations, and `messages/*.json` for category labels used by the UI, search, and SEO layers.
- When menu category slugs change, `src/app/_components/StructuredData.jsx` must be updated too because it hardcodes the food-category slug list used for JSON-LD menu sections.
- The QR menu route is `/masa`; it uses `public/data/menu.json` for static localized menu data, `QR_MENU_SECRET` HMAC keys for table URLs, and Google Sheets `sessions` columns `token | masa_id | created_at | last_ping | active | last_call`.
- The unlocalized `/masa` route must bypass `next-intl` middleware in `src/middleware.js`; otherwise local/dev requests can return 404 before the root route renders.
- Local QR/API testing can use Ethernet `192.168.0.108` and Tailscale `100.112.143.11`; middleware cannot inspect WiFi/Ethernet SSID, only request origin/host/IP headers.
- Local `/masa?id=3` testing without a QR key uses development-only in-memory sessions from `src/app/_lib/masaDevSession.ts` for localhost, Ethernet, and Tailscale hosts.
- QR menu prices are displayed in euros by converting BGN data at the fixed rate `1 EUR = 1.95583 BGN`; the source JSON still stores the menu currency as BGN.
- The `/masa` masthead uses only the themed SVG logo at `public/img/deliorman_colorized_logo.svg` for the brand mark; the old visible `Делиорман` text header is intentionally removed.
- The QR table header text lives in `src/app/masa/MasaClient.tsx`, while category titles/descriptions come from `public/data/menu.json`; they need separate translation updates.
- The QR masthead hero strip should use restaurant indoor/outdoor venue photos, not menu dish photos.
- The category image cards in `src/app/_lib/menuCategoryImages.ts` need localized `bg/tr/en` title and note copy; rendering them directly as plain strings leaves the cards stuck in Bulgarian.

## Do-Not-Repeat

<!-- Mistakes made and corrected. Each entry prevents the same mistake recurring. -->
<!-- Format: [YYYY-MM-DD] Description of what went wrong and what to do instead. -->
- [2026-05-17] When using a one-off Node regeneration script, do not mix `??` with `||` in the same expression without parentheses; Node will stop on a syntax error before the export files are generated.
- [2026-05-17] Do not add lowercase `button.tsx` under `src/app/_components/ui/`; Windows treats it as colliding with the existing uppercase `Button.jsx` import path and Next/TypeScript fails the build.
- [2026-05-17] Do not route `/masa` through the locale middleware; explicitly return `NextResponse.next()` for `/masa` and `/masa/*`.
- [2026-05-17] Do not try to enforce SSID in Next middleware; browsers/edge middleware do not expose SSID, so use signed QR keys plus origin/IP-based testing instead.
- [2026-05-17] Allowing local network origins in middleware is not enough for `/masa`; the client and session API also need local-test handling because the menu is gated by `/api/session/start`.
- [2026-05-17] Do not change `/masa` fonts or the existing Всекидневник menu-item layout when iterating UI; restrict changes to photo treatment and hamburger drawer controls unless explicitly asked.
- [2026-05-17] QR menu card images must stay scoped to the active category; do not fill the card strip with neighboring or unrelated category images. Track missing photos in `src/data/menu-image-gaps.json`.
- [2026-05-17] Do not reuse dish assets in the hero strip; `src/app/_lib/menuCategoryImages.ts` heroImages should point at venue photos from `public/img/indoor_footage/` and `public/img/outdoor_footage/`.
- [2026-05-17] Do not run `npx tsc --noEmit` in parallel with `next build`; both touch `.next`/incremental TypeScript state and can create false missing `.next/types` errors.

## Decision Log

<!-- Significant technical decisions with rationale. Why X was chosen over Y. -->
- [2026-05-17] Reorganized the new printed menu into a clearer flat category model so the existing slider-based menu UI could stay unchanged while the web data matches the new 8-page print menu.
- [2026-05-17] `/masa` defaults to Bulgarian, supports Turkish as secondary and English where available, and must reuse the existing `Всекидневник` newspaper design from `src/app/[locale]/table`.
- [2026-05-17] `/masa` improves the `Всекидневник` UX with euro pricing, hamburger-drawer language/category controls, and photo strip/clippings using existing dish images from `public/img/menuCategorised`.
- [2026-05-17] Planned routing cleanup: `/[locale]/table` should become the canonical QR menu route, `/masa` should redirect there, and the table route should render the Masa QR content with the latest image cards.
- [2026-05-17] Do not assume the QR table masthead or category labels are covered by message files; translate `MasaClient` copy keys and `public/data/menu.json` directly when working on `/[locale]/table`.
- [2026-05-17] Chose not to reorganize `src/app/_components/sections` during architect cleanup; it remains a later PR because it is high import-churn compared with the resolved generated-artifact and god-file issues.
