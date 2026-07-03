import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = 'D:\\Projects\\Web\\deliorman\\screenshots';
const OUT = 'D:\\Projects\\Web\\deliorman\\screenshots\\fiverr';

fs.mkdirSync(OUT, { recursive: true });

const W = 1280, H = 769;
const HEADER_H = 100;

const COLORS = {
  bg1: '#0e0e10', bg2: '#1c1c1f',
  accent: '#1dbf73', text: '#ffffff', subtle: '#9b9b9b',
};

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Build Fiverr mockup ───────────────────────────────────
async function buildFiverrMockup({ title, subtitle, screenshotPath, device }) {
  // Take only the visible viewport (top) of the source screenshot
  // Screenshots are 2x devicePixelRatio, so 1080 logical = 2160 physical
  const srcMeta = await sharp(screenshotPath).metadata();
  const dpr = srcMeta.width > 2000 ? 2 : 1;  // 3840 wide = 2x dpr
  let cropHeightLogical;
  if (device === 'laptop') {
    cropHeightLogical = 1080;
  } else {
    cropHeightLogical = 844;
  }
  const cropHeight = Math.min(srcMeta.height, cropHeightLogical * dpr);

  const croppedBuf = await sharp(screenshotPath)
    .extract({ left: 0, top: 0, width: srcMeta.width, height: cropHeight })
    .toBuffer();

  const ssMeta = await sharp(croppedBuf).metadata();
  const ssAspect = ssMeta.width / ssMeta.height;

  const maxW = W - 60;
  const maxH = H - HEADER_H - 40;

  let frameW, frameH, screenW, screenH, offsetX, offsetY;

  if (device === 'laptop') {
    // Fit laptop screen by width first
    screenW = maxW;
    screenH = Math.round(screenW / ssAspect);
    if (screenH > maxH) {
      screenH = maxH;
      screenW = Math.round(screenH * ssAspect);
    }
    const lidMarginX = 28;
    const lidMarginTop = 14;
    const lidMarginBot = 24;
    frameW = screenW + lidMarginX * 2;
    frameH = screenH + lidMarginTop + lidMarginBot;
    offsetX = Math.round((W - frameW) / 2);
    offsetY = HEADER_H + Math.round((H - HEADER_H - frameH) / 2);
  } else {
    // Phone frame; scale to fit by height
    screenH = Math.min(maxH, 600);
    screenW = Math.round(screenH * ssAspect);
    const phoneMargin = 8;
    frameW = screenW + phoneMargin * 2;
    frameH = screenH + phoneMargin * 2;
    offsetX = Math.round((W - frameW) / 2);
    offsetY = HEADER_H + Math.round((H - HEADER_H - frameH) / 2);
  }

  // Resize screenshot
  const resizedSS = await sharp(croppedBuf)
    .resize(screenW, screenH, { fit: 'fill' })
    .toBuffer();

  // Build device frame overlay
  let frameOverlay;
  let screenTop, screenLeft;

  if (device === 'laptop') {
    const lidX = offsetX;
    const lidY = offsetY;
    const screenXInLid = 28;
    const screenYInLid = 14;
    const baseH = 18;
    const baseW = Math.round(frameW * 0.78);
    const baseX = lidX + Math.round((frameW - baseW) / 2);
    const baseY = lidY + frameH - 2;

    screenTop = lidY + screenYInLid;
    screenLeft = lidX + screenXInLid;

    // Frame parts: lid body, base, camera dot — NO black rect over screen
    frameOverlay = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lid-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2a2a2c"/>
          <stop offset="100%" stop-color="#1a1a1c"/>
        </linearGradient>
        <linearGradient id="base-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3a3a3c"/>
          <stop offset="100%" stop-color="#1a1a1c"/>
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000" flood-opacity="0.4"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <rect x="${lidX}" y="${lidY}" width="${frameW}" height="${frameH - 2}" rx="18" fill="url(#lid-grad)"/>
        <circle cx="${lidX + frameW / 2}" cy="${lidY + 7}" r="3" fill="#0a0a0a"/>
        <rect x="${baseX}" y="${baseY}" width="${baseW}" height="${baseH}" rx="9" fill="url(#base-grad)"/>
      </g>
    </svg>`;
  } else {
    const lidX = offsetX;
    const lidY = offsetY;
    const screenXInLid = 8;
    const screenYInLid = 8;

    screenTop = lidY + screenYInLid;
    screenLeft = lidX + screenXInLid;

    // Frame parts: phone body, notch — NO black rect over screen
    frameOverlay = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="phone-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2a2a2c"/>
          <stop offset="100%" stop-color="#0a0a0a"/>
        </linearGradient>
        <filter id="pshadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000" flood-opacity="0.4"/>
        </filter>
      </defs>
      <g filter="url(#pshadow)">
        <rect x="${lidX}" y="${lidY}" width="${frameW}" height="${frameH}" rx="32" fill="url(#phone-grad)"/>
        <rect x="${lidX + frameW / 2 - 50}" y="${lidY + 14}" width="100" height="22" rx="11" fill="#0a0a0a"/>
      </g>
    </svg>`;
  }

  // Build header
  const titleSize = title.length > 22 ? 30 : 38;
  const headerSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <text x="50" y="50" font-family="Inter, -apple-system, system-ui, sans-serif" font-size="${titleSize}" font-weight="700" fill="${COLORS.text}">${escapeXml(title)}</text>
    <text x="50" y="80" font-family="Inter, -apple-system, system-ui, sans-serif" font-size="16" font-weight="400" fill="${COLORS.subtle}">${escapeXml(subtitle)}</text>
    <circle cx="${W - 50}" cy="44" r="7" fill="${COLORS.accent}"/>
    <text x="${W - 65}" y="50" font-family="Inter, -apple-system, system-ui, sans-serif" font-size="13" font-weight="600" fill="${COLORS.accent}" text-anchor="end">RESTAURANT DELIORMAN</text>
  </svg>`;

  // Background
  const bgSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="50%" cy="40%" r="80%">
        <stop offset="0%" stop-color="${COLORS.bg2}"/>
        <stop offset="100%" stop-color="${COLORS.bg1}"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
  </svg>`;

  // Composite: bg first, then frame (lid body), then header, then screenshot on top
  // The frame is drawn BEFORE the screenshot so the screenshot is visible on top
  const result = await sharp(Buffer.from(bgSvg))
    .composite([
      { input: Buffer.from(frameOverlay), top: 0, left: 0 },
      { input: Buffer.from(headerSvg), top: 0, left: 0 },
      { input: resizedSS, top: screenTop, left: screenLeft },
    ])
    .jpeg({ quality: 92, progressive: true, mozjpeg: false })
    .toBuffer();

  return result;
}

// ── Page data ──────────────────────────────────────────────
const PAGES = [
  { slug: '01-homepage', title: 'Restaurant Homepage', subtitle: 'Elegant hero, specialties, story, and reservations', device: 'laptop' },
  { slug: '01-homepage', title: 'Mobile Homepage', subtitle: 'Responsive on every device', device: 'mobile' },
  { slug: '02-menu', title: 'Full Menu', subtitle: 'Categorized, searchable, and beautifully presented', device: 'laptop' },
  { slug: '02-menu', title: 'Mobile Menu', subtitle: 'Browse on the go', device: 'mobile' },
  { slug: '10-masa-digital-menu', title: 'Masa — QR Digital Menu', subtitle: 'Scan, browse, and order from the table', device: 'mobile' },
  { slug: '11-qr-menu-tool', title: 'QR Code Generator', subtitle: 'Print ready-to-use QR cards in seconds', device: 'laptop' },
  { slug: '05-gallery', title: 'Photo Gallery', subtitle: 'Interior, exterior, and signature dishes', device: 'laptop' },
  { slug: '06-reservation', title: 'Online Reservations', subtitle: 'Book a table in under a minute', device: 'laptop' },
  { slug: '03-about', title: 'Our Story', subtitle: 'Tradition, family, and authentic cuisine', device: 'laptop' },
  { slug: '07-services', title: 'Catering & Events', subtitle: 'Private events and special occasions', device: 'laptop' },
];

async function main() {
  for (const p of PAGES) {
    const suffix = p.device === 'laptop' ? 'desktop' : 'mobile';
    const ssPath = path.join(SRC, `${p.slug}-${suffix}.png`);
    if (!fs.existsSync(ssPath)) {
      console.log(`✗ Missing: ${ssPath}`);
      continue;
    }
    const out = await buildFiverrMockup({
      title: p.title,
      subtitle: p.subtitle,
      screenshotPath: ssPath,
      device: p.device,
    });
    const outName = `${p.slug}-${p.device === 'laptop' ? 'desk' : 'mob'}-fiverr.jpg`;
    fs.writeFileSync(path.join(OUT, outName), out);
    console.log(`✓ ${outName} (${(out.length / 1024).toFixed(0)} KB)`);
  }
  console.log(`\nDone! ${PAGES.length} Fiverr mockups saved to ${OUT}`);
}

main().catch(console.error);
