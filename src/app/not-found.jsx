import Link from "next/link";
import Header from "@layouts/headers/Index";
import Footer from "@layouts/footers/Index";

const NotFound = () => {
  return (
    <>
      <Header layout={"default"} />

      <div id="tst-dynamic-banner" className="tst-dynamic-banner">

        {/* banner -*/}
        <div className="tst-banner">
          <div className="tst-cover-frame" style={{"overflow": "hidden"}}>
            <img src="/img/banners/banner-sm-1.jpg" alt="cover" className="tst-cover tst-parallax" />
            <div className="tst-overlay"></div>
          </div>
          <div className="tst-banner-content-frame">
            <div className="container">
              <div className="tst-main-title-frame">
                <div className="tst-main-title text-center">
                  <div className="tst-suptitle tst-suptitle-center tst-suptitle-mobile-center tst-text-shadow tst-white-2 tst-mb-15">404</div>
                  <h1 className="tst-white-2 tst-text-shadow tst-mb-30">Oops! Where are we?</h1>
                  <div className="tst-text tst-text-shadow tst-text-lg tst-white-2 tst-mb-30">Page not Found! The page you are looking for was moved,<br/> removed, renamed or might never existed.</div>
                  <Link href="/" className="tst-btn">
                    <span>Back to homepage</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* banner end */}

      </div>

      <Footer layout={"default"} />
    </>
  );
};
export default NotFound;
