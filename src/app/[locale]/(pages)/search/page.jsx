import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";

import ScrollHint from "@layouts/scroll-hint/Index";
import PageBanner from "@components/PageBanner";
import Sidebar from "@components/Sidebar";
import MenuSearch from "@components/search/MenuSearch";
import { buildAlternates } from "@/src/i18n/seo";

function normalizeDiacritics(str) {
  if (!str) return "";
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const LAT_TO_BG = {
  'a':'а','b':'б','c':'к','d':'д','e':'е','f':'ф','g':'г','h':'х',
  'i':'и','j':'ж','k':'к','l':'л','m':'м','n':'н','o':'о','p':'п',
  'q':'к','r':'р','s':'с','t':'т','u':'у','v':'в','w':'в','x':'кс',
  'y':'й','z':'з',
};

const BG_TO_LAT = {
  'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ж':'zh','з':'z',
  'и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p',
  'р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch',
  'ш':'sh','щ':'sht','ъ':'a','ь':'','ю':'yu','я':'ya',
};

function bgToLat(str) {
  return str.replace(/./g, c => BG_TO_LAT[c] || c);
}

function latToBg(str) {
  let result = '';
  const s = str.toLowerCase();
  for (let i = 0; i < s.length; i++) {
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

function matchText(text, query) {
  if (!text) return false;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  const qNorm = normalizeDiacritics(q);
  const tNorm = normalizeDiacritics(t);
  if (tNorm.includes(qNorm)) return true;
  const qBg = latToBg(q);
  if (t.includes(qBg) || normalizeDiacritics(t).includes(normalizeDiacritics(qBg))) return true;
  const qLat = bgToLat(q);
  const tLat = bgToLat(t).toLowerCase();
  if (tLat.includes(q) || normalizeDiacritics(tLat).includes(qNorm)) return true;
  return false;
}

export async function generateMetadata() {
  const t = await getTranslations("meta");
  const locale = await getLocale();
  return {
    title: t("searchTitle"),
    description: t("searchDescription"),
    alternates: buildAlternates("/search", locale),
    openGraph: {
      title: t("searchTitle"),
      description: t("searchDescription"),
      type: "website",
    },
  };
}

export default async function Search({ searchParams }) {
  const t = await getTranslations("searchPage");
  const locale = await getLocale();
  
  const searchParamsObj = await searchParams;
  const rawQuery = searchParamsObj?.key || '';
  const query = rawQuery.toLowerCase();

  let menuItems = [];
  let specialtyItems = [];
  let pageItems = [];

  if (query.length > 0) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/search?locale=${locale}&q=${encodeURIComponent(query)}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        menuItems = data.menu || [];
        specialtyItems = data.specialties || [];
        pageItems = data.pages || [];
      }
    } catch {
      // fallback: no results
    }
  }

  const allMenuItems = [...specialtyItems, ...menuItems];

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <Suspense fallback={<div>{t("loading")}</div>}>
          <PageBanner pageTitle={t("pageTitleTemplate")} description={t("pageDescription")} breadTitle={t("breadTitle")} />
        </Suspense>
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <ScrollHint />

              {pageItems.length > 0 && (
                <div className="tst-mb-40">
                  <h5 className="tst-mb-20" style={{ color: "#05232B", textTransform: "uppercase", letterSpacing: "1px", fontSize: "13px" }}>
                    <i className="fas fa-file-alt" style={{ marginRight: "8px", color: "#f39c12" }}></i>
                    {t("pagesSection") || "Pages"}
                  </h5>
                  <div className="row">
                    {pageItems.map((item, idx) => (
                      <div key={`page-${idx}`} className="col-md-4 col-sm-6 tst-mb-20">
                        <a href={item.href} style={{ display: "block", padding: "15px 20px", background: "#f8f9fa", borderRadius: "8px", textDecoration: "none", color: "#05232B", transition: "background 0.2s" }}>
                          <strong>{item.title}</strong>
                          {item.text && <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#666" }}>{item.text.substring(0, 80)}</p>}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="row">
                <div className="col-lg-8">
                  <Suspense fallback={<div>{t("loading")}</div>}>
                    <MenuSearch items={allMenuItems} query={query} />
                  </Suspense>
                </div>
                <div className="col-lg-4">
                  <div className="tst-sidebar-frame tst-pad-type-1">
                    <Sidebar />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};