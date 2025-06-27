"use client";

import Data from "@data/sections/schedule.json";
import Link from "next/link";
import DividerModule from "../../_layouts/divider/Index";

const ScheduleSection = () => {
    return (
        <>
            {/* schedule */}
                  <div className="tst-banner-sm">

                    <div className="tst-cover-frame">
                    <img src={Data.image.url} alt={Data.image.alt} className="tst-cover" />
                    <div className="tst-overlay"></div>
                    </div>

                    <div className="row align-items-center">

                    <div className="col-lg-8">

                      <div className="tst-text-frame">
                      <div className="tst-suptitle tst-suptitle-mobile-center tst-white-2 tst-mb-15">{Data.subtitle}</div>
                      <h2 className="tst-white-2 tst-mb-30" dangerouslySetInnerHTML={{__html : Data.title}} />
                      <p className="tst-text tst-white-2 tst-mb-30" dangerouslySetInnerHTML={{__html : Data.description}} />

                      <div className="tst-btn-mobile">
                        <Link href={Data.button2.link} className="tst-btn tst-res-btn tst-mr-30 light">{Data.button2.label}</Link>
                        {/* <Link href={Data.button2.link} className="tst-label tst-white-2">{Data.button2.label}</Link> Reservation */}
                      </div>
                      </div>

                    </div>
                    <div className="col-lg-4">

                      <div className="tst-wh-frame tst-pb-60" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      {Data.items.map((item, key) => (
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