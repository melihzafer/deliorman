import Data from "@data/sections/subscribe.json";
import AppData from "@data/app.json";

const SubscribeSection = () => {
  return (
    <>
        {/* subscribe */}
        <div className="tst-banner-sm">
            <div className="tst-cover-frame">
                <img src={Data.image.url} alt={Data.image.alt} className="tst-cover" />
                <div className="tst-overlay"></div>
            </div>
            <div className="row align-items-center">
                <div className="col-lg-12">
                    <div className="tst-text-frame text-center">
                        <div className="tst-suptitle tst-suptitle-mobile-center tst-suptitle-center tst-text-shadow tst-white-2 tst-mb-15" dangerouslySetInnerHTML={{__html : Data.subtitle}} />
                        <h2 className="tst-white-2 tst-text-shadow tst-mb-30" dangerouslySetInnerHTML={{__html : Data.title}} />
                        <p className="tst-text tst-white-2 tst-text-shadow tst-mb-30" dangerouslySetInnerHTML={{__html : Data.description}} />
                        <form action={AppData.settings.mailchimp.url} method="post" target="_blank">
                            <input type="email" placeholder="Enter your email here" name="EMAIL" required />
                            <button className="tst-btn" type="submit">Subscribe</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        {/* subscribe end */}
    </>
  );
};

export default SubscribeSection;