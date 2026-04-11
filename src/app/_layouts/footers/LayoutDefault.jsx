"use client";

import Image from "next/image";
import { Link } from "@/src/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import FooterGallery from "@layouts/footers/Gallery";
import { getLocalizedAppData } from "@data/getLocalizedAppData";
import GoogleReviewsBadge from "@components/common/GoogleReviewsBadge";
import { useMemo } from "react";

const DefaultFooter = () => {
  const locale = useLocale();
  const t = useTranslations("footer");
  const localizedAppData = useMemo(() => getLocalizedAppData(locale), [locale]);

  const scrollToTop = (e) => {
    window.scrollTo({top: 0, behavior: 'smooth'});
    e.preventDefault();
  }

  return (
    <>
        {/* footer */}
        <footer className="tst-white" style={{ minHeight: '600px' }}>
            <div className="container">
                <div className="tst-footer-top">
                    <div className="tst-white-circle-as-bg">
                    <Image src={localizedAppData.footer.logo.url} alt={localizedAppData.footer.logo.alt} className="tst-logo" width={180} height={60} />
</div>
                    <div className="tst-social">
                        {localizedAppData.social.map((item, key) => (
                          item.link?.startsWith('/') ? (
                            <Link href={item.link} title={item.title} className="tst-icon-link" key={`footer-social-item-${key}`}>
                              <i className={item.icon}></i>
                            </Link>
                          ) : (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" title={item.title} className="tst-icon-link" key={`footer-social-item-${key}`}>
                              <i className={item.icon}></i>
                            </a>
                          )
                        ))}
                        <GoogleReviewsBadge />
                    </div>
                </div>
                <div className="tst-spacer tst-white"></div>

                <div className="row">
                    <div className="col-lg-4">
                        <div className="tst-mb-60">
                            <h5 className="tst-mb-30 tst-text-shadow">{localizedAppData.footer.about.title || t("aboutTitle")}</h5>
                            <div className="tst-text tst-text-shadow tst-mb-30">{localizedAppData.footer.about.text || t("aboutText")}</div>
                            <Link href={localizedAppData.footer.about.button.link} className="tst-label tst-color tst-anima-link">{localizedAppData.footer.about.button.label || t("viewMenu")}</Link>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="tst-mb-60">
                            <h5 className="tst-mb-30 tst-text-shadow">{localizedAppData.footer.contact.title || t("contactTitle")}</h5>
                            <ul className="tst-footer-contact tst-text-shadow tst-mb-30">
                                <li><span className="tst-label">{t("phoneLabel")} :</span><span className="tst-text">{t("phoneValue")}</span></li>
                                <li><span className="tst-label">{t("emailLabel")} :</span><span className="tst-text">{t("emailValue")}</span></li>
                                <li><span className="tst-label">{t("addressLabel")} :</span><span className="tst-text">{t("addressValue")}</span></li>
                            </ul>
                            <Link href={localizedAppData.footer.contact.button.link} className="tst-label tst-color tst-anima-link">{localizedAppData.footer.contact.button.label || t("reserveTable")}</Link>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="tst-mb-60">
                            <h5 className="tst-mb-30 tst-text-shadow">{localizedAppData.footer.gallery.title || t("galleryTitle")}</h5>
                            <FooterGallery items={localizedAppData.footer.gallery.items} button={localizedAppData.footer.gallery.button} buttonLabel={localizedAppData.footer.gallery.button.label || t("viewMorePhotos")} />
                        </div>
                    </div>
                </div>
                <div className="tst-spacer tst-white tst-spacer-only-bottom-space"></div>

                <div className="tst-footer-bottom">
                    <div className="tst-text" dangerouslySetInnerHTML={{__html : t.raw("copyright")}} />
                    {Array.isArray(localizedAppData.footer?.legal?.links) && localizedAppData.footer.legal.links.length > 0 && (
                      <div className="tst-text" style={{ opacity: 0.9 }}>
                        {localizedAppData.footer.legal.links.map((l, idx) => (
                          <span key={`footer-legal-${idx}`}>
                            {l.link?.startsWith('/') ? (
                              <Link href={l.link} className="tst-color tst-anima-link">
                                {l.label || t("termsLink")}
                              </Link>
                            ) : (
                              <a
                                href={l.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tst-color tst-anima-link"
                              >
                                {l.label || t("termsLink")}
                              </a>
                            )}
                            {idx < localizedAppData.footer.legal.links.length - 1 ? " · " : ""}
                          </span>
                        ))}
                      </div>
                    )}
                    <a href="#tst-app" className="tst-label tst-color tst-anchor-scroll" onClick={ (e) => scrollToTop(e) }>{t("toTop")}</a>
                </div>
            </div>
        </footer>
        {/* footer end */}
    </>
  );
};
export default DefaultFooter;
