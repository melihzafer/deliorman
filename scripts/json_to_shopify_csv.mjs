import fs from 'node:fs';
import path from 'node:path';

const SHOPIFY_HEADERS = [
  'Handle',
  'Title',
  'Body (HTML)',
  'Vendor',
  'Type',
  'Tags',
  'Published',
  'Option1 Name',
  'Option1 Value',
  'Variant SKU',
  'Variant Grams',
  'Variant Inventory Tracker',
  'Variant Inventory Qty',
  'Variant Price',
  'Image Src',
];

function csvEscape(value) {
  const s = String(value ?? '');
  if (/[\r\n",]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

function writeCsv(filePath, rows) {
  const lines = [];
  lines.push(SHOPIFY_HEADERS.map(csvEscape).join(','));
  for (const row of rows) {
    lines.push(row.map(csvEscape).join(','));
  }
  fs.writeFileSync(filePath, lines.join('\r\n') + '\r\n', 'utf8');
}

function normalizeTitle(s) {
  return String(s ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('bg-BG');
}

function slugifyBgToHandle(value) {
  // Shopify handles are typically ascii. We'll transliterate Bulgarian Cyrillic -> Latin.
  const s = String(value ?? '').trim().toLocaleLowerCase('bg-BG');
  if (!s) return 'item';

  const map = {
    'а': 'a',
    'б': 'b',
    'в': 'v',
    'г': 'g',
    'д': 'd',
    'е': 'e',
    'ж': 'zh',
    'з': 'z',
    'и': 'i',
    'й': 'y',
    'к': 'k',
    'л': 'l',
    'м': 'm',
    'н': 'n',
    'о': 'o',
    'п': 'p',
    'р': 'r',
    'с': 's',
    'т': 't',
    'у': 'u',
    'ф': 'f',
    'х': 'h',
    'ц': 'ts',
    'ч': 'ch',
    'ш': 'sh',
    'щ': 'sht',
    'ъ': 'a',
    'ь': '',
    'ю': 'yu',
    'я': 'ya',
  };

  let out = '';
  for (const ch of s) {
    out += map[ch] ?? ch;
  }

  out = out
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return out || 'item';
}

function ensureUniqueHandle(base, used) {
  const count = used.get(base) ?? 0;
  used.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

function parsePrice(value) {
  if (value == null) return '';
  if (typeof value === 'number' && Number.isFinite(value)) return value.toFixed(2);
  const s = String(value).trim().replace(',', '.').replace(/[^0-9.]/g, '');
  if (!s) return '';
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n.toFixed(2) : '';
}

function asTags(...parts) {
  const clean = parts.map((p) => String(p ?? '').trim()).filter(Boolean);
  const seen = new Set();
  const out = [];
  for (const p of clean) {
    const key = p.toLocaleLowerCase('bg-BG');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out.join(', ');
}

function resolveImageSrc(imagePath, publicBaseUrl) {
  const p = String(imagePath ?? '').trim();
  if (!p) return '';
  if (/^https?:\/\//i.test(p)) return p;
  if (publicBaseUrl) return publicBaseUrl.replace(/\/+$/, '') + '/' + p.replace(/^\/+/, '');
  return p; // allow relative
}

function convertMenuJsonToRows(menu, opts) {
  const usedHandles = new Map();
  const rows = [];

  for (const cat of menu.categories ?? []) {
    const categoryName = String(cat?.name ?? '').trim();
    const categorySlug = String(cat?.slug ?? '').trim();

    for (const item of cat.items ?? []) {
      const title = String(item?.title ?? '').trim();
      if (!title) continue;

      const amount = String(item?.amount ?? '').trim();
      const option1Name = amount ? 'Размер' : 'Title';
      const option1Value = amount || 'Default Title';

      let body = String(item?.text ?? '').trim();
      if (!body) body = String(cat?.description ?? '').trim();

      const price = parsePrice(item?.price);

      const baseHandle = slugifyBgToHandle(amount ? `${title} ${amount}` : title);
      const handle = ensureUniqueHandle(baseHandle, usedHandles);

      // Keep SKU ASCII (Shopify-friendly)
      const sku = handle.replace(/-/g, '_').toUpperCase();

      const tags = asTags(categoryName, categorySlug);
      const imageSrc = resolveImageSrc(item?.image, opts.publicBaseUrl);

      rows.push([
        handle,
        title,
        body,
        opts.vendor,
        categoryName || 'Меню',
        tags,
        opts.published,
        option1Name,
        option1Value,
        sku,
        String(opts.grams),
        String(opts.inventoryTracker ?? ''),
        String(opts.inventoryQty),
        price,
        imageSrc,
      ]);
    }
  }

  return rows;
}

function parseArgs(argv) {
  const args = {
    input: path.join('src', 'data', 'menu.json'),
    output: 'shopify_import.csv',
    vendor: 'Делиорман',
    published: 'TRUE',
    inventoryTracker: '',
    inventoryQty: '0',
    grams: '0',
    publicBaseUrl: '',
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--input') args.input = argv[++i];
    else if (a === '--output') args.output = argv[++i];
    else if (a === '--vendor') args.vendor = argv[++i];
    else if (a === '--published') args.published = argv[++i];
    else if (a === '--inventory-tracker') args.inventoryTracker = argv[++i];
    else if (a === '--inventory-qty') args.inventoryQty = argv[++i];
    else if (a === '--grams') args.grams = argv[++i];
    else if (a === '--public-base-url') args.publicBaseUrl = argv[++i];
    else if (a === '--help' || a === '-h') args.help = true;
  }

  return args;
}

function printHelp() {
  console.log(`Usage: node scripts/json_to_shopify_csv.mjs [options]

Bulgarian-only exporter: reads src/data/menu.json and writes a Shopify products CSV.

Options:
  --input <path>           Input JSON (default: src/data/menu.json)
  --output <path>          Output CSV (default: shopify_import.csv)
  --vendor <text>          Vendor field (default: Делиорман)
  --published TRUE|FALSE   Published (default: TRUE)
  --inventory-tracker <t>  Variant Inventory Tracker (default: blank)
  --inventory-qty <n>      Variant Inventory Qty (default: 0)
  --grams <n>              Variant Grams (default: 0)
  --public-base-url <url>  Prefix for relative image paths
`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const repoRoot = path.resolve(process.cwd());
  const inputPath = path.isAbsolute(args.input) ? args.input : path.join(repoRoot, args.input);
  const outputPath = path.isAbsolute(args.output) ? args.output : path.join(repoRoot, args.output);

  const raw = fs.readFileSync(inputPath, 'utf8');
  const menu = JSON.parse(raw);

  const rows = convertMenuJsonToRows(menu, args);
  writeCsv(outputPath, rows);

  console.log(`Wrote ${rows.length} rows to ${path.relative(repoRoot, outputPath)}`);
}

main();

