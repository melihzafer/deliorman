import Data from "@data/sections/call-to-action-4.json";
import Link from "next/link";

const CallToActionFourSection = () => {
  return (
    <>
        {/* call to action 4 */}
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
                    <h2 className="tst-white-2 tst-text-shadow tst-mb-30 tst-fade-up" dangerouslySetInnerHTML={{__html : Data.title}} />
                    <div className="tst-fade-up tst-mb-30">
                        <div className="tst-text tst-text-lg tst-text-shadow tst-white-2" dangerouslySetInnerHTML={{__html : Data.description}} />
                    </div>
                    <Link href={Data.button1.link} className="tst-btn tst-btn-lg tst-btn-shadow tst-fade-up tst-res-btn tst-mr-30">{Data.button1.label}</Link>
                    <Link href={Data.button2.link} className="tst-label tst-anima-link tst-white-2 tst-fade-up">{Data.button2.label}</Link>
                    </div>
                </div>
                {/* text end */}

                </div>
                <div className="col-lg-6">

                {/* icon */}
                <div className="tst-cta-icon-wrapper tst-fade-up" style={{textAlign: 'center', padding: '60px 0'}}>
                    {/* <i className={Data.icon} style={{fontSize: '120px', color: '#f39c12', textShadow: '0 0 30px rgba(243, 156, 18, 0.3)'}}></i> */}
                    <img src={Data.image.url} alt={Data.image.alt} style={{maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}} />
                </div>
                {/* icon end */}

                </div>
            </div>
            </div>
        </div>
        {/* call to action 4 end */}
    </>
  );
};

export default CallToActionFourSection;