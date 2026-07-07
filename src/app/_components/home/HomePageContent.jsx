import React from "react";

import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import AboutSection from "@components/sections/About";
import FeaturesSection from "@components/sections/Features";
import ScheduleSection from "@components/sections/Schedule";
import CountersSection from "@components/sections/Counters";
import NewSpecialtiesCTA from "@components/sections/NewSpecialtiesCTALazy";
import HeroSlider from "@components/sliders/Hero";
import Testimonials from "@components/sections/Testimonials";
import StatsCounter from "@components/sections/StatsCounter";
import TrustIndicators from "@components/sections/TrustIndicators";
import FAQ from "@components/sections/FAQ";

export default function HomePageContent() {
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
              <StatsCounter />
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
              <Divider />
              <Testimonials />
              <Divider />
              <FAQ />
            </div>
          </div>
        </div>
        <TrustIndicators />
      </div>
    </>
  );
}
