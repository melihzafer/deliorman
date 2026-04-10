import Image from "next/image";
import AppData from "@data/app.json";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";

const AboutSection = () => {
    const t = useTranslations("aboutSections.intro");

    return (
        <>
            <div className="row align-items-center flex-sm-row-reverse" id="about">

              <div className="col-lg-6">

                <div className="tst-mb-60">
                  <div className="tst-suptitle tst-mb-15" dangerouslySetInnerHTML={{__html : t.raw("subtitle")}} />
                  <h3 className="tst-mb-30" dangerouslySetInnerHTML={{__html : t.raw("title")}} />
                  <p className="tst-text tst-mb-30" dangerouslySetInnerHTML={{__html : t.raw("description")}} />

                  <Link href="/about" className="tst-btn tst-anima-link tst-mb-30">{t("buttonLabel")}</Link>
                  <div className="tst-about-social">
                    {AppData.social.map((item, key) => (
                      <a href={item.link} className="tst-icon-link" title={item.title} key={`about-social-item-${key}`} target="_blank" rel="noopener noreferrer"><i className={item.icon}></i></a>
                    ))}
                  </div>
                </div>

              </div>

              <div className="col-lg-6">

                <div className="tst-about-cover tst-mb-60">
                  <Image src="/img/outdoor_footage/IMG_9339.webp" alt="About Deliorman Restaurant" className="tst-cover" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                  <div className="tst-overlay"></div>
                </div>

              </div>

            </div>
        </>
    );
};

export default AboutSection;