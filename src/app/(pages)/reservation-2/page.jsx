import React from "react";

import AppData from "@data/app.json";

import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import PageBanner from "@components/PageBanner";
import ContactInfoSection from "@components/sections/ContactInfo";
import ReservationOpenTableSection from "@components/sections/ReservationOpenTable";

export const metadata = {
    title: {
        default: "Reservation OpenTable",
    },
    description: AppData.settings.siteDescription,
}

const Reservation2 = () => {
  return (
    <>
        <div id="tst-dynamic-banner" className="tst-dynamic-banner">
            <PageBanner pageTitle={"Online Booking"} description={"Quaerat debitis, vel, sapiente dicta sequi <br>labore porro pariatur harum expedita."} breadTitle={"Table Booking"} showMap={1} />
        </div>
        <div id="tst-dynamic-content" className="tst-dynamic-content">
            <div className="tst-content-frame">
                <div className="tst-content-box">
                    <div className="container tst-p-60-60">
                        <ScrollHint />

                        <ReservationOpenTableSection />
                        <Divider onlyBottom={0} />
                        <ContactInfoSection />
                        
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};
export default Reservation2;
