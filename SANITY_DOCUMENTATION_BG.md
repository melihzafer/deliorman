# Sanity документация (за този проект)

Тази документация обяснява **как работи Sanity** в проекта `deliorman` (Next.js), как да добавяш/редактираш съдържание, как да качваш снимки, как да добавиш нов „тип съдържание“ (schema/„таблица“), и как/къде се хоства.

---

## 1) Какво е Sanity?
Sanity е **headless CMS** (Content Management System).

- **Данните** се пазят в Sanity (в dataset – напр. `production`).
- **Админ панелът (dashboard)** е Sanity Studio – уеб приложение за редакция.
- **Сайтът** (Next.js) чете данните чрез API (GROQ заявки).

Важно: Sanity не е „таблична база“ като SQL. То е **документна база** (documents), но често ще го чувате като „таблици“. В Sanity това са **Document Types (schemas)**.

---

## 2) Как е вързан Sanity в този repo?
В repo-то има **две Studio конфигурации**:

### A) Embedded Studio вътре в Next.js (route `/studio`)
- Конфиг: `sanity.config.ts`
- Студиото е монтирано на `/studio` чрез Next route: `src/app/studio/[[...tool]]/page.tsx`
- В момента **schemas за embedded Studio** се четат от: `src/sanity/schemaTypes`.

⚠️ Забележка (важно): `src/sanity/schemaTypes/index.ts` в момента е с `types: []` (празно). Тоест embedded Studio няма да показва content types, докато не се „прехвърлят“ схемите.

### B) Standalone Studio в папка `studio/` (препоръчано за админ/екип)
- Конфиг: `studio/sanity.config.ts`
- Schemas: `studio/schemaTypes/*`
- Това Studio е „истинският“ източник на схемите в проекта в момента.

---

## 3) Трябва ли Sanity да се хоства?
**Данните НЕ се хостват от вас** – те са в Sanity Cloud (във вашия project/dataset).

Sanity Studio (админ панелът) може да се ползва по 2 начина:

### Вариант 1: Starтирано локално (за редакция)
- Стартираш Studio на компютъра си и редактираш.

### Вариант 2: Деплойнато Studio (за екип/админи)
- Деплойваш Studio като статичен сайт (Sanity го хоства) или го качваш към твоя хостинг.

Допълнително:
- Ако ползваш **embedded Studio**, то се „хоства“ заедно с Next.js сайта.

---

## 4) Как да стартирам Studio (dashboard) в този проект?

### Option B (Standalone `studio/`) – препоръчано
1) Създай `studio/.env` от `studio/.env.example` и попълни стойностите.
2) Стартирай Studio:

```powershell
cd D:\Projects\Web\deliorman\studio
npm install
npm run dev
```

Обикновено Studio тръгва на `http://localhost:3333`.

### Option A (Embedded `/studio` в Next app)
1) Увери се, че има настроени env променливи за Next app:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
   (виж `src/sanity/env.ts`)
2) Стартирай Next:

```powershell
cd D:\Projects\Web\deliorman
npm install
npm run dev
```

После отвори: `http://localhost:3000/studio`

⚠️ Ако не виждаш типове съдържание, причината е в `src/sanity/schemaTypes/index.ts` (празно `types: []`).

---

## 5) Как се вкарват данни в Sanity?
Има 3 основни начина:

### 5.1) Ръчно през Studio (най-често)
- Влизаш в Studio
- Отваряш „Content“
- Избираш тип (напр. `promo`)
- „Create new“
- Попълваш полета
- „Publish“

Sanity поддържа drafts (чернови) и published (публикувани версии).

### 5.2) Импорт/миграция със скрипт (repo-specific)
В този проект има импортър за legacy JSON:
- Скрипт: `studio/migrations/importLegacyJson.mjs`
- Команда (пример):

```powershell
cd D:\Projects\Web\deliorman\studio
# първо попълни SANITY_PROJECT_ID / SANITY_DATASET / SANITY_TOKEN в .env
npm run import:legacy -- --projectId <id> --dataset <dataset> --token <token>
```

Какво импортира (описано и в `studio/README.md`):
- `src/data/menu.json` → `menuItem`
- `src/data/specialties.json` → `menuItem`
- `src/data/sections/new-specialties-cta.json` → `promo`
- `src/data/sections/call-to-action*.json`, `hero.json`, `schedule.json` → `callToAction`

### 5.3) През API (advanced)
Може да пишеш към Sanity чрез server-side код + токен (write token). Това е полезно за интеграции, но обикновено за този сайт не е нужно.

---

## 6) Как се редактират данни?
Редакцията става през Studio:

1) Content → избираш document type (пример: `promo`)
2) Избираш конкретен документ
3) Редактираш полетата
4) Publish

Ако сайтът вече чете данните от Sanity, промените се виждат веднага (или след revalidation, ако има кеширане).

---

## 7) Как да кача нови снимки?
В Sanity изображенията се качват през полета от тип `image`.

Примери от този проект:
- `promo.image`
- `blogPost.mainImage`
- `callToAction.backgroundImage`

Стъпки:
1) В Studio отвори документа
2) Намери полето за снимка
3) Upload (или drag & drop)
4) Publish

➡️ В кода картинките се рендират чрез Sanity image pipeline (URL builder). В проекта това се прави с helper `urlFor(...)`.

---

## 8) Как да добавя „нова таблица“ (нов тип съдържание / schema)?
В Sanity „таблица“ = **document type**.

### (Препоръчано) Ако ползваш standalone Studio
1) Създай нов файл в `studio/schemaTypes/`, напр. `event.ts`
2) Дефинирай schema (тип + полета)
3) Регистрирай schema в `studio/schemaTypes/index.ts`:
   - добави import и го включи в масива `schemaTypes`
4) Рестартирай Studio

### След това: вържи го към сайта
1) Добави GROQ заявка в `src/lib/sanity.queries.ts`
2) Използвай query-то в API route или компонент (next-sanity client)

⚠️ Ако използваш embedded Studio (`/studio`), трябва да синхронизираш schemas и в `src/sanity/schemaTypes/`.

---

## 9) Какви данни мога да вкарам в Sanity?
Sanity поддържа много типове полета. Най-честите:

- `string` – кратък текст
- `text` – дълъг текст
- `number` – число
- `boolean` – Да/Не
- `date` / `datetime` – дата/час
- `url` – линк
- `slug` – SEO-friendly адрес
- `image` – снимка (с crop/hotspot)
- `array` – списък (напр. features[])
- `object` – вложена структура
- Portable Text (`array` от `block`) – rich text (пример: `blogPost.body`)

---

## 10) Как сайтът чете данните? (GROQ)
Заявките са в `src/lib/sanity.queries.ts`.

Примери:
- `MENU_ITEMS_QUERY` – всички `menuItem`, сортирани по `category` и `title`
- `ACTIVE_PROMOS_QUERY` – всички `promo`
- `CTA_QUERY` – последните `callToAction`

---

## 11) Практически workflow (препоръка)
1) Редактираш съдържание в Studio (standalone `studio/`)
2) Публикуваш (Publish)
3) Проверяваш сайта дали показва новите данни

---

## 12) Чести проблеми
### Не виждам типове съдържание в `/studio`
Причина: embedded Studio ползва `src/sanity/schemaTypes`, а там `types: []`.

Решение:
- Ползвай `studio/` Studio за редакция (препоръчано), или
- Уеднакви схемите (копирай/сподели schemaTypes и за embedded Studio).

### Снимките не се появяват
Провери:
- дали документът е Publish-нат
- дали в полето `image` има upload
- дали front-end компонентът използва `urlFor(image)`

---

## 13) Бързи линкове (файлове в repo)
- Standalone Studio config: `studio/sanity.config.ts`
- Schemas: `studio/schemaTypes/*`
- Embedded Studio config: `sanity.config.ts`
- Next env за Sanity: `src/sanity/env.ts`
- GROQ заявки: `src/lib/sanity.queries.ts`
- Legacy importer: `studio/migrations/importLegacyJson.mjs`

