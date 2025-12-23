# Sanity Studio (Content Backend)

This folder contains a minimal **Sanity Studio** setup + schemas + importer to migrate the legacy JSON from the Next.js repo.

## Document types (strict)
- `menuItem`: text-only. Fields: `title`, `price` (number), `description` (text), `category` (string/select). **No images allowed.**
- `promo`: fields: `title`, `description`, `image` (hotspot), `startDate` (date), `endDate` (date)
- `blogPost`: fields: `title`, `slug`, `mainImage`, `body` (Portable Text), `publishedAt` (datetime)
- `callToAction` (card): fields: `headline`, `subtext`, `linkUrl`, `backgroundImage`

## Setup
1) Install dependencies in this folder.
2) Create a `.env` (copy from `.env.example`) and set the project + dataset.

## Run Studio
```powershell
cd D:\Projects\Web\deliorman\studio
npm install
npm run dev
```

## Migration (legacy JSON → Sanity)
The importer lives at `migrations/importLegacyJson.mjs`.

It imports:
- `src/data/menu.json` → `menuItem`
- `src/data/specialties.json` → `menuItem`
- `src/data/sections/new-specialties-cta.json` → `promo` (date fields left empty)
- `src/data/sections/call-to-action*.json`, `hero.json`, `schedule.json` → `callToAction`

Notes:
- `menuItem` remains **text-only**; legacy `amount/weight` is preserved by prefixing `description`.
- Images are imported only if they exist as local files under `../public/...`.

```powershell
cd D:\Projects\Web\deliorman\studio
# set SANITY_PROJECT_ID / SANITY_DATASET / SANITY_TOKEN in .env first
npm run import:legacy -- --projectId <id> --dataset <dataset> --token <token>
```
