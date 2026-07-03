import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = 'D:\\Projects\\Web\\deliorman\\screenshots';
const OUT_DIR = 'D:\\Projects\\Web\\deliorman\\screenshots\\mockups';

fs.mkdirSync(OUT_DIR, { recursive: true });

// ── iPhone 15 Pro frame ────────────────────────────────────
async function framePhone(inputBuf) {
  const meta = await sharp(inputBuf).metadata();
  const w = meta.width;
  const h = meta.height;
  const padX = 20, padY = 30, radius = 44;
  const frameW = w + padX * 2;
  const frameH = h + padY * 2;

  const notchW = 120, notchH = 28;
  const statusBarH = 48;

  const svg = `<svg width="${frameW}" height="${frameH}">
    <rect x="0" y="0" width="${frameW}" height="${frameH}" rx="${radius}" ry="${radius}" fill="#1a1a1a"/>
    <rect x="${padX}" y="${padY}" width="${w}" height="${h}" rx="0" ry="0" fill="#fff"/>
    <rect x="${(frameW - notchW) / 2}" y="${padY + 10}" width="${notchW}" height="${notchH}" rx="14" ry="14" fill="#1a1a1a"/>
    <rect x="${(frameW - 34) / 2}" y="${padY + frameH - padY - 14}" width="34" height="4" rx="2" ry="2" fill="#555"/>
  </svg>`;

  const composite = await sharp(inputBuf)
    .resize(w, h, { fit: 'inside' })
    .toBuffer();

  return sharp(Buffer.from(svg))
    .composite([{ input: composite, top: padY, left: padX }])
    .png()
    .toBuffer();
}

// ── MacBook Pro frame ───────────────────────────────────────
async function frameLaptop(inputBuf) {
  const meta = await sharp(inputBuf).metadata();
  let w = meta.width;
  let h = meta.height;

  const lidMarginX = 80, lidMarginTop = 40, lidMarginBottom = 30;
  const lidW = w + lidMarginX * 2;
  const lidH = h + lidMarginTop + lidMarginBottom;
  const baseH = 36, baseRadius = 12;
  const totalH = lidH + baseH;

  const screenRadius = 14;

  const svg = `<svg width="${lidW}" height="${totalH}">
    <defs>
      <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2c2c2c"/>
        <stop offset="100%" stop-color="#1a1a1a"/>
      </linearGradient>
    </defs>
    <!-- Lid -->
    <rect x="0" y="0" width="${lidW}" height="${lidH}" rx="${screenRadius + 4}" ry="${screenRadius + 4}" fill="#222"/>
    <!-- Screen area -->
    <rect x="${lidMarginX}" y="${lidMarginTop}" width="${w}" height="${h}" rx="${screenRadius}" ry="${screenRadius}" fill="#000"/>
    <!-- Notch camera dot -->
    <circle cx="${lidW / 2}" cy="${lidMarginTop - 4}" r="3" fill="#111"/>
    <!-- Base -->
    <rect x="${lidW * 0.08}" y="${lidH - 2}" width="${lidW * 0.84}" height="${baseH}" rx="${baseRadius}" ry="${baseRadius}" fill="url(#body)"/>
    <!-- Hinge -->
    <rect x="${lidW * 0.38}" y="${lidH - 6}" width="${lidW * 0.24}" height="8" rx="4" ry="4" fill="#1a1a1a"/>
  </svg>`;

  const composite = await sharp(inputBuf)
    .resize(w, h, { fit: 'inside' })
    .toBuffer();

  return sharp(Buffer.from(svg))
    .composite([{ input: composite, top: lidMarginTop, left: lidMarginX }])
    .png()
    .toBuffer();
}

// ── Main ────────────────────────────────────────────────────
async function main() {
  const files = fs.readdirSync(SCREENSHOTS_DIR).filter(f => f.endsWith('.png'));

  const phoneFiles = files.filter(f => f.includes('-mobile'));
  const desktopFiles = files.filter(f => f.includes('-desktop'));

  for (const file of phoneFiles) {
    const buf = fs.readFileSync(path.join(SCREENSHOTS_DIR, file));
    const outBuf = await framePhone(buf);
    const outName = file.replace('.png', '-mockup.png');
    fs.writeFileSync(path.join(OUT_DIR, outName), outBuf);
    console.log(`✓ Phone mockup: ${outName}`);
  }

  for (const file of desktopFiles) {
    const buf = fs.readFileSync(path.join(SCREENSHOTS_DIR, file));
    const outBuf = await frameLaptop(buf);
    const outName = file.replace('.png', '-mockup.png');
    fs.writeFileSync(path.join(OUT_DIR, outName), outBuf);
    console.log(`✓ Laptop mockup: ${outName}`);
  }

  console.log(`\nDone! ${phoneFiles.length + desktopFiles.length} mockups saved to ${OUT_DIR}`);
}

main().catch(console.error);
