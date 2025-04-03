"use client";

import Data from "@data/sections/hero.json";
import Link from "next/link";
import { useEffect } from "react";

import { ScrollAnimation } from "@common/scrollAnims";

const Hero = ( { bgType } ) => {
    useEffect(() => {
        ScrollAnimation();
    }, []);

    return (
        <>
            {/* banner */}
            <div className="tst-banner">
                <div className="tst-cover-frame">
                    {bgType == 'video' ? (
                    <video className="tst-cover tst-parallax" muted playsInline autoPlay loop>
                        <source src={Data.video.url} />
                    </video>
                    ) : (
                    <img src={Data.image.url} alt={Data.image.alt} className="tst-cover tst-parallax" />
                    )}
                    <div className="tst-overlay"></div>
                </div>
                <div className="tst-banner-content-frame">
                    <div className="container">
                        <div className="tst-main-title-frame">
                        <div className="tst-main-title">
                            <div className="tst-suptitle tst-suptitle-mobile-center tst-text-shadow tst-white-2 tst-mb-15">{Data.subtitle}</div>
                            <h1 className="tst-white-2 tst-text-shadow tst-mb-30" dangerouslySetInnerHTML={{__html : Data.title}} />
                            <div className="tst-text tst-text-shadow tst-text-lg tst-white-2 tst-mb-30" dangerouslySetInnerHTML={{__html : Data.description}} />
                            <Link href={Data.button1.link} className="tst-btn tst-btn-lg tst-btn-shadow tst-res-btn tst-mr-30">{Data.button1.label}</Link>
                            <Link href={Data.button2.link} className="tst-label tst-white-2">{Data.button2.label}</Link>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* banner end */}
        </>
    );
}
export default Hero;