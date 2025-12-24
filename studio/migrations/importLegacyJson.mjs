import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {createClient} from '@sanity/client';

// Load env from studio/.env(.local) when running migrations directly.
import 'dotenv/config';

// --- CONFIGURATION & HELPERS ---

function parseArgs(argv) {
  const args = {
    projectId: process.env.SANITY_PROJECT_ID || '',
    dataset: process.env.SANITY_DATASET || 'production',
    token: process.env.SANITY_TOKEN || '',
    apiVersion: process.env.SANITY_API_VERSION || '2025-01-01',
    dryRun: false,
    replace: false,
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

const cyrillicToLatinMap = {
  '\u0430': 'a', '\u0431': 'b', '\u0432': 'v', '\u0433': 'g', '\u0434': 'd', '\u0435': 'e', '\u0436': 'zh',
  '\u0437': 'z', '\u0438': 'i', '\u0439': 'y', '\u043a': 'k', '\u043b': 'l', '\u043c': 'm', '\u043d': 'n',
  '\u043e': 'o', '\u043f': 'p', '\u0440': 'r', '\u0441': 's', '\u0442': 't', '\u0443': 'u', '\u0444': 'f',
  '\u0445': 'h', '\u0446': 'ts', '\u0447': 'ch', '\u0448': 'sh', '\u0449': 'sht', '\u044a': 'a', '\u044c': 'y',
  '\u044e': 'yu', '\u044f': 'ya',
};

function slugify(value) {
  const text = String(value ?? '').trim().toLowerCase();

  // 1) Transliterate BG -> LAT
  const latinized = text
    .split('')
    .map((ch) => {
      if (ch === ' ') return '-';
      return cyrillicToLatinMap[ch] || ch;
    })
    .join('');

  // 2) Keep only a-z, 0-9 and hyphen
  return (
    latinized
      .normalize('NFKD')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 80) || 'item'
  );
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

// --- ID GENERATION & UNIQUENESS ---

function ensureUniqueId(baseId, usedSet) {
  let id = baseId;
  let counter = 2;
  while (usedSet.has(id)) {
    id = `${baseId}__${counter}`;
    counter++;
  }
  usedSet.add(id);
  // Sanity hard limit: 128 chars
  return id.length > 128 ? id.slice(0, 128) : id;
}

function menuItemId(categoryName, title, price, amount, usedSet) {
  const base = `menuItem.${slugify(categoryName)}.${slugify(title)}.${String(price ?? 'na')}.${slugify(amount ?? '')}`;
  return ensureUniqueId(base, usedSet);
}

function ctaId(sourceFile, headline, usedSet) {
  const base = `callToAction.${slugify(path.basename(sourceFile, path.extname(sourceFile)))}.${slugify(headline)}`;
  return ensureUniqueId(base, usedSet);
}

function promoId(title, usedSet) {
  const base = `promo.${slugify(title)}`;
  return ensureUniqueId(base, usedSet);
}

// --- DB OPERATIONS ---

async function upsert(client, doc, opts) {
  const {dryRun, replace} = opts;
  if (dryRun) {
    console.log(`[DRY RUN] Would create/update: ${doc._id} (${doc._type})`);
    return {dryRun: true, _id: doc._id, _type: doc._type};
  }
  if (replace) return client.createOrReplace(doc);
  return client.createIfNotExists(doc);
}

function resolveLocalOrUrl(repoRoot, maybeUrl) {
  const p = String(maybeUrl ?? '').trim();
  if (!p) return null;
  if (/^https?:\/\//i.test(p)) return {type: 'url', value: p};

  const normalized = p.startsWith('/') ? p.slice(1) : p;
  const local = path.join(repoRoot, 'public', normalized);
  if (fs.existsSync(local)) return {type: 'file', value: local};

  return null;
}

async function uploadImageAsset(client, repoRoot, imageUrlOrPath, opts) {
  if (opts?.dryRun) return null;
  const resolved = resolveLocalOrUrl(repoRoot, imageUrlOrPath);
  if (!resolved) return null;
  if (resolved.type === 'url') return null;

  const filePath = resolved.value;
  const stream = fs.createReadStream(filePath);
  const filename = path.basename(filePath);
  return client.assets.upload('image', stream, {filename});
}

// --- IMPORT FUNCTIONS ---

async function importMenuItems(client, opts, repoRoot, menuPath, usedSet) {
  const menu = JSON.parse(fs.readFileSync(menuPath, 'utf8'));
  const mutations = [];

  for (const cat of menu.categories ?? []) {
    const categoryName = String(cat?.name ?? '').trim();
    for (const item of cat.items ?? []) {
      const title = String(item?.title ?? '').trim();
      if (!title) continue;

      const price = parsePrice(item?.price);
      if (price == null) continue;

      const amount = String(item?.amount ?? '').trim();
      const text = String(item?.text ?? '').trim();

      mutations.push({
        _id: menuItemId(categoryName, title, price, amount, usedSet),
        _type: 'menuItem',
        title,
        price,
        weight: amount,
        description: text,
        category: categoryName,
      });
    }
  }

  for (const doc of mutations) {
    await upsert(client, doc, opts);
  }
  return {count: mutations.length};
}

async function importSpecialtiesAsMenuItems(client, opts, repoRoot, specialtiesPath, usedSet) {
  const data = JSON.parse(fs.readFileSync(specialtiesPath, 'utf8'));
  const mutations = [];

  for (const cat of data.categories ?? []) {
    const categoryName = String(cat?.name ?? '').trim();
    for (const item of cat.items ?? []) {
      const title = String(item?.title ?? '').trim();
      if (!title) continue;

      const price = parsePrice(item?.price);
      if (price == null) continue;

      const weight = String(item?.weight ?? '').trim();
      const text = String(item?.text ?? '').trim();

      mutations.push({
        _id: menuItemId(categoryName, title, price, weight, usedSet),
        _type: 'menuItem',
        title,
        price,
        weight,
        description: text,
        category: categoryName,
      });
    }
  }

  for (const doc of mutations) {
    await upsert(client, doc, opts);
  }
  return {count: mutations.length};
}

async function importCtasAsCards(client, opts, repoRoot, jsonPaths, usedSet) {
  const created = [];

  for (const relPath of jsonPaths) {
    const filePath = path.join(repoRoot, relPath);
    if (!fs.existsSync(filePath)) continue;

    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const headline = stripHtmlBreaks(raw.title || raw.headline || raw.subtitle || '');
    if (!headline) continue;

    const subtext = stripHtmlBreaks(raw.description || raw.subtext || '');
    const linkUrl = raw?.button?.link || raw?.button1?.link || raw?.button2?.link || '/';

    const doc = {
      _id: ctaId(relPath, headline, usedSet),
      _type: 'callToAction',
      headline,
      subtext,
      linkUrl,
    };

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

    created.push(await upsert(client, doc, opts));
  }

  return {count: created.length};
}

async function importPromos(client, opts, repoRoot, promosPath, usedSet) {
  const data = JSON.parse(fs.readFileSync(promosPath, 'utf8'));
  const created = [];

  for (const slide of data.slides ?? []) {
    const title = stripHtmlBreaks(slide.title || slide.subtitle || '');
    if (!title) continue;

    const description = stripHtmlBreaks(slide.description || '');

    const doc = {
      _id: promoId(title, usedSet),
      _type: 'promo',
      title,
      description,
    };

    // Add features if present
    if (slide.features && Array.isArray(slide.features)) {
      doc.features = slide.features.map(f => ({
        _type: 'object',
        icon: f.icon || '',
        title: f.title || '',
        text: f.text || '',
      }));
    }

    // Add button config if present
    if (slide.button) {
      doc.buttonLink = slide.button.link || '/menu';
      doc.buttonLabel = slide.button.label || 'Вижте менюто';
    }

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

    created.push(await upsert(client, doc, opts));
  }

  return {count: created.length};
}

// --- MAIN ---

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const opts = {dryRun: args.dryRun, replace: args.replace};

  // Accept credentials from either CLI flags or environment variables.
  // parseArgs already defaults to env, so here we only validate presence.
  if (!opts.dryRun && (!args.projectId || !args.dataset || !args.token)) {
    console.error('Missing required configuration for Sanity import.');
    console.error('Provide via flags: --projectId <ID> --dataset <DATASET> --token <TOKEN>');
    console.error('or via environment: SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN');
    process.exit(1);
  }

  const repoRoot = path.resolve(process.cwd(), '..');

  const client = opts.dryRun
    ? null
    : createClient({
        projectId: args.projectId,
        dataset: args.dataset,
        apiVersion: args.apiVersion,
        token: args.token,
        useCdn: false,
      });

  const menuPath = path.join(repoRoot, args.menuJson);
  const specialtiesPath = path.join(repoRoot, args.specialtiesJson);
  const promosPath = path.join(repoRoot, args.promosJson);

  // GLOBAL SETS to prevent ID collisions across files
  const used = {
    menuItem: new Set(),
    cta: new Set(),
    promo: new Set(),
  };

  console.log('--- STARTING IMPORT ---');
  console.log(`Target: projectId=${args.projectId} dataset=${args.dataset} dryRun=${opts.dryRun} replace=${opts.replace}`);

  console.log('Importing menu items…');
  const menuRes = await importMenuItems(client, opts, repoRoot, menuPath, used.menuItem);
  console.log(` -> Imported ${menuRes.count} menu items`);

  console.log('Importing specialties as menu items…');
  const specRes = await importSpecialtiesAsMenuItems(client, opts, repoRoot, specialtiesPath, used.menuItem);
  console.log(` -> Imported ${specRes.count} specialties`);

  console.log('Importing CTAs/cards…');
  const ctaRes = await importCtasAsCards(client, opts, repoRoot, args.ctaJsons, used.cta);
  console.log(` -> Imported ${ctaRes.count} cards`);

  console.log('Importing promos…');
  const promoRes = await importPromos(client, opts, repoRoot, promosPath, used.promo);
  console.log(` -> Imported ${promoRes.count} promos`);

  console.log('--- DONE ---');
}

main().catch((err) => {
  console.error('Fatal Error:', err);
  process.exit(1);
});

