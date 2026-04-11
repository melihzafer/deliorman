import { getLocalizedCallToActionData } from "@data/sections/cta/getLocalizedCallToActionData";
import { useLocale } from "next-intl";
import { useMemo } from "react";

const CallToActionSection = () => {
    const locale = useLocale();
    const localizedData = useMemo(() => getLocalizedCallToActionData(locale), [locale]);

    return (
        <>
                {/* call to action */}
                <div className="tst-call-to-action" style={{backgroundColor: '#00000021'}}>
                        <div className="container">
                                <div className="row align-items-center">
                                        <div className="col-lg-6">

                                                {/* text */}
                                                <div className="tst-cta-frame">
                                                        <div className="tst-cta">
                                                                <div className="tst-fade-up tst-active">
                                                                        <div className="tst-suptitle tst-suptitle-mobile-md-center tst-text-shadow tst-white-2 tst-mb-15" dangerouslySetInnerHTML={{__html : localizedData.subtitle}} />
                                                                </div>
                                                                <h2 className="tst-white-2 tst-text-shadow tst-mb-30 tst-fade-up tst-active" dangerouslySetInnerHTML={{__html : localizedData.title}} />
                                                                <div className="tst-fade-up tst-active">
                                                                        <div className="tst-text tst-text-lg tst-text-shadow tst-white-2" dangerouslySetInnerHTML={{__html : localizedData.description}} />
                                                                </div>
                                                                <a href={localizedData.button1.link} style={{marginLeft: 'auto', marginRight: 'auto'}} target="_blank" className="tst-btn tst-btn-lg tst-btn-shadow tst-mt-30 tst-mr-10 tst-fade-up tst-active">
                                                                        <i className={localizedData.button1.icon}></i> 
                                                                        <span>{localizedData.button1.label}</span>
                                                                </a>
                                                              
                                                                <a href={localizedData.button2.link} style={{marginLeft: 'auto', marginRight: 'auto'}} target="_blank" className="tst-btn tst-btn-lg tst-btn-shadow tst-mt-30 tst-fade-up tst-active">
                                                                        <i className={localizedData.button2.icon}></i> 
                                                                        <span>{localizedData.button2.label}</span>
                                                                </a>
                                                        </div>
                                                </div>
                                                {/* text end */}

                                        </div>
                                        <div className="col-lg-6">

                                                {/* icon */}
                                                <div className="tst-cta-icon-wrapper tst-fade-up tst-active" style={{textAlign: 'center', padding: '60px 0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                        <i className={localizedData.icon} style={{fontSize: '120px', color: '#f39c12', textShadow: '0 0 30px rgba(243, 156, 18, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}></i>
                                                </div>
                                                {/* icon end */}

                                        </div>
                                </div>
                        </div>
                </div>
                {/* call to action end */}
        </>
    );
};

export default CallToActionSection;