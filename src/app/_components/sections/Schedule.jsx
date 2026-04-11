import Image from "next/image";
import { getLocalizedScheduleData } from "@data/sections/schedule/getLocalizedScheduleData";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import DividerModule from "../../_layouts/divider/Index";
import { useMemo } from "react";

const ScheduleSection = () => {
    const locale = useLocale();
    const localizedData = useMemo(() => getLocalizedScheduleData(locale), [locale]);

    return (
        <>
            {/* schedule */}
                  <div className="tst-banner-sm">

                    <div className="tst-cover-frame">
                    <Image src={localizedData.image.url} alt={localizedData.image.alt} className="tst-cover" fill sizes="100vw" style={{ objectFit: 'cover' }} />
                    <div className="tst-overlay tst-overlay-dark"></div>
                    </div>

                    <div className="row align-items-center">

                    <div className="col-lg-8">

                      <div className="tst-text-frame">
                      <div className="tst-suptitle tst-suptitle-mobile-center tst-white-2 tst-mb-15">{localizedData.subtitle}</div>
                      <h2 className="tst-white-2 tst-mb-30" dangerouslySetInnerHTML={{__html : localizedData.title}} />
                      <p className="tst-text tst-white-2 tst-mb-30" dangerouslySetInnerHTML={{__html : localizedData.description}} />

                      <div className="tst-btn-mobile">
                        <div className="tst-schedule-spacer"></div>
                        <Link href={localizedData.button2.link} style={{marginLeft: 'auto', marginRight: 'auto'}} className="tst-btn tst-res-btn light"><span>{localizedData.buttonLabel}</span></Link>
                      </div>
                      </div>

                    </div>
                    <div className="col-lg-4">

                      <div className="tst-wh-frame tst-pb-60" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      {localizedData.items.map((item, key) => (
                      <div className={key == 0 ? "tst-mb-2": ""} key={`schedule-item-${key}`}>
                        <div className="tst-label">{item.label}</div>
                        <div className="h5">{item.from.hours} <span className="tst-color">:</span> {item.from.minutes}</div>
                        <div className="h5">{item.to.hours} <span className="tst-color">:</span> {item.to.minutes}</div>
                        <br />
                        <DividerModule/>
                      </div>
                      ))}
                      </div>

                    </div>
                    </div>

                  </div>
                  {/* schedule end */}
        </>
    );
}
export default ScheduleSection;
