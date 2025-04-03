import React, { Suspense } from "react";

import { getSortedPostsData } from "@library/posts";

import AppData from "@data/app.json";

import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import PageBanner from "@components/PageBanner";
import CallToActionSection from "@components/sections/CallToAction";
import LatestPostsSection from "@components/sections/LatestPosts";
import SubscribeSection from "@components/sections/Subscribe";

export const metadata = {
  title: {
		default: "History",
	},
  description: AppData.settings.siteDescription,
}

async function History() {
  const posts = await getAllPosts();

  const Content = {
    "subtitle": "History",
    "title": "Delicious traditions <br>since 1996",
    "description": "Assumenda possimus eaque illo iste, autem. Porro eveniet, autem ipsam vitae amet repellat repudiandae tenetur, quod corrupti consectetur cum? Repudiandae dignissimos fugiat sit nam. Tempore aspernatur quae repudiandae dolorem, beatae dolorum, praesentium. Cumque, consequatur!"
  }

  const Timeline = [
    {
      "image": {
        "url": "/img/history/1.jpg",
        "alt": "img"
      },
      "title": "Our first, modest restaurant was founded",
      "year": "1996",
      "text": "Assumenda possimus eaque illo iste, autem. Porro eveniet, autem ipsam vitae amet repellat repudiandae tenetur, quod corrupti consectetur cum? Repudiandae dignissimos fugiat sit nam. Tempore aspernatur."
    },
    {
      "image": {
        "url": "/img/history/2.jpg",
        "alt": "img"
      },
      "title": "Oscar Numan has started cooking <br>for you",
      "year": "2001",
      "text": "Assumenda possimus eaque illo iste, autem. Porro eveniet, autem ipsam vitae amet repellat repudiandae tenetur, quod corrupti consectetur cum? Repudiandae dignissimos fugiat sit nam. Tempore aspernatur."
    },
    {
      "image": {
        "url": "/img/history/3.jpg",
        "alt": "img"
      },
      "title": "A new restaurant has been established in London",
      "year": "2004",
      "text": "Assumenda possimus eaque illo iste, autem. Quod corrupti consectetur cum. Repudiandae dignissimos fugiat sit nam. Tempore aspernatur."
    },
    {
      "image": {
        "url": "/img/history/4.jpg",
        "alt": "img"
      },
      "title": "A new restaurant was opened in Paris",
      "year": "2010",
      "text": "Porro eveniet, autem ipsam vitae amet repellat repudiandae tenetur, quod corrupti consectetur cum? Repudiandae dignissimos fugiat sit nam. Tempore aspernatur."
    },
    {
      "image": {
        "url": "/img/history/5.jpg",
        "alt": "img"
      },
      "title": "We got a <br>Michelin star",
      "year": "2012",
      "text": "Assumenda possimus eaque illo iste, autem. Porro eveniet, autem ipsam vitae amet repellat repudiandae tenetur, quod corrupti consectetur cum? Repudiandae dignissimos fugiat sit nam. Tempore aspernatur."
    },
    {
      "image": {
        "url": "/img/history/6.jpg",
        "alt": "img"
      },
      "title": "Established own address delivery",
      "year": "2019",
      "text": "Porro eveniet, autem ipsam vitae amet repellat repudiandae tenetur, quod corrupti consectetur cum? Repudiandae dignissimos fugiat sit nam. Tempore aspernatur."
    }
  ];

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner pageTitle={"Our History"} pageSubTitle={"Since 1996"} description={"Quaerat debitis, vel, sapiente dicta sequi <br>labore porro pariatur harum expedita."} breadTitle={"History"} />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <ScrollHint />

              <div className="row align-items-center flex-sm-row-reverse">

                <div className="col-lg-12">

                  {/* about text */}
                  <div className="tst-mb-60 text-center">
                    <div className="tst-suptitle tst-suptitle-center tst-mb-15" dangerouslySetInnerHTML={{__html : Content.subtitle}} />
                    <h3 className="tst-mb-30" dangerouslySetInnerHTML={{__html : Content.title}} />
                    <p className="tst-text tst-mb-30" dangerouslySetInnerHTML={{__html : Content.description}} />
                  </div>
                  {/* about text end */}

                </div>

                <div className="col-lg-12">

                  <div className="tst-timeline">

                    {Timeline.map((item, key) => (
                    <div className="tst-timeline-item tst-mb-30" key={`history-item-${key}`}>
                      <div className="tst-year tst-mb-15">{item.year}</div>
                      <div className="tst-tl-content">
                        <div className="tst-ilust">
                          <img src={item.image.url} alt={item.image.alt} />
                        </div>
                        <div className="tst-tl-text-frame">
                          <h4 className="tst-mb-30">{item.title}</h4>
                          <p className="tst-text">{item.text}</p>
                        </div>
                      </div>
                    </div>
                    ))}

                  </div>

                </div>

              </div>

            </div>
          </div>
        </div>
        <CallToActionSection />
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <Suspense fallback={<div>Loading...</div>}>
                <LatestPostsSection posts={posts} />
              </Suspense>
              <Divider onlyBottom={0} />
              <SubscribeSection />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default History;

async function getAllPosts() {
  const allPosts = getSortedPostsData();
  return allPosts;
}