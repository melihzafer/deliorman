import Image from "next/image";
import Data from "@data/sections/cta/call-to-action-4.json";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";

const CallToActionFourSection = () => {
  const t = useTranslations("aboutSections");
  const content = t.raw("cta");

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
                    <div className="tst-fade-up tst-active">
                        <div className="tst-suptitle tst-suptitle-mobile-md-center tst-text-shadow tst-white-2 tst-mb-15" dangerouslySetInnerHTML={{__html : content.subtitle}} />
                    </div>
                    <h2 className="tst-white-2 tst-text-shadow tst-mb-30 tst-fade-up tst-active" dangerouslySetInnerHTML={{__html : content.title}} />
                    <div className="tst-fade-up tst-mb-30">
                        <div className="tst-text tst-text-lg tst-text-shadow tst-white-2" dangerouslySetInnerHTML={{__html : content.description}} />
                    </div>

                    <Link href={Data.button1.link} style={{marginLeft: 'auto', marginRight: 'auto'}} className="tst-btn tst-btn-lg tst-btn-shadow tst-fade-up tst-active tst-res-btn tst-mr-30"><span>{content.button1Label}</span></Link>
                    <div style={{display: 'flex', width: '1em', height: '1em'}}></div>
                    <Link href={Data.button2.link} style={{marginLeft: 'auto', marginRight: 'auto'}} className="tst-btn tst-btn-lg tst-btn-shadow tst-fade-up tst-active tst-res-btn tst-white-2"><span>{content.button2Label}</span></Link>
                    </div>
                </div>
                {/* text end */}

                </div>
                <div className="col-lg-6">

                {/* icon */}
                <div className="tst-cta-icon-wrapper tst-fade-up tst-active" style={{textAlign: 'center', padding: '60px 0'}}>
                    {/* <i className={Data.icon} style={{fontSize: '120px', color: '#f39c12', textShadow: '0 0 30px rgba(243, 156, 18, 0.3)'}}></i> */}
                    <Image src={Data.image.url} alt={Data.image.alt} width={800} height={500} style={{maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}} />
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
