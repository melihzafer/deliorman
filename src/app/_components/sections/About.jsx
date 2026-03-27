import Image from "next/image";
import AppData from "@data/app.json";
import Data from "@data/sections/about.json";
import Link from "next/link";

const AboutSection = () => {

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

                  <Link href={Data.button.link} className="tst-btn tst-anima-link text-center">{Data.button.label}</Link>
                  <div style={{display: 'flex', padding: '1.5em'}}></div>
                  {AppData.social.map((item, key) => (
                  <a href={item.url} className="tst-icon-link" title={item.title} key={`about-social-item-${key}`}><i className={item.icon}></i></a>
                  ))}
                </div>
                {/* about text end */}

              </div>

              <div className="col-lg-6">

                {/* about image */}
                <div className="tst-about-cover tst-mb-60">
                  <Image src={Data.image.url} alt={Data.image.alt} className="tst-cover" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                  <div className="tst-overlay"></div>
                  {/* Video button commented out - now showing static image */}
                  {/* <div className="tst-btn-animation"></div>
                  <a className="tst-play-button" onClick={() => setOpen(true)} style={{ "cursor" : "pointer" }} data-width="10" data-height="600">
                    <i className="fas fa-play"></i>
                  </a> */}
                </div>
                {/* about image end */}

              </div>

            </div>
            {/* about end */}

            {/* <ModalVideo channel='youtube' isOpen={isOpen} videoId={Data.video.replace("https://www.youtube.com/watch?v=", "")} onClose={() => setOpen(false)} /> */}
        </>
    );
};

export default AboutSection;