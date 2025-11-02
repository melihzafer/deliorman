import React, { Suspense } from "react";

import { getSortedPostsData } from "@library/posts";

import AppData from "@data/app.json";

import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import PageBanner from "@components/PageBanner";
import AwardsSection from "@components/sections/Awards";
import PromoVideoSection from "@components/sections/PromoVideo";
import FeaturesSection from "@components/sections/Features";
import TeamSection from "@components/sections/Team";
import ScheduleSection from "@components/sections/Schedule";
import CountersSection from "@components/sections/Counters";
import CallToActionFourSection from "@components/sections/CallToActionFour";
import LatestPostsSection from "@components/sections/LatestPosts";
import SubscribeSection from "@components/sections/Subscribe";
import TestimonialSlider from "@components/sliders/Testimonial";

export const metadata = {
  title: {
    default: "За нас",
  },
  description: AppData.settings.siteDescription,
};

async function About() {
  const posts = await getAllPosts();

  const Content = {
    subtitle: "За нас",
    title: "Каним ви да<br> посетите нашия ресторант",
    description:
      "Добре дошли в нашия уютен ресторант, където традицията се среща с модерността. Вече повече от няколко години ние сервираме автентични български ястия, приготвени с любов и внимание към детайла. Нашият екип от опитни готвачи използва само най-свежите съставки и традиционни рецепти, предавани от поколение на поколение. Тук ще откриете топла атмосфера, отлично обслужване и незабравими вкусове, които ще ви пренесат в сърцето на българската кулинарна традиция.",
  };

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner
          pageTitle={"Историята на нашия ресторант"}
          description={"Открийте нашата страст към българската кухня и традиции"}
          breadTitle={"За нас"}
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
                      dangerouslySetInnerHTML={{ __html: Content.subtitle }}
                    />
                    <h3 className="tst-mb-30" dangerouslySetInnerHTML={{ __html: Content.title }} />
                    <p className="tst-text tst-mb-30" dangerouslySetInnerHTML={{ __html: Content.description }} />

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