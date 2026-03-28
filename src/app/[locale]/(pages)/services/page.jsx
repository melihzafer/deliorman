import React, { Suspense } from "react";
import { getLocale } from "next-intl/server";

import { getSortedPostsData } from "@library/posts";

import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import PageBanner from "@components/PageBanner";
import ServiceItem from "@components/services/ServiceItem";
import CallToActionSection from "@components/sections/CallToAction";
import LatestPostsSection from "@components/sections/LatestPosts";
import SubscribeSection from "@components/sections/Subscribe";
import { buildAlternates } from "@/src/i18n/seo";

import { getLegacyPageCopy } from "../pageCopy";

export async function generateMetadata() {
  const locale = await getLocale();
  const copy = getLegacyPageCopy("services", locale);

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: buildAlternates("/services", locale),
    robots: { index: false, follow: false },
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaDescription,
      type: "website",
    },
  };
}

async function Services() {
  const locale = await getLocale();
  const copy = getLegacyPageCopy("services", locale);
  const posts = await getAllPosts();

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner
          pageTitle={copy.pageTitle}
          description={copy.pageDescription}
          breadTitle={copy.breadTitle}
        />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-0">
              <ScrollHint />

              <ServiceItem
                content={
                  {
                    "subtitle": "Services",
                    "title": "A cozy place created <br>by leading designers",
                    "description": "Assumenda possimus eaque illo iste, autem. Porro eveniet, autem ipsam vitae amet repellat repudiandae tenetur, quod corrupti consectetur cum? Repudiandae dignissimos fugiat sit nam. Tempore aspernatur quae repudiandae dolorem, beatae dolorum, praesentium itaque et quam quaerat. Cumque, consequatur!"
                  }
                }
                button={
                  {
                    "label": "Read more",
                    "link": "/about"
                  }
                }
                image={
                 {
                  "url": "/img/services/1.webp",
                  "alt": "cover"
                 } 
                }
                rowReverse={1}
              />
              
              <Divider />

              <ServiceItem
                content={
                  {
                    "subtitle": "Services",
                    "title": "Fresh ingredients <br>from organic farms",
                    "description": "Assumenda possimus eaque illo iste, autem. Porro eveniet, autem ipsam vitae amet repellat repudiandae tenetur, quod corrupti consectetur cum? Repudiandae dignissimos fugiat sit nam. Tempore aspernatur quae repudiandae dolorem, beatae dolorum, praesentium itaque et quam quaerat. Cumque, consequatur!"
                  }
                }
                button={
                  {
                    "label": "Read more",
                    "link": "/about"
                  }
                }
                image={
                 {
                  "url": "/img/services/2.webp",
                  "alt": "cover"
                 } 
                }
              />
              
              <Divider />
              
              <ServiceItem
                content={
                  {
                    "subtitle": "Services",
                    "title": "12 wonderful years <br>of experience",
                    "description": "Assumenda possimus eaque illo iste, autem. Porro eveniet, autem ipsam vitae amet repellat repudiandae tenetur, quod corrupti consectetur cum? Repudiandae dignissimos fugiat sit nam. Tempore aspernatur quae repudiandae dolorem, beatae dolorum, praesentium itaque et quam quaerat. Cumque, consequatur!"
                  }
                }
                button={
                  {
                    "label": "Read more",
                    "link": "/about"
                  }
                }
                image={
                 {
                  "url": "/img/services/3.webp",
                  "alt": "cover"
                 } 
                }
                rowReverse={1}
              />

            </div>
          </div>
        </div>
        <CallToActionSection />
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <Suspense fallback={<div>Loading...</div>}>
                <LatestPostsSection posts={posts} />
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
export default Services;

async function getAllPosts() {
  const allPosts = getSortedPostsData();
  return allPosts;
}
