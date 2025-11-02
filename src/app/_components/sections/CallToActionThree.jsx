"use client";

import { useEffect, useState } from "react";
import { mapboxInit } from "@common/mapboxInit";

import Data from "@data/sections/call-to-action-3.json";
import Link from "next/link";

const CallToActionThreeSection = () => {
  const [mapLock, setMapLock] = useState(false);

  useEffect(() => {
    mapboxInit();
  }, []);

  return (
    <>
        {/* call to action 3 */}
        <div className="tst-call-to-action">
            <div className="tst-cover-frame">
                <div className="tst-map-frame">
                    <div id="map" className={`tst-map ${mapLock ? "tst-active": ""}`} />
                </div>
                <div className={`tst-overlay tst-with-map ${mapLock ? "tst-active": ""}`}></div>
                <div className={`tst-lock ${mapLock ? "tst-active": ""}`} onClick={() => setMapLock(!mapLock)}>
                    <i className={`fas ${mapLock ? "fa-unlock": "fa-lock"}`} />
                </div>
            </div>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6">

                    {/* text */}
                    <div className="tst-cta-frame">
                        <div className="tst-cta">
                        <div className="tst-fade-up">
                            <div className="tst-suptitle tst-suptitle-mobile-center tst-text-shadow tst-white-2 tst-mb-15" dangerouslySetInnerHTML={{__html : Data.subtitle}} />
                        </div>
                        <h2 className="tst-white-2 tst-text-shadow tst-fade-up tst-mb-30" dangerouslySetInnerHTML={{__html : Data.title}} />
                        <div className="tst-fade-up">
                            <div className="tst-text tst-text-lg tst-text-shadow tst-white-2 tst-mb-30" dangerouslySetInnerHTML={{__html : Data.description}} />
                        </div>
                        <Link href={Data.button.link} style={{marginLeft: 'auto', marginRight: 'auto'}} className="tst-btn tst-btn-lg tst-btn-shadow tst-res-btn tst-fade-up tst-mr-30 dark">{Data.button.label}</Link>
                        </div>
                    </div>
                    {/* text end */}

                    </div>
                </div>
            </div>
        </div>
        {/* call to action 3 end */}
    </>
  );
};

export default CallToActionThreeSection;