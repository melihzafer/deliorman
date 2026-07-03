import React, { Suspense } from "react";
import dynamic from "next/dynamic";

import AppData from "@data/app.json";
import MenuData from "@data/menu.json";

import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import AboutSection from "@components/sections/About";
import FeaturesSection from "@components/sections/Features";
import TeamSection from "@components/sections/Team";
import ScheduleSection from "@components/sections/Schedule";
import CountersSection from "@components/sections/Counters";
import CallToActionSection from "@components/sections/CallToAction";
import CallToActionTwoSection from "@components/sections/CallToActionTwo";
import CallToActionThreeSection from "@components/sections/CallToActionThree";
import SubscribeSection from "@components/sections/Subscribe";
import ContactInfoSection from "@components/sections/ContactInfo";
import ContactFormSection from "@components/sections/ContactForm";

const HeroSlider = dynamic( () => import("@components/sliders/Hero") );
const TestimonialSlider = dynamic( () => import("@components/sliders/Testimonial") );

const MenuFiltered = dynamic( () => import("@components/menu/MenuFiltered") );

export const metadata = {
  title: {
		default: "Home Onepage",
	},
  description: AppData.settings.siteDescription,
  robots: { index: false, follow: false },
}

async function HomeOnePage() {
  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <Suspense fallback={<div className="tst-skeleton" style={{ height: '600px', background: '#f2f3f5' }} />}>
          <HeroSlider />
        </Suspense>
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <ScrollHint />
              <AboutSection />
              <Divider />
              <FeaturesSection />
              <Divider />
              <TeamSection />
              <Divider />
              <CountersSection />
              <Divider />
              <ScheduleSection />
            </div>
          </div>
        </div>
        <CallToActionSection />
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-0">
              <Suspense fallback={<div className="tst-skeleton" style={{ height: '400px', background: '#f2f3f5' }} />}>
                <MenuFiltered 
                  heading={
                    { 
                      "subtitle": "Menu", 
                      "title": "Our Menu", 
                      "description": "Porro eveniet, autem ipsam vitae consequatur!" 
                    }
                  } 
                  categories={MenuData.categories} 
                />
              </Suspense>
            </div>
          </div>
        </div>
        <CallToActionTwoSection />
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <Suspense fallback={<div className="tst-skeleton" style={{ height: '300px', background: '#f2f3f5' }} />}>
                <TestimonialSlider />
              </Suspense>
              <Divider onlyBottom={0} />
              <SubscribeSection />
            </div>
          </div>
        </div>
        <CallToActionThreeSection />
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <ContactInfoSection />
              <Divider />
              <ContactFormSection />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default HomeOnePage;
