import Data from "@data/sections/call-to-action-2.json";

const CallToActionTwoSection = () => {
  return (
    <>
        {/* call to action 2 */}
        <div className="tst-call-to-action">
            <div className="container">

            <div className="row align-items-center">
                <div className="col-lg-6">

                {/* text */}
                <div className="tst-cta-frame">
                    <div className="tst-cta">
                    <div className="tst-fade-up">
                        <div className="tst-suptitle tst-suptitle-mobile-md-center tst-text-shadow tst-white-2 tst-mb-15" dangerouslySetInnerHTML={{__html : Data.subtitle}} />
                    </div>
                    <h2 className="tst-white-2 tst-text-shadow tst-fade-up tst-mb-30" dangerouslySetInnerHTML={{__html : Data.title}} />
                    <div className="tst-fade-up">
                        <div className="tst-text tst-text-lg tst-text-shadow tst-white-2 tst-mb-30" dangerouslySetInnerHTML={{__html : Data.description}} />
                    </div>
                    <a href={Data.button1.link} className="tst-btn tst-btn-lg tst-btn-shadow tst-anima-link tst-fade-up tst-mr-30">{Data.button1.label}</a>
                    <a href={Data.button2.link} className="tst-label tst-res-btn tst-white-2 tst-fade-up">{Data.button2.label}</a>
                    </div>
                </div>
                {/* text end */}

                </div>
                <div className="col-lg-6">

                {/* image */}
                <img src={Data.image.url} alt={Data.image.alt} className="tst-cta-image tst-fade-up" />
                {/* image end */}

                </div>
            </div>
            </div>
        </div>
        {/* call to action 2 end */}
    </>
  );
};

export default CallToActionTwoSection;