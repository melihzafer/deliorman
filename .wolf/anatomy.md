# anatomy.md

> Auto-maintained by OpenWolf. Last scanned: 2026-07-07T15:11:04.879Z
> Files: 44 tracked | Anatomy hits: 0 | Misses: 0

## ./


## .claude/


## .claude/rules/


## docs/performance/


## graphify-out/


## graphify-out/cache/


## messages/

- `bg.json` (~11583 tok)
- `en.json` (~11357 tok)
- `tr.json` (~11446 tok)

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


## src/app/


## src/app/[locale]/


## src/app/[locale]/(pages)/


## src/app/[locale]/(pages)/about/


## src/app/[locale]/(pages)/catering-services/

- `content.js` — Exports cateringServicesContent, getCateringServicesContent (~2903 tok)

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


## src/app/[locale]/(pages)/search/


## src/app/[locale]/(pages)/services/


## src/app/[locale]/(pages)/special-days/

- `page.jsx` — SpecialDays (~4586 tok)

## src/app/[locale]/(pages)/terms/

- `content.js` — Exports termsContent (~4536 tok)

## src/app/[locale]/table/

- `menu.module.scss` — Styles: 55 rules, 30 vars (~4643 tok)

## src/app/_common/


## src/app/_components/

- `StructuredData.jsx` — Structured Data (JSON-LD) Component (~1824 tok)

## src/app/_components/common/

- `MobileBottomNav.jsx` — ordersPhoneHref (~780 tok)

## src/app/_components/feedback/


## src/app/_components/forms/

- `ReservationForm.jsx` — stepVariants — renders form (~5429 tok)

## src/app/_components/forms/reservation/


## src/app/_components/home/


## src/app/_components/menu/


## src/app/_components/menu/__tests__/


## src/app/_components/menu/qr/


## src/app/_components/reviews/


## src/app/_components/search/


## src/app/_components/sections/

- `ContactInfo.jsx` — CONTACT_INFO_ICONS (~1002 tok)

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
- `siteContact.js` — Restaurant phone numbers (centralized source of truth). (~982 tok)

## src/app/_lib/__tests__/


## src/app/_styles/


## src/app/_styles/css/


## src/app/_styles/css/plugins/


## src/app/_styles/scss/


## src/app/_styles/scss/ui/


## src/app/api/__tests__/


## src/app/api/ai/menu-assistant/

- `route.ts` — Providers, cheapest first: (~3319 tok)

## src/app/api/contact/

- `route.ts` — Next.js API route: POST (~1986 tok)

## src/app/api/feedback/


## src/app/api/health/


## src/app/api/menu/


## src/app/api/qr/


## src/app/api/reservation/

- `route.ts` — Next.js API route: GET, POST (~1241 tok)

## src/app/api/search/


## src/app/api/session/create/


## src/app/api/session/ping/


## src/app/api/session/start/

- `route.ts` — Next.js API route: POST (~990 tok)

## src/app/api/waiter/call/


## src/app/api/wizard/recommend/

- `route.ts` — Next.js API route: POST (~3547 tok)

## src/app/masa/

- `MasaClient.tsx` — formatTime (~2916 tok)
- `masaConstants.ts` — Waiter-call feature flag. (~309 tok)
- `MasaTasteWizard.tsx` — QR session token. Used by the LLM proxy as a soft auth gate. (~10510 tok)
- `useMasaSession.ts` — Exports MasaRole, useMasaSession (~1770 tok)
- `useWaiterCall.ts` — Exports useWaiterCall (~1100 tok)

## src/app/masa/wizard/

- `budgetRepair.ts` — Deterministic budget repair — runs AFTER the LLM response is schema- (~1588 tok)
- `candidates.ts` — Deterministic candidate shortlist builder for the LLM recommendation (~1681 tok)
- `customerMode.ts` — Customer-mode classifier for the LLM candidate pipeline. (~1529 tok)
- `llmPrompt.ts` — Pure prompt builder for the wizard LLM. (~2026 tok)
- `llmRecommend.ts` — AbortController for in-flight cancellation (e.g. user closes modal) (~1876 tok)
- `recommendSchema.ts` — Hand-rolled schema validator for the LLM's JSON output. (~2141 tok)
- `types.ts` — Taste Wizard — shared types and the new tag model. (~1662 tok)

## src/app/offline/

- `page.jsx` — OfflinePage (~1069 tok)

## src/data/

- `app.json` (~1981 tok)

## src/data/.json/


## src/data/sections/


## src/data/sections/about/


## src/data/sections/awards/


## src/data/sections/contact/

- `contact-info.json` (~377 tok)

## src/data/sections/counters/


## src/data/sections/cta/


## src/data/sections/features/


## src/data/sections/hero/


## src/data/sections/reservation/

- `reservation-form.json` (~57 tok)
- `reservation-opentable.json` (~57 tok)

## tests/


## tests/unit/wizard/

- `budgetRepair.test.ts` — Declares candidate (~1618 tok)
- `candidates.test.ts` — ALL_IDS: item, expect (~1475 tok)
- `customerMode.test.ts` — Declares mode (~853 tok)
- `llmPrompt.test.ts` — Declares candidate (~1686 tok)
- `realFixture.ts` — A menu fixture built from REAL production item ids (see (~862 tok)
- `recommendSchema.test.ts` — Declares r (~1990 tok)
- `scenarios.test.ts` — End-to-end deterministic pipeline tests for the required multilingual (~2291 tok)
