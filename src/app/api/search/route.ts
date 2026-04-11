import { NextResponse } from 'next/server';
import { getLocalizedMenuData } from '@data/getLocalizedMenuData';

function normalize(str: string): string {
  if (!str) return "";
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const BG_TO_LAT: Record<string, string> = {
  'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ж':'zh','з':'z',
  'и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p',
  'р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch',
  'ш':'sh','щ':'sht','ъ':'a','ь':'','ю':'yu','я':'ya',
};

const LAT_TO_BG: Record<string, string> = {
  'a':'а','b':'б','c':'к','d':'д','e':'е','f':'ф','g':'г','h':'х',
  'i':'и','j':'ж','k':'к','l':'л','m':'м','n':'н','o':'о','p':'п',
  'q':'к','r':'р','s':'с','t':'т','u':'у','v':'в','w':'в','x':'кс',
  'y':'й','z':'з',
  'zh':'ж','ch':'ч','sh':'ш','sht':'щ','yu':'ю','ya':'я','ts':'ц',
};

function transliterate(str: string, map: Record<string, string>): string {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const ch = str[i].toLowerCase();
    if (i < str.length - 1) {
      const digraph = ch + str[i + 1].toLowerCase();
      if (map === BG_TO_LAT) {
        if (digraph === 'ж') { result += 'zh'; i++; continue; }
        if (digraph === 'ч') { result += 'ch'; i++; continue; }
        if (digraph === 'ш') { result += 'sh'; i++; continue; }
        if (digraph === 'щ') { result += 'sht'; i++; continue; }
        if (digraph === 'ю') { result += 'yu'; i++; continue; }
        if (digraph === 'я') { result += 'ya'; i++; continue; }
      }
    }
    if (map[ch] !== undefined) {
      result += map[ch];
    } else {
      result += ch;
    }
  }
  return result;
}

function bgToLat(str: string): string {
  return transliterate(str, BG_TO_LAT);
}

function latToBg(str: string): string {
  let result = '';
  const s = str.toLowerCase();
  for (let i = 0; i < s.length; i++) {
    // Check digraphs first
    if (i < s.length - 1) {
      const pair = s[i] + s[i + 1];
      if (pair === 'zh') { result += 'ж'; i++; continue; }
      if (pair === 'ch') { result += 'ч'; i++; continue; }
      if (pair === 'sh') { result += 'ш'; i++; continue; }
      if (i < s.length - 2 && s.substr(i, 3) === 'sht') { result += 'щ'; i += 2; continue; }
      if (pair === 'yu') { result += 'ю'; i++; continue; }
      if (pair === 'ya') { result += 'я'; i++; continue; }
    }
    const mapped = LAT_TO_BG[s[i]];
    if (mapped) { result += mapped; continue; }
    result += s[i];
  }
  return result;
}

function formatPrice(price: number | string | null | undefined, amount: string | undefined): string {
  const p = typeof price === 'number' ? `${price.toFixed(2)} лв` : (price || '');
  return amount ? `${p} / ${amount}` : p;
}

const PAGES = [
  { path: "/", keys: ["home"], metaKeys: ["homeTitle", "homeDescription"] },
  { path: "/menu", keys: ["menu", "classicMenu"], metaKeys: ["menuTitle", "menuDescription"] },
  { path: "/lunch-menu", keys: ["lunchMenu"], metaKeys: [] },
  { path: "/about", keys: ["about", "aboutRestaurant"], metaKeys: ["aboutTitle", "aboutDescription"] },
  { path: "/gallery", keys: ["gallery"], metaKeys: ["galleryPageTitle", "galleryPageDescription"] },
  { path: "/contact", keys: ["contact"], metaKeys: ["contactTitle", "contactDescription"] },
  { path: "/reservation", keys: ["reservation"], metaKeys: ["reservationTitle", "reservationDescription"] },
  { path: "/feedback", keys: ["feedback"], metaKeys: ["feedbackTitle", "feedbackDescription"] },
  { path: "/special-days", keys: ["specialDays"], metaKeys: [] },
  { path: "/catering-services", keys: ["services"], metaKeys: [] },
  { path: "/history", keys: [], metaKeys: [] },
  { path: "/terms", keys: [], metaKeys: [] },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'bg';
    const rawQuery = (searchParams.get('q') || '').trim();

    if (rawQuery.length < 2) {
      return NextResponse.json({ success: true, menu: [], pages: [], specialties: [] });
    }

    const q = rawQuery.toLowerCase();
    const qNorm = normalize(q);
    const qBg = latToBg(q);
    const qBgNorm = normalize(qBg);
    const qLat = bgToLat(q);
    const qLatNorm = normalize(qLat);

    function match(text: string): boolean {
      if (!text) return false;
      const t = text.toLowerCase();
      const tN = normalize(text);
      const tLat = bgToLat(text).toLowerCase();
      return t.includes(q) || normalize(tLat).includes(qNorm) || t.includes(qBg) || tN.includes(qBgNorm) || tLat.includes(q) || t.includes(qLat) || tN.includes(qLatNorm);
    }

    const menuData = getLocalizedMenuData(locale);
    let messages: any;
    try {
      messages = (await import(`../../../../messages/${locale}.json`)).default;
    } catch {
      messages = (await import(`../../../../messages/bg.json`)).default;
    }

    const menuTranslations = messages.menu || {};
    const menuResults: any[] = [];

    if (menuData?.categories) {
      for (const category of menuData.categories) {
        for (const item of category.items) {
          const title = item.title || "";
          const text = item.text || "";
          if (match(title) || match(text)) {
            menuResults.push({
              type: "menu",
              title: title,
              text: text ? text.substring(0, 120) : "",
              price: formatPrice(item.price, item.amount),
              category: category.slug,
              categoryName: (menuTranslations.categories && menuTranslations.categories[category.slug]) || category.name || category.slug,
              href: `/menu?category=${category.slug}`,
            });
          }
        }
        if (menuResults.length >= 15) break;
      }
    }

    const specialtyResults: any[] = [];
    const specialtiesData = menuData?.categories?.find((c: any) => c.slug === "specialties" || c.slug === "new-specialties");
    if (specialtiesData) {
      for (const item of specialtiesData.items) {
        const title = item.title || "";
        const text = item.text || "";
        if (match(title) || match(text)) {
          specialtyResults.push({
            type: "specialty",
            title: title,
            text: text ? text.substring(0, 120) : "",
            price: formatPrice(item.price, item.amount),
            href: "/menu",
          });
        }
      }
    }

    const nav = messages.nav || {};
    const meta = messages.meta || {};
    const aboutSections = messages.aboutSections || {};
    const menu = messages.menu || {};
    const pageResults: any[] = [];

    for (const page of PAGES) {
      const titles = page.keys.map(k => nav[k] || "").filter(Boolean);
      const descriptions = page.metaKeys.map(k => meta[k] || "").filter(Boolean);
      const allTexts = [...titles, ...descriptions];

      if (allTexts.some(t => match(t))) {
        pageResults.push({
          type: "page",
          title: titles[0] || page.path,
          text: descriptions[0] || "",
          href: page.path,
        });
      }
    }

    // Search about sections
    const aboutIntro = aboutSections.intro || {};
    for (const key of Object.keys(aboutIntro)) {
      const val = String(aboutIntro[key] || "");
      if (match(val)) {
        const title = aboutIntro.title || aboutIntro.subtitle || "About";
        if (!pageResults.find(p => p.href === "/about")) {
          pageResults.push({ type: "page", title: nav.about || "About", text: val.substring(0, 100), href: "/about" });
        }
        break;
      }
    }

    // Search schedule
    const schedule = messages.schedule || {};
    for (const key of Object.keys(schedule)) {
      const val = String(schedule[key] || "");
      if (match(val)) {
        if (!pageResults.find(p => p.href === "/about")) {
          pageResults.push({ type: "page", title: nav.about || "About", text: "", href: "/about" });
        }
        break;
      }
    }

    // Search menu category names
    for (const key of Object.keys(menuTranslations)) {
      if (typeof menuTranslations[key] === 'string') {
        if (match(menuTranslations[key])) {
          if (!pageResults.find(p => p.href === "/menu")) {
            pageResults.push({ type: "page", title: nav.menu || "Menu", text: "", href: "/menu" });
          }
          break;
        }
      }
    }

    return NextResponse.json({
      success: true,
      menu: menuResults.slice(0, 15),
      pages: pageResults,
      specialties: specialtyResults.slice(0, 5),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Search failed', menu: [], pages: [], specialties: [] },
      { status: 500 }
    );
  }
}