/* global console, process, URL */
const secret = process.env.VIP_MENU_SECRET;
const baseUrl = process.env.QR_MENU_BASE_URL || 'https://restorantdeliorman.com';
const langArg = process.argv.find((arg) => arg.startsWith('--lang='));
const lang = langArg ? langArg.split('=')[1] : '';

if (!secret || secret.length < 24) {
  console.error('VIP_MENU_SECRET must be set and at least 24 characters long.');
  process.exit(1);
}

if (lang && !['bg', 'tr', 'en'].includes(lang)) {
  console.error('Invalid --lang value. Use one of: bg, tr, en.');
  process.exit(1);
}

const url = new URL('/masa', baseUrl);
url.searchParams.set('vip', secret);
if (lang) url.searchParams.set('lang', lang);

console.log(url.toString());
