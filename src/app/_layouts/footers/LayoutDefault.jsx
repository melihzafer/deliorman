"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname } from 'next/navigation';
import Link from "next/link";

import AppData from "@data/app.json";
import { ScrollAnimation } from "@common/scrollAnims";

const FooterGallery = dynamic( () => import("@layouts/footers/Gallery"), { ssr: false } );

const DefaultFooter = () => {
  const asPath = usePathname();
  
  useEffect(() => {
    ScrollAnimation();
    
    // Add fade-down animation class based on screen size
    const footer = document.querySelector('footer');
    if (footer) {
      if (window.innerWidth >= 992) {
        footer.classList.add('tst-fade-down');
      } else {
        footer.classList.remove('tst-fade-down');
      }
    }

    // Handle window resize to update animation
    const handleResize = () => {
      const footer = document.querySelector('footer');
      if (footer) {
        if (window.innerWidth >= 992) {
          footer.classList.add('tst-fade-down');
        } else {
          footer.classList.remove('tst-fade-down');
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToTop = (e) => {
    window.scrollTo({top: 0, behavior: 'smooth'});
    e.preventDefault();
  }

  return (
    <>
        {/* footer */}
        <footer className="tst-white">
            <div className="container">
                <div className="tst-footer-top">
                    <div className="tst-white-circle-as-bg">
                    <img src={AppData.footer.logo.url} alt={AppData.footer.logo.alt} className="tst-logo" />
</div>
                    <div className="tst-social">
                        {AppData.social.map((item, key) => (
                        <a href={item.link} target="_blank" title={item.title} className="tst-icon-link" key={`footer-social-item-${key}`}><i className={item.icon}></i></a>
                        ))}
                    </div>
                </div>
                <div className="tst-spacer tst-white"></div>

                <div className="row">
                    <div className="col-lg-4">
                        <div className="tst-mb-60">
                            <h5 className="tst-mb-30 tst-text-shadow" dangerouslySetInnerHTML={{__html : AppData.footer.about.title}} />
                            <div className="tst-text tst-text-shadow tst-mb-30" dangerouslySetInnerHTML={{__html : AppData.footer.about.text}} />
                            <Link href={AppData.footer.about.button.link} className="tst-label tst-color tst-anima-link">{AppData.footer.about.button.label}</Link>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="tst-mb-60">
                            <h5 className="tst-mb-30 tst-text-shadow" dangerouslySetInnerHTML={{__html : AppData.footer.contact.title}} />
                            <ul className="tst-footer-contact tst-text-shadow tst-mb-30">
                                {AppData.footer.contact.items.map((item, key) => (
                                <li key={`footer-contact-item-${key}`}><span className="tst-label">{item.label} :</span><span className="tst-text">{item.value}</span></li>
                                ))}
                            </ul>
                            <Link href={AppData.footer.contact.button.link} className="tst-label tst-color tst-anima-link">{AppData.footer.contact.button.label}</Link>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="tst-mb-60">
                            <h5 className="tst-mb-30 tst-text-shadow" dangerouslySetInnerHTML={{__html : AppData.footer.gallery.title}} />
                            <FooterGallery items={AppData.footer.gallery.items} button={AppData.footer.gallery.button} />
                        </div>
                    </div>
                </div>
                <div className="tst-spacer tst-white tst-spacer-only-bottom-space"></div>

                <div className="tst-footer-bottom">
                    <div className="tst-text" dangerouslySetInnerHTML={{__html : AppData.footer.copy}} />
                    <a href="#tst-app" className="tst-label tst-color tst-anchor-scroll" onClick={ (e) => scrollToTop(e) }>Back to top</a>
                </div>
            </div>
        </footer>
        {/* footer end */}
    </>
  );
};
export default DefaultFooter;
