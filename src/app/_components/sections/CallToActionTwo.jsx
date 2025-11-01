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
                    <a href={Data.button1.link} className="tst-btn tst-btn-lg tst-btn-shadow tst-anima-link tst-fade-up tst-mr-30 dark">{Data.button1.label}</a>
                    <a href={Data.button2.link} className="tst-label tst-white-2 tst-fade-up dark">{Data.button2.label}</a>
                    </div>
                </div>
                {/* text end */}

                </div>
                <div className="col-lg-6">

                {/* icon */}
                <div className="tst-cta-icon-wrapper tst-fade-up" style={{textAlign: 'center', padding: '60px 0'}}>
                    <i className={Data.icon} style={{fontSize: '120px', color: '#f39c12', textShadow: '0 0 30px rgba(243, 156, 18, 0.3)'}}></i>
                </div>
                {/* icon end */}

                </div>
            </div>
            </div>
        </div>
        {/* call to action 2 end */}
    </>
  );
};

export default CallToActionTwoSection;