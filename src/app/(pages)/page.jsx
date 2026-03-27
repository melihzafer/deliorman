import React from "react";

import AppData from "@data/app.json";

import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import AboutSection from "@components/sections/About";
import FeaturesSection from "@components/sections/Features";
import ScheduleSection from "@components/sections/Schedule";
import CountersSection from "@components/sections/Counters";
import NewSpecialtiesCTA from "../_components/sections/NewSpecialtiesCTALazy";
import HeroSlider from "../_components/sliders/Hero";

/** @type {import('next').Metadata} */
export const metadata = {
  title: {
    default: "Начало",
  },
  description: AppData.settings.siteDescription,
};

async function Home() {
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
      </div>
    </>
  );
}
export default Home;
