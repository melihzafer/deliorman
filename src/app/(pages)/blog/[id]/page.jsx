import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";

import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import PageBanner from "@components/PageBanner";
import BlogPaginated from "@components/blog/BlogPaginated";
import { BlogArticleStructuredData } from "@components/blog/BlogStructuredData";
import Date from "@library/date";
import { getPostData, getSortedPostsData } from "@library/posts";

const articleFallbackImage = "/img/logo.webp";

function getPostMeta(post) {
  const categories = Array.isArray(post.categories) ? post.categories : [];
  const tags = Array.isArray(post.tags) ? post.tags : [];

  return { categories, tags };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getSortedPostsData().map((post) => ({
    id: post.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getPostData(id);

  if (!post) {
    return {
      title: "Публикацията не е намерена",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { categories, tags } = getPostMeta(post);
  const image = post.image || articleFallbackImage;

  return {
    title: post.title,
    description: post.short,
    keywords: [...categories, ...tags],
    alternates: {
      canonical: `/blog/${post.id}`,
    },
    openGraph: {
      title: post.title,
      description: post.short,
      type: "article",
      url: `/blog/${post.id}`,
      publishedTime: post.date,
      authors: [post.author],
      tags: [...categories, ...tags],
      images: [
        {
          url: image,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.short,
      images: [image],
    },
  };
}

async function BlogPostPage({ params }) {
  const { id } = await params;
  const post = await getPostData(id);

  if (!post) {
    notFound();
  }

  const { categories, tags } = getPostMeta(post);
  const articleImage = post.image || articleFallbackImage;
  const authorAvatar = post.authorAvatar || articleFallbackImage;
  const relatedPosts = getSortedPostsData()
    .filter((item) => item.id !== post.id)
    .slice(0, 3);

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner
          pageTitle={post.title}
          pageSubTitle={categories[0] || "Блог"}
          description={post.short}
          breadTitle={"Статия"}
        />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <ScrollHint />
              <BlogArticleStructuredData post={post} />

              <div className="row">
                <div className="col-lg-12">
                  <article className="tst-blog-card tst-mb-60">
                    <div className="tst-cover-frame" style={{ paddingBottom: "50%" }}>
                      <Image
                        src={articleImage}
                        alt={post.title}
                        fill
                        priority
                        sizes="(max-width: 991px) 100vw, 1200px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="tst-descr">
                      {categories.length > 0 ? (
                        <div className="tst-suptitle tst-mb-15">
                          {categories.join(" • ")}
                        </div>
                      ) : null}

                      <div className="tst-post-bottom tst-mb-30">
                        <div className="tst-post-author">
                          <Image src={authorAvatar} alt={post.author} width={40} height={40} />
                          <h6>{post.author}</h6>
                        </div>
                        <div className="tst-date">
                          <Date dateString={post.date} />
                        </div>
                      </div>

                      <div
                        className="tst-text"
                        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                      />

                      {tags.length > 0 ? (
                        <div className="tst-text" style={{ marginTop: "30px" }}>
                          <strong>Теми:</strong> {tags.join(", ")}
                        </div>
                      ) : null}
                    </div>
                  </article>
                </div>
              </div>

              {relatedPosts.length > 0 ? (
                <>
                  <Divider />

                  <div className="row">
                    <div className="col-lg-12">
                      <div className="text-center tst-mb-60">
                        <div className="tst-suptitle tst-suptitle-center tst-mb-15">
                          Още от блога
                        </div>
                        <h3 className="tst-mb-30">Разгледайте още публикации</h3>
                        <p className="tst-text tst-mb-0">
                          Открийте още рецепти, новини и идеи от кухнята на Делиорман.
                        </p>
                      </div>
                    </div>
                  </div>

                  <BlogPaginated items={relatedPosts} columns={3} />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogPostPage;
