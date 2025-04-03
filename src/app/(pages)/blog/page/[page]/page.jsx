import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation';

import AppData from "@data/app.json";
import PopularsPostsData from "@data/sections/popular-posts.json";

import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import Pagination from '@components/Pagination';
import PageBanner from "@components/PageBanner";
import PopularPosts from "@components/sections/PopularPosts";
import SubscribeSection from "@components/sections/Subscribe";

import { getPaginatedPostsData, getFeaturedPostsData } from "@library/posts";

const BlogPaginated = dynamic( () => import("@components/blog/BlogPaginated"), { ssr: false } );

export const metadata = {
  title: {
		default: "Blog",
	},
  description: AppData.settings.siteDescription,
}

async function BlogPage( { params } ) {
  const populars = await getAllPupulars();
  const postsData = await getAllPosts(params);

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner pageTitle={"Our Blog"} description={"Porro eveniet, autem ipsam corrupti consectetur cum. <br>Repudiandae dignissimos fugiat sit nam."} breadTitle={"Blog"} />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <ScrollHint />

              <div className="row">

                <div className="col-lg-12">

                  {/* title */}
                  <div className="text-center">
                    <div className="tst-suptitle tst-suptitle-center tst-mb-15">Newsletter</div>
                    <h3 className="tst-mb-30">Latest publications</h3>
                    <p className="tst-text tst-mb-60">Porro eveniet, autem ipsam corrupti consectetur cum. <br/>Repudiandae dignissimos fugiat sit nam.</p>
                  </div>
                  {/* title end */}

                </div>
              </div>

              <BlogPaginated
                items={postsData.posts}
              />
              <Pagination
                currentPage={postsData.currentPage}
                totalItems={postsData.totalPosts}
                perPage={AppData.settings.perPage}
                renderPageLink={(page) => `/blog/page/${page}`}
              />
              <Divider onlyBottom={0} />
              <Suspense fallback={<div>Loading...</div>}>
                <PopularPosts posts={populars} />
              </Suspense>
              <Divider onlyBottom={0} />
              <SubscribeSection />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default BlogPage;

export async function generateStaticParams() {
  return Array.from({ length: 5 }).map((_, i) => `/blog/page/${i + 2}`)
}

async function getAllPupulars() {
  const popularsData = await getFeaturedPostsData( PopularsPostsData.featured )

  return popularsData
}

async function getAllPosts( params ) {
  const page = Number(params?.page) || 1
  const { posts, total } = getPaginatedPostsData( AppData.settings.perPage, page );

  if (!posts.length) {
    notFound()
  }

  if (page === 1) {
    redirect('/blog')
  }

  return {
    posts: posts,
    totalPosts: total,
    currentPage: page
  }
}