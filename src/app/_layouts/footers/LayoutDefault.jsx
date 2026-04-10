"use client";

import Image from "next/image";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import FooterGallery from "@layouts/footers/Gallery";
import AppData from "@data/app.json";
import GoogleReviewsBadge from "@components/common/GoogleReviewsBadge";

const DefaultFooter = () => {
  const t = useTranslations("footer");

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
                    <Image src={AppData.footer.logo.url} alt={AppData.footer.logo.alt} className="tst-logo" width={180} height={60} />
</div>
                    <div className="tst-social">
                        {AppData.social.map((item, key) => (
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
                            <h5 className="tst-mb-30 tst-text-shadow">{t("aboutTitle")}</h5>
                            <div className="tst-text tst-text-shadow tst-mb-30">{t("aboutText")}</div>
                            <Link href={AppData.footer.about.button.link} className="tst-label tst-color tst-anima-link">{t("viewMenu")}</Link>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="tst-mb-60">
                            <h5 className="tst-mb-30 tst-text-shadow">{t("contactTitle")}</h5>
                            <ul className="tst-footer-contact tst-text-shadow tst-mb-30">
                                <li><span className="tst-label">{t("phoneLabel")} :</span><span className="tst-text">{t("phoneValue")}</span></li>
                                <li><span className="tst-label">{t("emailLabel")} :</span><span className="tst-text">{t("emailValue")}</span></li>
                                <li><span className="tst-label">{t("addressLabel")} :</span><span className="tst-text">{t("addressValue")}</span></li>
                            </ul>
                            <Link href={AppData.footer.contact.button.link} className="tst-label tst-color tst-anima-link">{t("reserveTable")}</Link>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="tst-mb-60">
                            <h5 className="tst-mb-30 tst-text-shadow">{t("galleryTitle")}</h5>
                            <FooterGallery items={AppData.footer.gallery.items} button={AppData.footer.gallery.button} buttonLabel={t("viewMorePhotos")} />
                        </div>
                    </div>
                </div>
                <div className="tst-spacer tst-white tst-spacer-only-bottom-space"></div>

                <div className="tst-footer-bottom">
                    <div className="tst-text" dangerouslySetInnerHTML={{__html : t.raw("copyright")}} />
                    {Array.isArray(AppData.footer?.legal?.links) && AppData.footer.legal.links.length > 0 && (
                      <div className="tst-text" style={{ opacity: 0.9 }}>
                        {AppData.footer.legal.links.map((l, idx) => (
                          <span key={`footer-legal-${idx}`}>
                            {l.link?.startsWith('/') ? (
                              <Link href={l.link} className="tst-color tst-anima-link">
                                {t("termsLink")}
                              </Link>
                            ) : (
                              <a
                                href={l.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tst-color tst-anima-link"
                              >
                                {t("termsLink")}
                              </a>
                            )}
                            {idx < AppData.footer.legal.links.length - 1 ? " · " : ""}
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
