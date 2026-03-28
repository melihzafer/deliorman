import { Suspense } from "react";
import { promises as fs } from 'fs';
import { getTranslations } from "next-intl/server";

import ScrollHint from "@layouts/scroll-hint/Index";

import PageBanner from "@components/PageBanner";
import Sidebar from "@components/Sidebar";
import BlogFiltered from '@components/blog/BlogFiltered';
import { buildAlternates } from "@/src/i18n/seo";

export async function generateMetadata() {
  const t = await getTranslations("meta");
  return {
    title: t("searchTitle"),
    description: t("searchDescription"),
    alternates: buildAlternates("/search"),
    openGraph: {
      title: t("searchTitle"),
      description: t("searchDescription"),
      type: "website",
    },
  };
}

async function Search() {
  const t = await getTranslations("searchPage");
  const file = await fs.readFile(process.cwd() + '/src/data/.json/posts.json', 'utf8');
  const posts = JSON.parse(file);

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

              <div className="row">

                <div className="col-lg-8">

                <Suspense fallback={<div>{t("loading")}</div>}>
                  <BlogFiltered
                    items={posts}
                    columns={2}
                  />
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
export default Search;
