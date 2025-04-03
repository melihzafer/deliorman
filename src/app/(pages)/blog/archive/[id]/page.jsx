import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { notFound } from 'next/navigation';

import PageBanner from "@components/PageBanner";
import Sidebar from "@components/Sidebar";
import PopularPosts from "@components/sections/PopularPosts";
import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import { getAllArchivesIds, getArchiveData } from "@library/archives";
import { getArchivePosts, getFeaturedPostsData } from "@library/posts";

import PopularsPostsData from "@data/sections/popular-posts.json";

const BlogPaginated = dynamic( () => import("@components/blog/BlogPaginated"), { ssr: false } );

export async function generateMetadata({ params }) {
  const archiveData = await getSingleArchiveData(params);
  
  return {
    title: archiveData.month+', '+archiveData.year + " | Archive | Blog",
  }
}

async function BlogArchive( { params } ) {
  const populars = await getAllPupulars();
  const posts = await getAllPosts(params);
  const archiveData = await getSingleArchiveData(params);

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner pageTitle={"Archive: "+archiveData.month+', '+archiveData.year} description={"Porro eveniet, autem ipsam corrupti consectetur cum. <br>Repudiandae dignissimos fugiat sit nam."} breadTitle={archiveData.month+', '+archiveData.year} />
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
export default BlogArchive;

export async function _generateStaticParams() {
    const paths = getAllArchivesIds()
    return paths
}

async function getAllPupulars() {
    const popularsData = await getFeaturedPostsData( PopularsPostsData.featured )
  
    return popularsData
}

async function getSingleArchiveData(params) {
    const archiveData = await getArchiveData(params.id)

    if ( !archiveData ) {
        notFound()
    } else {
        return archiveData
    }
}

async function getAllPosts( params ) {
    const archivePosts = await getArchivePosts(params.id)

    if (!archivePosts.length) {
        notFound()
    }

    return archivePosts
}