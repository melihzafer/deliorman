import React, { Suspense } from "react";
import dynamic from "next/dynamic";

import AppData from "@data/app.json";

import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import HeroSection from "@components/sections/Hero";
import AboutSection from "@components/sections/About";
import FeaturesSection from "@components/sections/Features";
import ScheduleSection from "@components/sections/Schedule";
import CountersSection from "@components/sections/Counters";
import CallToActionSection from "@components/sections/CallToAction";
import SubscribeSection from "@components/sections/Subscribe";

const TestimonialSlider = dynamic( () => import("@components/sliders/Testimonial") );

export const metadata = {
  title: {
		default: "Home 3",
	},
  description: AppData.settings.siteDescription,
  robots: { index: false, follow: false },
}

async function Home3() {
  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <HeroSection bgType={"video"} />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-0">
              <ScrollHint />
              <AboutSection />
              <Divider />
              <FeaturesSection />
              <Divider />
              <ScheduleSection />
              <Divider onlyBottom={0} />
              <CountersSection />
            </div>
          </div>
        </div>
        <CallToActionSection />
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <TestimonialSlider />
              <Divider onlyBottom={0} />
              <SubscribeSection />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home3;
