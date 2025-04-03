"use client";

import AppData from "@data/app.json";
import Data from "@data/sections/about.json";
import Link from "next/link";

import { useState } from 'react';

import ModalVideo from 'react-modal-video'
import 'react-modal-video/css/modal-video.css'

const AboutSection = () => {
    const [isOpen, setOpen] = useState(false);

    return (
        <>
            {/* about */}
            <div className="row align-items-center flex-sm-row-reverse" id="about">

              <div className="col-lg-6">

                {/* about text */}
                <div className="tst-mb-60">
                  <div className="tst-suptitle tst-mb-15" dangerouslySetInnerHTML={{__html : Data.subtitle}} />
                  <h3 className="tst-mb-30" dangerouslySetInnerHTML={{__html : Data.title}} />
                  <p className="tst-text tst-mb-30" dangerouslySetInnerHTML={{__html : Data.description}} />

                  <Link href={Data.button.link} className="tst-btn tst-anima-link tst-mr-30">{Data.button.label}</Link>
                  
                  {AppData.social.map((item, key) => (
                  <a href={item.url} className="tst-icon-link" title={item.title} key={`about-social-item-${key}`}><i className={item.icon}></i></a>
                  ))}
                </div>
                {/* about text end */}

              </div>

              <div className="col-lg-6">

                {/* about video */}
                <div className="tst-about-cover tst-mb-60">
                  <img src={Data.image.url} alt={Data.image.alt} className="tst-cover" />
                  <div className="tst-overlay"></div>
                  <div className="tst-btn-animation"></div>
                  <a className="tst-play-button" onClick={() => setOpen(true)} style={{ "cursor" : "pointer" }} data-width="10" data-height="600">
                    <i className="fas fa-play"></i>
                  </a>
                </div>
                {/* about video end */}

              </div>

            </div>
            {/* about end */}

            <ModalVideo channel='youtube' isOpen={isOpen} videoId={Data.video.replace("https://www.youtube.com/watch?v=", "")} onClose={() => setOpen(false)} />
        </>
    );
};

export default AboutSection;