# Memory

> Chronological action log. Hooks and AI append to this file automatically.
> Old sessions are consolidated by the daemon weekly.
| 17:31 | Edited package.json | 1→2 lines | ~17 |
| 17:31 | Created src/app/_lib/sheets.ts | — | ~1110 |
| 17:31 | Created src/app/_lib/telegram.ts | — | ~192 |
| 17:32 | Created src/app/api/session/create/route.ts | — | ~311 |
| 17:32 | Created src/app/api/session/ping/route.ts | — | ~319 |
| 17:32 | Created src/app/api/waiter/call/route.ts | — | ~542 |
| 17:33 | Created src/app/[locale]/table/page.jsx | — | ~136 |
| 17:33 | Created src/app/[locale]/table/TableClient.jsx | — | ~2491 |
| 17:34 | Created src/app/[locale]/table/table.module.scss | — | ~1790 |
| 17:34 | Edited env.example | expanded (+6 lines) | ~83 |

## Session: 2026-04-24 17:57

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|

## Session: 2026-04-24 17:57

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 17:59 | Created scripts/screenshot-table.mjs | — | ~330 |
| 18:02 | Edited src/app/[locale]/table/TableClient.jsx | expanded (+6 lines) | ~90 |
| 18:02 | Edited src/app/globals.css | CSS: display, background-image | ~154 |
| 18:03 | Edited src/app/globals.css | 8→9 lines | ~83 |
| 18:03 | Created scripts/screenshot-table.mjs | — | ~384 |
| 18:04 | Created scripts/inspect-orange.mjs | — | ~351 |
| 18:05 | Session end: 6 writes across 4 files (screenshot-table.mjs, TableClient.jsx, globals.css, inspect-orange.mjs) | 3 reads | ~6182 tok |
| 18:10 | Created src/app/[locale]/table/page.jsx | — | ~273 |
| 18:11 | Created src/app/[locale]/table/table.module.scss | — | ~2671 |
| 18:11 | Edited src/app/[locale]/table/TableClient.jsx | 15→20 lines | ~234 |
| 18:12 | Edited src/app/[locale]/table/TableClient.jsx | 6→8 lines | ~78 |
| 18:12 | Edited src/app/[locale]/table/TableClient.jsx | 7→10 lines | ~99 |
| 18:12 | Created scripts/screenshot-table.mjs | — | ~219 |
| 18:13 | Session end: 12 writes across 6 files (screenshot-table.mjs, TableClient.jsx, globals.css, inspect-orange.mjs, page.jsx) | 5 reads | ~10098 tok |
| 18:17 | Edited src/app/[locale]/table/TableClient.jsx | CSS: passive, left, behavior | ~484 |
| 18:17 | Edited src/app/[locale]/table/TableClient.jsx | inline fix | ~19 |
| 18:17 | Edited src/app/[locale]/table/TableClient.jsx | CSS: behavior, inline, block | ~408 |
| 18:17 | Edited src/app/[locale]/table/table.module.scss | CSS: margin-top, shape-outside | ~104 |
| 18:18 | Edited src/app/[locale]/table/table.module.scss | modified not() | ~306 |
| 18:18 | Edited src/app/[locale]/table/TableClient.jsx | 3→8 lines | ~81 |
| 18:18 | Edited src/app/[locale]/table/table.module.scss | CSS: text-transform | ~92 |
| 18:19 | Session end: 19 writes across 6 files (screenshot-table.mjs, TableClient.jsx, globals.css, inspect-orange.mjs, page.jsx) | 7 reads | ~14286 tok |
| 18:26 | Session end: 19 writes across 6 files (screenshot-table.mjs, TableClient.jsx, globals.css, inspect-orange.mjs, page.jsx) | 7 reads | ~14286 tok |
| 18:27 | Created graphify-out/.graphify_chunk_01.json | — | ~208 |
| 18:28 | Created .graphify_run_ast.py | — | ~186 |
| 18:28 | Created .graphify_merge_sem.py | — | ~365 |
| 18:28 | Created .graphify_merge_all.py | — | ~220 |
| 18:28 | Created .graphify_step4.py | — | ~451 |
| 18:29 | Created .graphify_step5.py | — | ~586 |

## Session: 2026-04-29 12:59

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 11:20 | Rebuilt menu data from updated print-menu images | src/data/menu.json | Replaced old items, prices, and category grouping with the new 8-page menu structure | ~12000 |
| 11:20 | Synced localized menu translations and labels | src/data/menu.translations.en.js, src/data/menu.translations.tr.js, messages/bg.json, messages/en.json, messages/tr.json | Updated item translations and category labels to match the new menu slugs | ~7000 |
| 11:20 | Regenerated auxiliary menu exports and validated build | src/data/menu2.json, src/data/menu_merged_en.json, src/app/_components/StructuredData.jsx, src/types/index.ts | Refreshed derived menu JSONs, updated structured-data slugs, and confirmed the app build succeeds | ~4000 |
| 11:45 | Planned QR menu and waiter-call system | plan.md | Approved QR secret, Bulgarian default, Tailwind/shadcn setup, and retro Wild Forest Newspaper design direction | ~9000 |
| 12:05 | Implemented signed QR menu sessions and waiter calls | src/app/_lib/sheets.ts, src/app/api/session/start/route.ts, src/app/api/session/ping/route.ts, src/app/api/waiter/call/route.ts | Added HMAC QR keys, six-column Sheets sessions, TTL, heartbeat expiry, Telegram waiter call, and rate limiting | ~8500 |
| 12:05 | Built /masa QR menu UI | src/app/masa/*, public/data/menu.json, postcss.config.mjs, src/app/tailwind.css | Added noindex retro newspaper QR menu with bg/tr/en menu text, session overlay, waiter button, and cooldown | ~11000 |
| 12:06 | Validated QR menu implementation | npm build, focused eslint, QR URL script | Production build and focused new-code lint passed; menu JSON and QR URL generation checked | ~3000 |
| 11:53 | Smoke-tested /masa locally | src/middleware.js, src/app/api/session/start/route.ts | Fixed /masa 404 by bypassing next-intl middleware; page/menu/invalid-key checks pass, live Sheets/Telegram flow blocked by missing local env vars | ~4500 |
| 12:08 | Added local network test origins | src/middleware.js | Allowed Ethernet 192.168.0.108 and Tailscale 100.112.143.11 origins outside Vercel production; middleware lint and build pass | ~1800 |
| 12:22 | Fixed LAN no-key /masa overlay | src/app/_lib/masaDevSession.ts, src/app/masa/MasaClient.tsx, src/app/api/session/*, src/app/api/waiter/call/route.ts | Added dev-only local in-memory sessions; LAN no-key page now shows menu and waiter button; build passes | ~5200 |
| 12:47 | Restored existing newspaper design for /masa | src/app/masa/MasaClient.tsx, src/app/masa/page.tsx, src/app/[locale]/table/table.module.scss | Reused the existing Всекидневник layout/styles with /masa session and waiter behavior; lint/build and browser text check pass | ~4200 |
| 12:58 | Converted /masa prices to euro and added dish-photo UX | src/app/masa/MasaClient.tsx, src/app/[locale]/table/table.module.scss | Prices display in EUR at 1.95583 BGN/EUR; active categories show newspaper-style photo clippings; sticky category nav added; build passes | ~3600 |
| 14:38 | Reverted poster-style font/layout changes | src/app/masa/MasaClient.tsx, src/app/[locale]/table/table.module.scss | Restored existing Всекидневник masthead/list typography; kept hamburger drawer and photo strip/clipping changes; build passes | ~2600 |
| 14:55 | Added colorized Deliorman logo to /masa | public/img/deliorman_colorized_logo.svg, src/app/masa/MasaClient.tsx, src/app/[locale]/table/table.module.scss | Copied the provided SVG into public assets, rendered it in the existing masthead, and verified build/browser rendering | ~1800 |
| 14:55 | Enlarged /masa logo and removed text header | src/app/masa/MasaClient.tsx, src/app/[locale]/table/table.module.scss | Logo is now the only masthead brand mark and uses a sepia/ink filter to better match the newspaper theme | ~900 |
| 14:59 | Retinted /masa logo to newspaper palette | public/img/deliorman_colorized_logo.svg, src/app/[locale]/table/table.module.scss | Replaced bright SVG colors with paper/ink/accent theme colors and enlarged the masthead mark | ~1000 |
| 15:01 | Made /masa logo smaller and embossed | src/app/masa/MasaClient.tsx, src/app/[locale]/table/table.module.scss | Cropped internal SVG padding in a smaller stamp wrapper and added multiply/opacity/shadow treatment for a carved newspaper feel | ~900 |
| 15:03 | Tightened /masa logo stamp | src/app/[locale]/table/table.module.scss | Reduced stamp footprint, zoomed/cropped SVG internal padding, and muted color/filtering toward an engraved paper mark | ~700 |
| 15:05 | Changed /masa logo accents to wood brown | public/img/deliorman_colorized_logo.svg, src/app/[locale]/table/table.module.scss | Replaced red SVG accents with wood-brown tones and reduced the stamp footprint again | ~700 |
| 15:06 | Removed carved /masa logo effects | src/app/[locale]/table/table.module.scss | Kept the smaller cropped wood-brown logo but removed embossed shadows, blend, and carved background effects | ~500 |
| 15:08 | Moved /masa logo under hamburger | src/app/masa/MasaClient.tsx, src/app/[locale]/table/table.module.scss | Made the logo smaller and left-aligned it below the masthead hamburger row | ~500 |
| 15:10 | Added digital menu label beside /masa logo | src/app/masa/MasaClient.tsx, src/app/[locale]/table/table.module.scss | Added localized label text to the right of the small top-left logo | ~500 |
| 16:28 | Ran architect structure audit and saved gated restructure plan | .architect-before.json, session plan.md, .wolf/cerebrum.md, .wolf/anatomy.md | Found one god file, generated source artifacts, stale files, no circular deps; plan awaits confirmation | ~9000 |
| 17:03 | Executed architect restructure | .gitignore, .architect-after.json, src/app/api/*, src/app/masa/*, .wolf/* | Removed generated clutter, split API routes and MasaClient, hardened public forms, verified build/tsc/targeted lint/smoke | ~22000 |
| 15:11 | Fixed /masa mobile masthead clipping | src/app/[locale]/table/table.module.scss | Tightened mobile header spacing and badge lettering so the right newspaper badge fits with the new logo row | ~500 |
| 15:12 | Stacked /masa logo above digital menu label | src/app/[locale]/table/table.module.scss | Centered the logo/label block and made the digital menu text larger, bolder, and wood-brown | ~500 |
| 15:14 | Removed /masa digital menu label and duplicate intro | src/app/masa/MasaClient.tsx, src/app/[locale]/table/table.module.scss | Removed the digital menu masthead text and stopped rendering the category description twice | ~600 |
| 15:25 | planned /masa to /table routing consolidation | plan.md, src/app/[locale]/table, src/app/masa | plan saved with canonical route, redirect, locale, robots, validation steps | ~1800 |
| 15:26 | recorded routing cleanup decision | .wolf/cerebrum.md | decision log updated for canonical table QR route plan | ~80 |
| 15:32 | implemented /masa to /table routing migration | MasaClient.tsx, table/page.jsx, masa/page.tsx, robots.ts, TableClient.jsx | canonical table route now renders Masa client and legacy masa redirects | ~1200 |
| 15:33 | fixed encoded beverage image URLs | src/app/_lib/menuCategoryImages.ts | raw image loading now supports folder name with ampersand | ~80 |
| 15:36 | made image cards category-specific | menuCategoryImages.ts, MasaClient.tsx, menu-image-gaps.json | active category now controls all card images and missing photo backlog created | ~1500 |
| 15:38 | verified hot-drink card scope | screenshots/table-masa-category-cards-viewport.png | active hot-drinks route shows only hot-drink card images | ~150 |
| 15:39 | attempted salad drawer verification | browser snapshot | drawer ref changed before click, retrying with role selector | ~80 |
| 15:40 | verified salad card scope | browser table route | Salati category rendered only salad card image alts: Shopska, Deliorman, Greek | ~100 |
| 15:50 | translated QR table chrome and category labels | src/app/masa/MasaClient.tsx, public/data/menu.json | Added localized masthead labels and filled missing en/tr category titles/descriptions | ~1200 |
| 16:14 | swapped hero strip to venue photos | src/app/_lib/menuCategoryImages.ts | Hero slider now uses indoor/outdoor restaurant photos instead of dish images | ~300 |
| 16:16 | translated image card titles and notes | src/app/_lib/menuCategoryImages.ts, src/app/masa/MasaClient.tsx | Card labels now follow the active locale in the QR/table menu | ~900 |
| 16:21 | added footer portfolio credit | src/app/masa/MasaClient.tsx, table.module.scss | Footer now includes a Powered by Melih Hyusein external link styled to match the newspaper footer | ~500 |
| 16:23 | fixed translated card text overflow | src/app/[locale]/table/table.module.scss | Smaller card typography plus wrapping/hyphenation keeps long labels inside the cards | ~500 |

## Session: 2026-06-02 18:14

| Time | Action | File(s) | Outcome | ~Tokens |
|------|--------|---------|---------|--------|
| 18:14 | rebuilt QR wizard with tag engine + adaptive flow + NLU | src/app/masa/MasaTasteWizard.tsx, src/app/masa/wizard/*, src/app/masa/masaTranslations.ts, tests/unit/wizard/*, package.json, src/app/[locale]/table/table.module.scss, .wolf/anatomy.md, .wolf/memory.md | 1077-line keyword wizard replaced with 9-file tag-driven engine (scoring, pairings, rationale, adaptive state, multilingual lexicon NLU + lazy semantic stub); 3-4 questions instead of 6, free-text input, result shows main+alternatives+rationale chips+combo+refine; all strings via t() in 3 locales; 35/35 unit tests pass, tsc clean, build succeeds | ~15000 |
| 18:52 | updated OpenWolf memory, anatomy, and cerebrum for new wizard files | .wolf/memory.md, .wolf/anatomy.md, .wolf/cerebrum.md | Documented new wizard subdirectory, unit tests directory, 7 new key learnings and 2 decision-log entries; added timestamp | ~600 |
| 14:59 | Edited next.config.js | 2→3 lines | ~31 |
| 15:00 | Edited src/middleware.js | 5→9 lines | ~59 |
| 15:00 | Edited src/middleware.js | added 1 condition(s) | ~46 |
| 15:00 | Edited src/app/[locale]/(pages)/menu/page.jsx | added 1 import(s) | ~50 |
| 15:00 | Edited src/app/[locale]/(pages)/menu/page.jsx | 7→9 lines | ~76 |
| 15:01 | Edited src/app/api/feedback/route.ts | added 1 condition(s) | ~116 |
| 15:01 | Edited src/app/api/feedback/feedbackValidation.ts | 4→6 lines | ~70 |
| 15:02 | Edited src/app/_components/forms/FeedbackForm.jsx | CSS: website | ~40 |
| 15:02 | Edited src/app/_components/forms/FeedbackForm.jsx | CSS: website | ~35 |
| 15:02 | Edited src/app/_components/forms/FeedbackForm.jsx | CSS: website | ~84 |
| 15:02 | Edited src/app/_components/forms/FeedbackForm.jsx | expanded (+11 lines) | ~143 |
| 15:04 | Edited src/app/api/ai/menu-assistant/route.ts | "@library/client-ip" → "@library/clientIp" | ~14 |
| 15:05 | Edited src/app/api/qr/route.ts | "@library/client-ip" → "@library/clientIp" | ~14 |
| 15:05 | Edited src/app/api/qr/route.ts | inline fix | ~32 |
| 15:05 | Edited src/app/_components/menu/qr/QRMenuTool.jsx | 5→6 lines | ~62 |
