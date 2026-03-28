import React from "react";
import { getTranslations } from "next-intl/server";

import { getSortedPostsData } from "@library/posts";

import AppData from "@data/app.json";

import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import PageBanner from "@components/PageBanner";
import PromoVideoSection from "@components/sections/PromoVideo";
import FeaturesSection from "@components/sections/Features";
import ScheduleSection from "@components/sections/Schedule";
import CountersSection from "@components/sections/Counters";
import CallToActionFourSection from "@components/sections/CallToActionFour";
import { buildAlternates } from "@/src/i18n/seo";

export async function generateMetadata() {
  const t = await getTranslations("meta");
  return {
    title: t("aboutTitle"),
    description: t("aboutDescription"),
    alternates: buildAlternates("/about"),
    openGraph: {
      title: t("aboutTitle"),
      description: t("aboutDescription"),
      type: "website",
    },
  };
}

async function About() {
  const posts = await getAllPosts();
  const t = await getTranslations("about");

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner
          pageTitle={t("pageTitle")}
          description={t("pageDescription")}
          breadTitle={t("breadTitle")}
        />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-0">
              <ScrollHint />

              <div className="row">
                <div className="col-lg-12">
                  {/* about text */}
                  <div className="tst-mb-60 text-center">
                    <div
                      className="tst-suptitle tst-suptitle-center tst-mb-15"
                      dangerouslySetInnerHTML={{ __html: t.raw("subtitle") }}
                    />
                    <h3 className="tst-mb-30" dangerouslySetInnerHTML={{ __html: t.raw("title") }} />
                    <p className="tst-text tst-mb-30" dangerouslySetInnerHTML={{ __html: t.raw("description") }} />

                    {AppData.social.map((item, key) => (
                      <a
                        href={item.link}
                        target="_blank"
                        title={item.title}
                        className="tst-icon-link"
                        key={`about-social-item-${key}`}
                      >
                        <i className={item.icon}></i>
                      </a>
                    ))}
                  </div>
                  {/* about text end */}
                </div>
              </div>
              {/* <AwardsSection /> Awards will be added soon!! */}
              <PromoVideoSection />
              <Divider />
              <FeaturesSection />
              <Divider />
              {/* <TeamSection />
              <Divider /> */}
              
            </div>
          </div>
        </div>
        <br />
              <CallToActionFourSection />
        
        <br />
        <br />
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
               {/* <TestimonialSlider /> 
               <Divider onlyBottom={0} />
              <Suspense fallback={<div>Зареждане...</div>}>
                <LatestPostsSection posts={posts} />
              </Suspense>
              <Divider onlyBottom={0} /> 
              <SubscribeSection /> */}


              <ScheduleSection />
              
              <Divider onlyBottom={0} />
              <CountersSection />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default About;

async function getAllPosts() {
  const allPosts = getSortedPostsData();
  return allPosts;
}
