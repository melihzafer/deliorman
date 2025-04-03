import React, { Suspense } from "react";
import dynamic from "next/dynamic";

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

const TestimonialSlider = dynamic( () => import("@components/sliders/Testimonial"), { ssr: false } );

export const metadata = {
  title: {
		default: "About",
	},
  description: AppData.settings.siteDescription,
}

async function About() {
  const posts = await getAllPosts();

  const Content = {
    "subtitle": "About us",
    "title": "We invite you to<br> visit our restaurant",
    "description": "Assumenda possimus eaque illo iste, autem. Porro eveniet, autem ipsam vitae amet repellat repudiandae tenetur, quod corrupti consectetur cum? Repudiandae dignissimos fugiat sit nam. Tempore aspernatur quae repudiandae dolorem, beatae dolorum, praesentium itaque et quam quaerat. Cumque, consequatur!"
  }

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner pageTitle={"Story of our restaurant"} description={"Quaerat debitis, vel, sapiente dicta sequi <br>labore porro pariatur harum expedita."} breadTitle={"About us"} />
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
                    <div className="tst-suptitle tst-suptitle-center tst-mb-15" dangerouslySetInnerHTML={{__html : Content.subtitle}} /> 
                    <h3 className="tst-mb-30" dangerouslySetInnerHTML={{__html : Content.title}} />
                    <p className="tst-text tst-mb-30" dangerouslySetInnerHTML={{__html : Content.description}} />

                    {AppData.social.map((item, key) => (
                    <a href={item.link} target="_blank" title={item.title} className="tst-icon-link" key={`about-social-item-${key}`}><i className={item.icon}></i></a>
                    ))}
                  </div>
                  {/* about text end */}

                </div>
              </div>
              <AwardsSection />
              <PromoVideoSection />
              <Divider />
              <FeaturesSection />
              <Divider />
              <TeamSection />
              <Divider />
              <ScheduleSection />
              <Divider onlyBottom={0} />
              <CountersSection />
            </div>
          </div>
        </div>
        <CallToActionFourSection />
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <TestimonialSlider />
              <Divider onlyBottom={0} />
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
export default About;

async function getAllPosts() {
  const allPosts = getSortedPostsData();
  return allPosts;
}