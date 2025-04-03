import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { notFound } from 'next/navigation';

import PageBanner from "@components/PageBanner";
import Sidebar from "@components/Sidebar";
import PopularPosts from "@components/sections/PopularPosts";
import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import { getAllAuthorsIds, getAuthorData } from "@library/authors";
import { getAuthorPosts, getFeaturedPostsData } from "@library/posts";

import PopularsPostsData from "@data/sections/popular-posts.json";

const BlogPaginated = dynamic( () => import("@components/blog/BlogPaginated"), { ssr: false } );

export async function generateMetadata({ params }) {
  const authorData = await getSingleAuthorData(params);
  
  return {
    title: authorData.title + " | Author | Blog",
  }
}

async function BlogAuthor( { params } ) {
  const populars = await getAllPupulars();
  const posts = await getAllPosts(params);
  const authorData = await getSingleAuthorData(params);

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner pageTitle={"Author: "+authorData.title} description={"Porro eveniet, autem ipsam corrupti consectetur cum. <br>Repudiandae dignissimos fugiat sit nam."} breadTitle={authorData.title} />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <ScrollHint />

              <div className="row">

                <div className="col-lg-8">

                  <BlogPaginated
                    items={posts}
                    columns={2}
                  />

                </div>
                <div className="col-lg-4">
                  <div className="tst-sidebar-frame tst-pad-type-1">
                    <Sidebar />
                  </div>
                </div>
                
              </div>

              <Divider onlyBottom={0} />
              <Suspense fallback={<div>Loading...</div>}>
                <PopularPosts posts={populars} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default BlogAuthor;

export async function generateStaticParams() {
    const paths = getAllAuthorsIds()
    return paths
}

async function getAllPupulars() {
    const popularsData = await getFeaturedPostsData( PopularsPostsData.featured )
  
    return popularsData
}

async function getSingleAuthorData(params) {
    const authorData = await getAuthorData(params.id)

    if ( !authorData ) {
        notFound()
    } else {
        return authorData
    }
}

async function getAllPosts( params ) {
    const authorPosts = await getAuthorPosts(params.id)

    if (!authorPosts.length) {
        notFound()
    }

    return authorPosts
}