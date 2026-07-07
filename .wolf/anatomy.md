# anatomy.md

> Auto-maintained by OpenWolf. Last scanned: 2026-07-07T16:44:21.832Z
> Files: 67 tracked | Anatomy hits: 0 | Misses: 0

## ./

- `env.example` — Email Service (Server-side only - DO NOT expose to client) (~583 tok)

## .claude/


## .claude/rules/


## C:/Users/melih/AppData/Local/Temp/claude/D--Projects-Web-deliorman/9eab0c8a-ad92-4ece-b9ac-757717a5e6fa/scratchpad/

- `convert-bgn-to-eur.mjs` — Declares RATE (~363 tok)

## docs/performance/


## graphify-out/


## graphify-out/cache/


## messages/

- `bg.json` (~11679 tok)
- `en.json` (~11450 tok)
- `tr.json` (~11538 tok)

## performance-reports/


## public/


## public/data/


## public/fonts/


## public/img/


## public/img/awards/


## public/img/banners/


## public/img/blog/


## public/img/decoration_footage/


## public/img/faces/


## public/img/history/


## public/img/icons/


## public/img/indoor_footage/


## public/img/menu/


## public/img/menuCategorised/Desserts/


## public/img/menuCategorised/Grill&Specialties/


## public/img/menuCategorised/Pizzas/


## public/img/menuCategorised/QuickBites/


## public/img/menuCategorised/Salads/


## public/img/menuCategorised/Soft drinks & Beverages/


## public/img/menuCategorised/SoupsFIshSandwiches/


## public/img/outdoor_footage/


## public/img/services/


## public/img/ui/


## scripts/


## src/

- `middleware.js` — API routes: GET (6 endpoints) (~1919 tok)

## src/app/

- `layout.jsx` — josefin_sans (~1968 tok)
- `robots.ts` — Declares robots (~147 tok)
- `sitemap.ts` — Declares sitemap (~403 tok)

## src/app/[locale]/


## src/app/[locale]/(pages)/


## src/app/[locale]/(pages)/about/


## src/app/[locale]/(pages)/catering-services/

- `content.js` — Exports cateringServicesContent, getCateringServicesContent (~2902 tok)

## src/app/[locale]/(pages)/contact/


## src/app/[locale]/(pages)/feedback/


## src/app/[locale]/(pages)/gallery/


## src/app/[locale]/(pages)/history/


## src/app/[locale]/(pages)/home-2/


## src/app/[locale]/(pages)/home-3/


## src/app/[locale]/(pages)/lunch-menu/

- `page.jsx` — generateMetadata (~2094 tok)

## src/app/[locale]/(pages)/menu-2/


## src/app/[locale]/(pages)/menu/


## src/app/[locale]/(pages)/onepage/


## src/app/[locale]/(pages)/reservation-2/


## src/app/[locale]/(pages)/reservation/

- `page.jsx` — generateMetadata (~524 tok)

## src/app/[locale]/(pages)/search/


## src/app/[locale]/(pages)/services/


## src/app/[locale]/(pages)/special-days/

- `page.jsx` — SpecialDays (~4586 tok)

## src/app/[locale]/(pages)/terms/

- `content.js` — Exports termsContent (~4535 tok)

## src/app/[locale]/table/

- `menu.module.scss` — Styles: 55 rules, 30 vars (~4643 tok)

## src/app/_common/


## src/app/_components/

- `StructuredData.jsx` — Structured Data (JSON-LD) Component (~2208 tok)

## src/app/_components/common/

- `DailySpecial.jsx` — DailySpecial (~697 tok)
- `MobileBottomNav.jsx` — ordersPhoneHref (~780 tok)

## src/app/_components/feedback/


## src/app/_components/forms/

- `ReservationForm.jsx` — stepVariants — renders form (~5428 tok)

## src/app/_components/forms/reservation/


## src/app/_components/home/

- `HomePageContent.jsx` — HomePageContent (~536 tok)

## src/app/_components/menu/

- `MenuItem2.jsx` — MenuItem2 (~602 tok)

## src/app/_components/menu/__tests__/

- `MenuFiltered.test.jsx` — translator (~1210 tok)

## src/app/_components/menu/ai/

- `AIAssistantModal.jsx` — "Попитай Дели" chat modal: streams `/api/ai/menu-assistant`, trims history to MAX_HISTORY_MESSAGES/MAX_HISTORY_CHARS (must match route.ts). (~3153 tok)
- `MenuAIAssistant.jsx` — Entry point: renders the trigger button + AIAssistantModal, reads `?table=` from the QR deep link. (~500 tok)

## src/app/_components/menu/qr/


## src/app/_components/reviews/


## src/app/_components/search/


## src/app/_components/sections/

- `ContactInfo.jsx` — CONTACT_INFO_ICONS (~1002 tok)
- `FAQ.jsx` — Renders the same Q&A used in the FAQPage JSON-LD (StructuredData.jsx). (~522 tok)
- `FAQ.module.scss` — Styles: 5 rules (~318 tok)

## src/app/_components/services/


## src/app/_components/sliders/


## src/app/_components/ui/


## src/app/_components/ui/__tests__/


## src/app/_layouts/


## src/app/_layouts/divider/


## src/app/_layouts/footers/

- `LayoutDefault.jsx` — DefaultFooter (~2056 tok)

## src/app/_layouts/headers/


## src/app/_layouts/preloader/


## src/app/_layouts/scroll-hint/


## src/app/_lib/

- `sheets.ts` — Exports SESSION_TTL_MS, SESSION_FRESH_MS, WAITER_CALL_COOLDOWN_MS, SessionRow + 13 more (~2215 tok)
- `siteContact.js` — Restaurant phone numbers (centralized source of truth). (~981 tok)

## src/app/_lib/__tests__/


## src/app/_styles/


## src/app/_styles/css/


## src/app/_styles/css/plugins/


## src/app/_styles/scss/


## src/app/_styles/scss/ui/


## src/app/api/__tests__/


## src/app/api/ai/menu-assistant/

- `route.ts` — Providers, cheapest first: (~3891 tok)

## src/app/api/contact/

- `route.ts` — Next.js API route: POST (~1986 tok)

## src/app/api/feedback/


## src/app/api/health/


## src/app/api/menu/


## src/app/api/qr/


## src/app/api/reservation/

- `route.ts` — Next.js API route: GET, POST (~1241 tok)

## src/app/api/search/

- `route.ts` — Next.js API route: GET (~2562 tok)

## src/app/api/session/create/


## src/app/api/session/ping/


## src/app/api/session/start/

- `route.ts` — Next.js API route: POST (~990 tok)

## src/app/api/waiter/call/


## src/app/api/wizard/recommend/

- `route.ts` — Next.js API route: POST (~3547 tok)

## src/app/masa/

- `MasaClient.tsx` — formatTime (~2916 tok)
- `masaConstants.ts` — Waiter-call feature flag. (~299 tok)
- `masaMenuUtils.ts` — Exports normalizeTableId, localized, formatDate, getEditionLabel, formatPrice (~607 tok)
- `MasaTasteWizard.tsx` — QR session token. Used by the LLM proxy as a soft auth gate. (~10510 tok)
- `masaTranslations.ts` — Declares copy (~7360 tok)
- `useMasaSession.ts` — Exports MasaRole, useMasaSession (~1770 tok)
- `useWaiterCall.ts` — Exports useWaiterCall (~1100 tok)

## src/app/masa/wizard/

- `budgetParse.ts` — Budget extraction from free-text wizard input. (~644 tok)
- `budgetRepair.ts` — Deterministic budget repair — runs AFTER the LLM response is schema- (~1588 tok)
- `candidates.ts` — Deterministic candidate shortlist builder for the LLM recommendation (~1681 tok)
- `customerMode.ts` — Customer-mode classifier for the LLM candidate pipeline. (~1525 tok)
- `llmPrompt.ts` — Pure prompt builder for the wizard LLM. (~2028 tok)
- `llmRecommend.ts` — AbortController for in-flight cancellation (e.g. user closes modal) (~1876 tok)
- `recommendSchema.ts` — Hand-rolled schema validator for the LLM's JSON output. (~2141 tok)
- `types.ts` — Taste Wizard — shared types and the new tag model. (~1662 tok)

## src/app/offline/

- `page.jsx` — OfflinePage (~1069 tok)

## src/data/

- `app.json` (~1980 tok)
- `specialties.json` (~367 tok)

## src/data/.json/


## src/data/sections/


## src/data/sections/about/


## src/data/sections/awards/


## src/data/sections/contact/

- `contact-info.json` (~376 tok)

## src/data/sections/counters/


## src/data/sections/cta/


## src/data/sections/features/


## src/data/sections/hero/


## src/data/sections/reservation/

- `reservation-form.json` (~57 tok)
- `reservation-opentable.json` (~57 tok)

## src/i18n/

- `seo.js` — The canonical host is www — restorantdeliorman.com 307-redirects here at (~368 tok)

## tests/


## tests/unit/wizard/

- `budgetParse.test.ts` (~811 tok)
- `budgetRepair.test.ts` — Declares candidate (~1615 tok)
- `candidates.test.ts` — ALL_IDS: item, expect (~1470 tok)
- `customerMode.test.ts` — Declares mode (~852 tok)
- `fixture.ts` — Tiny test fixture for wizard unit tests — represents the real menu shape (~942 tok)
- `llmPrompt.test.ts` — Declares candidate (~1686 tok)
- `realFixture.ts` — A menu fixture built from REAL production item ids (see (~859 tok)
- `recommendSchema.test.ts` — Declares r (~1990 tok)
- `scenarios.test.ts` — End-to-end deterministic pipeline tests for the required multilingual (~2285 tok)
