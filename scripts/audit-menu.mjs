import fs from 'node:fs';
import path from 'node:path';

function normalizeTitle(s) {
  return String(s ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('bg-BG');
}

function levenshtein(a, b) {
  a = String(a);
  b = String(b);
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

const repoRoot = path.resolve(process.cwd());
const menuPath = path.join(repoRoot, 'src', 'data', 'menu.json');

const raw = fs.readFileSync(menuPath, 'utf8');
let menu;
try {
  menu = JSON.parse(raw);
} catch (e) {
  console.error(`Invalid JSON: ${menuPath}`);
  console.error(e);
  process.exit(1);
}

const items = [];
for (const cat of menu.categories ?? []) {
  for (const item of cat.items ?? []) {
    items.push({
      category: cat.name,
      slug: cat.slug,
      title: item.title,
      amount: item.amount,
      price: item.price,
      text: item.text,
    });
  }
}

const problems = [];

// Duplicate titles
const byNorm = new Map();
for (const it of items) {
  const norm = normalizeTitle(it.title);
  if (!norm) continue;
  const arr = byNorm.get(norm) ?? [];
  arr.push(it);
  byNorm.set(norm, arr);
}
for (const [norm, arr] of byNorm.entries()) {
  if (arr.length > 1) {
    problems.push({
      type: 'DUPLICATE_TITLE',
      title: arr[0].title,
      norm,
      occurrences: arr.map((x) => `${x.category} -> ${x.title}`),
    });
  }
}

// Suspicious formatting
for (const it of items) {
  if (typeof it.title === 'string') {
    if (/\s{2,}/.test(it.title)) {
      problems.push({ type: 'DOUBLE_SPACES_IN_TITLE', where: `${it.category} -> ${it.title}` });
    }
    if (/\.$/.test(it.title.trim())) {
      problems.push({ type: 'TITLE_ENDS_WITH_DOT', where: `${it.category} -> ${it.title}` });
    }
  }
  if (typeof it.amount === 'string') {
    if (/\s{2,}/.test(it.amount)) {
      problems.push({ type: 'DOUBLE_SPACES_IN_AMOUNT', where: `${it.category} -> ${it.title}`, amount: it.amount });
    }
    if (/\bml\b/i.test(it.amount) && /\bg\b/i.test(it.amount)) {
      problems.push({ type: 'MIXED_UNITS', where: `${it.category} -> ${it.title}`, amount: it.amount });
    }
  }
  if (typeof it.text === 'string') {
    if (/\s{2,}/.test(it.text)) {
      problems.push({ type: 'DOUBLE_SPACES_IN_TEXT', where: `${it.category} -> ${it.title}` });
    }
  }
}

// Near-duplicate titles (typo detector) within same category
for (const cat of menu.categories ?? []) {
  const catItems = (cat.items ?? []).map((x) => x.title).filter(Boolean);
  for (let i = 0; i < catItems.length; i++) {
    for (let j = i + 1; j < catItems.length; j++) {
      const a = normalizeTitle(catItems[i]);
      const b = normalizeTitle(catItems[j]);
      if (!a || !b) continue;
      if (Math.abs(a.length - b.length) > 3) continue;
      const dist = levenshtein(a, b);
      if (dist === 1) {
        problems.push({
          type: 'NEAR_DUPLICATE_TITLE_SAME_CATEGORY',
          category: cat.name,
          a: catItems[i],
          b: catItems[j],
          dist,
        });
      }
    }
  }
}

// Quick keyword checks for "Latte"
const hasLatte = items.some((it) => normalizeTitle(it.title).includes('латте') || normalizeTitle(it.title).includes('latte'));

const summary = {
  menuPath: path.relative(repoRoot, menuPath),
  categories: (menu.categories ?? []).length,
  items: items.length,
  hasLatte,
  problemsCount: problems.length,
};

console.log(JSON.stringify({ summary, problems }, null, 2));

if (problems.length) process.exitCode = 2;

