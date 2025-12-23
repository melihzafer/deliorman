// Import legacy JSON from the Next.js repo into Sanity.
//
// Usage (from /studio):
//   node migrations/importLegacyJson.mjs --projectId <id> --dataset <dataset> --token <token>
//
// Notes:
// - menuItem is STRICT text-only: no images are ever included.
// - promo/callToAction can import images by URL (relative paths are treated as local files under ../public).

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {createClient} from '@sanity/client';

function parseArgs(argv) {
  const args = {
    projectId: process.env.SANITY_PROJECT_ID || '',
    dataset: process.env.SANITY_DATASET || 'production',
    token: process.env.SANITY_TOKEN || '',
    apiVersion: process.env.SANITY_API_VERSION || '2025-01-01',
    dryRun: false,
    replace: false,
    // Paths relative to repo root
    menuJson: path.join('src', 'data', 'menu.json'),
    specialtiesJson: path.join('src', 'data', 'specialties.json'),
    ctaJsons: [
      path.join('src', 'data', 'sections', 'call-to-action.json'),
      path.join('src', 'data', 'sections', 'call-to-action-2.json'),
      path.join('src', 'data', 'sections', 'call-to-action-3.json'),
      path.join('src', 'data', 'sections', 'call-to-action-4.json'),
      path.join('src', 'data', 'sections', 'hero.json'),
      path.join('src', 'data', 'sections', 'schedule.json'),
    ],
    promosJson: path.join('src', 'data', 'sections', 'new-specialties-cta.json'),
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--projectId') args.projectId = argv[++i];
    else if (a === '--dataset') args.dataset = argv[++i];
    else if (a === '--token') args.token = argv[++i];
    else if (a === '--apiVersion') args.apiVersion = argv[++i];
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--replace') args.replace = true;
  }
  return args;
}

function stripHtmlBreaks(s) {
  return String(s ?? '')
    .replace(/<\s*br\s*\/?>/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value) {
  return String(value ?? '')
    .trim()
    .toLocaleLowerCase('bg-BG')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\u0400-\u04FF]+/gi, '-') // keep cyrillic too for ids if needed
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80) || 'item';
}

function parsePrice(value) {
  if (value == null) return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const s = String(value).trim().replace(',', '.');
  const cleaned = s.replace(/[^0-9.]/g, '');
  if (!cleaned) return null;
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

function resolveLocalOrUrl(repoRoot, maybeUrl) {
  const p = String(maybeUrl ?? '').trim();
  if (!p) return null;
  if (/^https?:\/\//i.test(p)) return {type: 'url', value: p};

  // treat as local file under repoRoot/public
  const normalized = p.startsWith('/') ? p.slice(1) : p;
  const local = path.join(repoRoot, 'public', normalized);
  if (fs.existsSync(local)) return {type: 'file', value: local};

  return null;
}

async function uploadImageAsset(client, repoRoot, imageUrlOrPath, opts) {
  if (opts?.dryRun) return null;
  const resolved = resolveLocalOrUrl(repoRoot, imageUrlOrPath);
  if (!resolved) return null;

  if (resolved.type === 'url') {
    // No network fetch here. For URL import, prefer downloading manually or extend script.
    return null;
  }

  const filePath = resolved.value;
  const stream = fs.createReadStream(filePath);
  const filename = path.basename(filePath);
  return client.assets.upload('image', stream, {filename});
}

function menuItemId(categoryName, title, price, amount) {
  // Deterministic IDs so reruns are idempotent.
  return `menuItem.${slugify(categoryName)}.${slugify(title)}.${String(price ?? 'na')}.${slugify(amount ?? '')}`;
}

function ctaId(sourceFile, headline) {
  return `callToAction.${slugify(path.basename(sourceFile, path.extname(sourceFile)))}.${slugify(headline)}`;
}

function promoId(title) {
  return `promo.${slugify(title)}`;
}

async function upsert(client, doc, opts) {
  const {dryRun, replace} = opts;
  if (dryRun) return {dryRun: true, _id: doc._id, _type: doc._type};
  if (replace) {
    return client.createOrReplace(doc);
  }
  return client.createIfNotExists(doc);
}

async function upsertMany(client, docs, opts, {chunkSize = 100} = {}) {
  const results = [];
  for (let i = 0; i < docs.length; i += chunkSize) {
    const chunk = docs.slice(i, i + chunkSize);
    // keeping it simple/explicit (one-by-one) to reduce risk of transaction limits
    for (const doc of chunk) {
      results.push(await upsert(client, doc, opts));
    }
  }
  return results;
}

async function importMenuItems(client, menuPath, opts) {
  const menu = JSON.parse(fs.readFileSync(menuPath, 'utf8'));
  const docs = [];

  for (const cat of menu.categories ?? []) {
    const categoryName = String(cat?.name ?? '').trim();
    for (const item of cat.items ?? []) {
      const title = String(item?.title ?? '').trim();
      if (!title) continue;

      const price = parsePrice(item?.price);
      if (price == null) continue;

      const amount = String(item?.amount ?? '').trim();
      const text = String(item?.text ?? '').trim();

      // menuItem is text-only; we preserve `amount` by prefixing the description.
      const description = [amount ? `${amount} —` : '', text].filter(Boolean).join(' ').trim();

      docs.push({
        _id: menuItemId(categoryName, title, price, amount),
        _type: 'menuItem',
        title,
        price,
        description,
        category: categoryName,
      });
    }
  }

  await upsertMany(client, docs, opts);
  return {count: docs.length};
}

async function importSpecialtiesAsMenuItems(client, specialtiesPath, opts) {
  const data = JSON.parse(fs.readFileSync(specialtiesPath, 'utf8'));
  const docs = [];

  for (const cat of data.categories ?? []) {
    const categoryName = String(cat?.name ?? '').trim();
    for (const item of cat.items ?? []) {
      const title = String(item?.title ?? '').trim();
      if (!title) continue;

      const price = parsePrice(item?.price);
      if (price == null) continue;

      const weight = String(item?.weight ?? '').trim();
      const text = String(item?.text ?? '').trim();
      const description = [weight ? `${weight} —` : '', text].filter(Boolean).join(' ').trim();

      docs.push({
        _id: menuItemId(categoryName, title, price, weight),
        _type: 'menuItem',
        title,
        price,
        description,
        category: categoryName,
      });
    }
  }

  await upsertMany(client, docs, opts);
  return {count: docs.length};
}

async function importCtasAsCards(client, repoRoot, jsonPaths, opts) {
  const docs = [];

  for (const relPath of jsonPaths) {
    const filePath = path.join(repoRoot, relPath);
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const headline = stripHtmlBreaks(raw.title || raw.headline || raw.subtitle || '');
    if (!headline) continue;

    const subtext = stripHtmlBreaks(raw.description || raw.subtext || '');
    const linkUrl = raw?.button?.link || raw?.button1?.link || raw?.button2?.link || '/';

    const doc = {
      _id: ctaId(relPath, headline),
      _type: 'callToAction',
      headline,
      subtext,
      linkUrl,
    };

    // Optional background image
    const imageUrl = raw?.image?.url;
    if (imageUrl) {
      const asset = await uploadImageAsset(client, repoRoot, imageUrl, opts);
      if (asset) {
        doc.backgroundImage = {
          _type: 'image',
          asset: {_type: 'reference', _ref: asset._id},
        };
      }
    }

    docs.push(doc);
  }

  await upsertMany(client, docs, opts);
  return {count: docs.length};
}

async function importPromos(client, repoRoot, promosPath, opts) {
  const data = JSON.parse(fs.readFileSync(promosPath, 'utf8'));
  const docs = [];

  for (const slide of data.slides ?? []) {
    const title = stripHtmlBreaks(slide.title || slide.subtitle || '');
    if (!title) continue;

    const description = stripHtmlBreaks(slide.description || '');

    const doc = {
      _id: promoId(title),
      _type: 'promo',
      title,
      description,
      // Option C: no dates from JSON. Leave startDate/endDate empty.
    };

    const imageUrl = slide?.image?.url;
    if (imageUrl) {
      const asset = await uploadImageAsset(client, repoRoot, imageUrl, opts);
      if (asset) {
        doc.image = {
          _type: 'image',
          asset: {_type: 'reference', _ref: asset._id},
        };
      }
    }

    if (!opts?.dryRun && !doc.image) continue;

    docs.push(doc);
  }

  await upsertMany(client, docs, opts);
  return {count: docs.length};
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const opts = {dryRun: args.dryRun, replace: args.replace};
  const repoRoot = path.resolve(process.cwd(), '..'); // running from /studio

  const menuPath = path.join(repoRoot, args.menuJson);
  const specialtiesPath = path.join(repoRoot, args.specialtiesJson);
  const promosPath = path.join(repoRoot, args.promosJson);

  // DRY-RUN: fully offline. Parse + count only, no Sanity client, no uploads.
  if (opts.dryRun) {
    // Minimal stub client object (never used due to opts.dryRun in upsert/uploadImageAsset)
    const client = {};

    console.log('Importing menu items…');
    console.log(await importMenuItems(client, menuPath, opts));

    console.log('Importing specialties as menu items…');
    console.log(await importSpecialtiesAsMenuItems(client, specialtiesPath, opts));

    console.log('Importing CTAs/cards…');
    console.log(await importCtasAsCards(client, repoRoot, args.ctaJsons, opts));

    console.log('Importing promos…');
    console.log(await importPromos(client, repoRoot, promosPath, opts));

    console.log('Done (dry-run)');
    return;
  }

  if (!args.projectId || !args.dataset || !args.token) {
    console.error(
      'Missing required args: --projectId, --dataset, --token (or env SANITY_PROJECT_ID/SANITY_DATASET/SANITY_TOKEN)'
    );
    process.exit(1);
  }

  const client = createClient({
    projectId: args.projectId,
    dataset: args.dataset,
    apiVersion: args.apiVersion,
    token: args.token,
    useCdn: false,
  });

  console.log('Importing menu items…');
  console.log(await importMenuItems(client, menuPath, opts));

  console.log('Importing specialties as menu items…');
  console.log(await importSpecialtiesAsMenuItems(client, specialtiesPath, opts));

  console.log('Importing CTAs/cards…');
  console.log(await importCtasAsCards(client, repoRoot, args.ctaJsons, opts));

  console.log('Importing promos…');
  console.log(await importPromos(client, repoRoot, promosPath, opts));

  console.log('Done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
