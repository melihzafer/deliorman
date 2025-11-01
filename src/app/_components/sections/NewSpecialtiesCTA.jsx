"use client";

import Data from "@data/sections/new-specialties-cta.json";

const NewSpecialtiesCTA = () => {
    return (
        <>
            {/* New Specialties Call to Action */}
            <div className="tst-call-to-action" style={{backgroundColor: '#1a2f33'}}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 order-lg-2">
                            {/* text */}
                            <div className="tst-cta-frame">
                                <div className="tst-cta">
                                    <div className="tst-fade-up">
                                        <div className="tst-suptitle tst-suptitle-mobile-md-center tst-mb-15" style={{color: '#d4a373'}} dangerouslySetInnerHTML={{__html : Data.subtitle}} />
                                    </div>
                                    <h2 className="tst-white-2 tst-mb-30 tst-fade-up" dangerouslySetInnerHTML={{__html : Data.title}} />
                                    <div className="tst-fade-up">
                                        <div className="tst-text tst-text-lg tst-white-2 tst-mb-40" dangerouslySetInnerHTML={{__html : Data.description}} />
                                    </div>

                                    {/* Features */}
                                    <div className="row tst-mb-30">
                                        {Data.features.map((feature, index) => (
                                        <div className="col-lg-12 tst-mb-20" key={`feature-${index}`}>
                                            <div className="tst-icon-box-inline tst-fade-up">
                                                <div className="tst-icon-box-icon" style={{color: '#d4a373', marginRight: '15px'}}>
                                                    <i className={feature.icon} style={{fontSize: '24px'}}></i>
                                                </div>
                                                <div className="tst-icon-box-content">
                                                    <h6 className="tst-white-2 tst-mb-5">{feature.title}</h6>
                                                    <p className="tst-text tst-white-2" style={{opacity: '0.8', margin: 0}}>{feature.text}</p>
                                                </div>
                                            </div>
                                        </div>
                                        ))}
                                    </div>

                                    <a href={Data.button.link} className="tst-btn tst-btn-lg tst-btn-shadow tst-fade-up">
                                        <i className={Data.button.icon}></i> 
                                        {Data.button.label}
                                    </a>
                                </div>
                            </div>
                            {/* text end */}
                        </div>
                        <div className="col-lg-6 order-lg-1">
                            {/* image */}
                            <img 
                                src={Data.image.url} 
                                alt={Data.image.alt} 
                                className="tst-cta-image tst-fade-up" 
                                style={{borderRadius: '15px'}}
                                onError={(e) => {
                                    e.target.src = '/img/bg.jpg';
                                }}
                            />
                            {/* image end */}
                        </div>
                    </div>
                </div>
            </div>
            {/* New Specialties Call to Action end */}
        </>
    );
};

export default NewSpecialtiesCTA;
