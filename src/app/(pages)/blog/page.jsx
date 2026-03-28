import React from "react";

import ScrollHint from "@layouts/scroll-hint/Index";

import PageBanner from "@components/PageBanner";
import BlogPaginated from "@components/blog/BlogPaginated";
import { BlogCollectionStructuredData } from "@components/blog/BlogStructuredData";
import { getSortedPostsData } from "@library/posts";

const blogDescription =
  "Рецепти, новини и кулинарни идеи от екипа на ресторант Делиорман.";

export const metadata = {
  title: "Блог",
  description: blogDescription,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Блог",
    description: blogDescription,
    type: "website",
    url: "/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Блог",
    description: blogDescription,
  },
};

async function BlogPage() {
  const posts = getSortedPostsData();

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner
          pageTitle={"Блог на Делиорман"}
          pageSubTitle={"Новини и рецепти"}
          description={"Рецепти, новини и кулинарни идеи от екипа на ресторант Делиорман."}
          breadTitle={"Блог"}
        />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <ScrollHint />
              <BlogCollectionStructuredData posts={posts} />

              <div className="row">
                <div className="col-lg-12">
                  <div className="text-center tst-mb-60">
                    <div className="tst-suptitle tst-suptitle-center tst-mb-15">
                      Последни публикации
                    </div>
                    <h3 className="tst-mb-30">Рецепти, истории и идеи от нашата кухня</h3>
                    <p className="tst-text tst-mb-0">{blogDescription}</p>
                  </div>
                </div>
              </div>

              {posts.length > 0 ? (
                <BlogPaginated items={posts} columns={2} />
              ) : (
                <div className="row">
                  <div className="col-lg-12">
                    <p className="tst-text text-center">
                      Публикациите в блога ще се появят тук съвсем скоро.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogPage;
