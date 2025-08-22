import React from "react";

import AppData from "@data/app.json";

import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import PageBanner from "@components/PageBanner";
import ContactInfoSection from "@components/sections/ContactInfo";
import ReservationFormSection from "@components/sections/ReservationForm";

export const metadata = {
    title: {
        default: "Резервация",
    },
    description: AppData.settings.siteDescription,
}

const Reservation = () => {
  return (
    <>
        <div id="tst-dynamic-banner" className="tst-dynamic-banner">
            <PageBanner pageTitle={"Резервация"} description={"Резервирайте маса в ресторант Делиорман и се насладете <br>на изискана кухня и уютна атмосфера в село Самуил."} breadTitle={"Резервация на маса"} showMap={1} />
        </div>
        <div id="tst-dynamic-content" className="tst-dynamic-content">
            <div className="tst-content-frame">
                <div className="tst-content-box">
                    <div className="container tst-p-60-60">
                        <ScrollHint />

                        <ReservationFormSection />
                        <Divider onlyBottom={0} />
                        <ContactInfoSection />
                        
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};
export default Reservation;
