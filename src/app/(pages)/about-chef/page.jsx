import React from "react";
import dynamic from "next/dynamic";

import AppData from "@data/app.json";

import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import PageBanner from "@components/PageBanner";

const TestimonialSlider = dynamic( () => import("@components/sliders/Testimonial"), { ssr: false } );

export const metadata = {
  title: {
		default: "About Chef",
	},
  description: AppData.settings.siteDescription,
}

const About2 = () => {
  const Content = {
    "image": {
      "url": "/img/faces/c2.jpg",
      "alt": "cover"
    },
    "subtitle": "About Employee",
    "title": "Oscar's Story",
    "description": "<p>Assumenda possimus eaque illo iste, autem. Porro eveniet, autem ipsam vitae amet repellat repudiandae tenetur, quod corrupti consectetur cum? Repudiandae dignissimos fugiat sit nam. Tempore aspernatur quae repudiandae dolorem, beatae dolorum, praesentium itaque et quam quaerat. Cumque, consequatur!</p><p>Velit eius illo a commodi veniam beatae.</p>",
    "social": [
      {
        "link": "https://facebook.com",
        "title": "Facebook",
        "icon": "fab fa-facebook-f"
      },
      {
        "link": "https://instagram.com",
        "title": "Instagram",
        "icon": "fab fa-instagram"
      },
      {
        "link": "https://twitter.com",
        "title": "Twitter",
        "icon": "fab fa-twitter"
      },
      {
        "link": "https://youtube.com",
        "title": "Youtube",
        "icon": "fab fa-youtube"
      }
    ]
  }

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner pageTitle={"Oscar Oldman"} description={"Quaerat debitis, vel, sapiente dicta sequi <br>labore porro pariatur harum expedita."} breadTitle={"Oscar Oldman"} />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <ScrollHint />

              <div className="row align-items-center flex-sm-row-reverse">

                <div className="col-lg-6">

                  {/* about text */}
                  <div className="tst-mb-60">
                    <div className="tst-suptitle tst-mb-15" dangerouslySetInnerHTML={{__html : Content.subtitle}} />
                    <h3 className="tst-mb-30" dangerouslySetInnerHTML={{__html : Content.title}} />
                    <div className="tst-text tst-mb-30" dangerouslySetInnerHTML={{__html : Content.description}} />

                    {Content.social.map((item, key) => (
                    <a href={item.link} target="_blank" title={item.title} className="tst-icon-link" key={`about-chef-social-item-${key}`}><i className={item.icon}></i></a>
                    ))}
                  </div>
                  {/* about text end */}

                </div>

                <div className="col-lg-6">

                  {/* about video */}
                  <div className="tst-about-cover tst-mb-60">
                    <img src={Content.image.url} alt={Content.image.alt} className="tst-cover" />
                  </div>
                  {/* about video end */}

                </div>

              </div>
              
              <Divider />
              <TestimonialSlider />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default About2;