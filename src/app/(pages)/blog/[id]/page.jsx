import React, { Suspense } from "react";
import { getAllPostsIds, getPostData, getFeaturedPostsData } from "@library/posts";
import { getAuthorData } from "@library/authors";

import Link from "next/link";
import Date from '@library/date';

import { notFound } from 'next/navigation';

import PageBanner from "@components/PageBanner";
import PopularPosts from "@components/sections/PopularPosts";

import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import PopularsPostsData from "@data/sections/popular-posts.json";
import CommentsData from "@data/comments.json";

async function PostsDetail( { params } ) {
  const populars = await getAllPupulars();
  const postData = await getSinglePostData(params);
  const authorData = await getSingleAuthorData(postData.author.toLowerCase().replaceAll(' ', '-'));

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner pageTitle={postData.title} description={"Porro eveniet, autem ipsam corrupti consectetur cum. <br>Repudiandae dignissimos fugiat sit nam."} breadTitle={postData.categories[0]} />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <ScrollHint />

              <div className="row justify-content-center">

                <div className="col-lg-8">

                  <div className="tst-post-bottom tst-mb-30">
                    <div className="tst-post-author">
                      <img src={authorData.avatar} alt={postData.author} />
                      <h6>{postData.author}</h6>
                    </div>
                    <div className="tst-date"><Date dateString={postData.date} /></div>
                  </div>

                  <div className="tst-about-cover tst-video-cover tst-mb-60">
                    <img src={postData.image} alt={postData.title} className="tst-cover animateme" data-when="span" data-from="-1" data-to="2" data-easing="easeinout" data-scale="1.2" />
                  </div>

                  <div className="tst-text" dangerouslySetInnerHTML={{__html : postData.contentHtml}} />

                  <div className="tst-spacer"></div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="tst-categories">
                        <span>Categories:</span>
                        {postData.categories.map((category, key) => (
                        <Link href={`/blog/category/${category.toLowerCase().replaceAll(' ', '-')}`} key={`post-category-${key}`}>{category}</Link>
                        ))}
                      </div>
                    </div>
                    <div className="col-lg-6 text-right">
                      <div className="tst-tags">
                        <span>Tags:</span>
                        {postData.tags.map((tag, key) => (
                        <Link href={`/blog/tag/${tag.toLowerCase().replaceAll(' ', '-')}`} key={`post-tag-${key}`}>{tag}</Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="tst-spacer"></div>

                  <h5 className="tst-mb-60">Comments</h5>

                  <ul className="tst-comments-list">
                    {CommentsData[postData.id].map((item, key) => (
                    <li key={`comment-item-${key}`}>
                      <div className="tst-comment-avatar">
                        <img src={item.avatar} alt={item.name} />
                      </div>
                      <div className="tst-comment-box">
                        <div className="tst-comment-head">
                          <h6><span className="tst-anima-link">{item.name}</span></h6>
                          <div className="tst-date">{item.date}</div>
                        </div>
                        <div className="tst-comment-content tst-text" dangerouslySetInnerHTML={{__html : item.text}} />
                      </div>
                      {item.child.length >= 0 &&
                      <ul className="tst-comments-list tst-reply-list">
                        {item.child.map((child, child_key) => (
                        <li key={`comment-item-${key}-${child_key}`}>
                          <div className="tst-comment-avatar">
                            <img src={child.avatar} alt={child.name} />
                          </div>
                          <div className="tst-comment-box">
                            <div className="tst-comment-head">
                              <h6><span className="tst-anima-link">{child.name}</span></h6>
                              <div className="tst-date">{child.date}</div>
                            </div>
                            <div className="tst-comment-content tst-text" dangerouslySetInnerHTML={{__html : child.text}} />
                          </div>
                        </li>
                        ))}
                      </ul>
                      }
                    </li>
                    ))}
                  </ul>

                  <div className="tst-spacer"></div>

                  <h5 className="tst-mb-60">Write a comment</h5>

                  <form className="text-center">
                    <textarea rows="5" placeholder="Message"></textarea>
                    <input type="text" placeholder="Name" />
                    <input type="text" placeholder="Email" />
                    <button className="tst-btn" type="submit">Write a comment</button>
                  </form>

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
export default PostsDetail;

export async function generateStaticParams() {
  const paths = getAllPostsIds()

  return paths
}

async function getAllPupulars() {
    const popularsData = await getFeaturedPostsData( PopularsPostsData.featured )
  
    return popularsData
}

async function getSinglePostData(params) {
  const postData = await getPostData(params.id)
  
  if ( !postData ) {
    notFound()
  } else {
    return postData
  }
}

async function getSingleAuthorData(author_id) {
    const authorData = await getAuthorData(author_id)
    
    return authorData
}