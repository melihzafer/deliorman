"use client";

import BlogItem from "@components/blog/BlogItem";
import Link from "next/link";

import Data from "@data/sections/popular-posts.json";

const PopularPostsSlider = ( { posts } ) => {
    
    return (
        <>
            {/* popular */}
            <div className="row align-items-center">

              <div className="col-lg-12">

                {/* title */}
                <div className="text-center">
                  <div className="tst-suptitle tst-suptitle-center tst-mb-15">{Data.subtitle}</div>
                  <h3 className="tst-mb-30" dangerouslySetInnerHTML={{__html : Data.title}} />
                  <p className="tst-text tst-mb-60" dangerouslySetInnerHTML={{__html : Data.description}} />
                </div>
                {/* title end */}

              </div>

              {posts.slice(0, 3).map((item, key) => (
              <div className="col-lg-4" key={`blog-popular-item-${key}`}>
                <BlogItem item={item} popular={1} />
              </div>
              ))}

              <div className="col-lg-12">

                {/* read more */}
                <div className="tst-read-more">
                  <div className="tst-text" dangerouslySetInnerHTML={{__html : Data.button.info}} />
                  <Link href={Data.button.link} className="tst-btn tst-anima-link">{Data.button.label}</Link>
                </div>
                {/* read more end */}

              </div>
            </div>
            {/* popular end */}
        </>
    );
};

export default PopularPostsSlider;