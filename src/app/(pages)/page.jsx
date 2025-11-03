import React, { Suspense } from "react";

import { getSortedPostsData } from "@library/posts";

import AppData from "@data/app.json";

import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import AboutSection from "@components/sections/About";
import FeaturesSection from "@components/sections/Features";
import ScheduleSection from "@components/sections/Schedule";
import CountersSection from "@components/sections/Counters";
import CallToActionSection from "@components/sections/CallToAction";
import LatestPostsSection from "@components/sections/LatestPosts";
import SubscribeSection from "@components/sections/Subscribe";
import HeroSlider from "@components/sliders/Hero";
import TestimonialSlider from "@components/sliders/Testimonial";
import NewSpecialtiesCTA from "../_components/sections/NewSpecialtiesCTA";

export const metadata = {
  title: {
    default: "Начало",
  },
  description: AppData.settings.siteDescription,
};

async function Home() {
  const posts = await getAllPosts();

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <HeroSlider />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-0">
              <ScrollHint />
              <AboutSection />
              <Divider />
              <FeaturesSection />
            </div>
          </div>
        </div>
        <NewSpecialtiesCTA />
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-0">
              <ScheduleSection />
              <Divider onlyBottom={0} />
              <CountersSection />
            </div>
          </div>
        </div>
        {/* <br />
        <br /> */}
        {/* <CallToActionSection /> */}
        {/* <div className="tst-content-frame">
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
        </div> */}
      </div>
    </>
  );
}
export default Home;

async function getAllPosts() {
  const allPosts = getSortedPostsData();
  return allPosts;
}
