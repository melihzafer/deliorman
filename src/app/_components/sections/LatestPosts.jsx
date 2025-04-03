import Data from "@data/sections/latest-posts.json";
import Date from '@library/date';
import Link from "next/link";

import BlogItem from "@components/blog/BlogItem";

const LatestPostsSection = ( { posts } ) => {
    
    return (
        <>
            {/* latest posts */}
            <div className="row align-items-center" id="blog">

              <div className="col-lg-12">

                {/* title */}
                <div className="text-center">
                  <div className="tst-suptitle tst-suptitle-center tst-mb-15" dangerouslySetInnerHTML={{__html : Data.subtitle}} />
                  <h3 className="tst-mb-30" dangerouslySetInnerHTML={{__html : Data.title}} />
                  <p className="tst-text tst-mb-60" dangerouslySetInnerHTML={{__html : Data.description}} />
                </div>
                {/* title end */}

              </div>

              {posts.slice(0, Data.numOfItems).map((item, key) => (
              <div className="col-lg-4" key={`latest-posts-item-${key}`}>
                <BlogItem item={item} />
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
            {/* blog end */}
        </>
    );
};

export default LatestPostsSection;