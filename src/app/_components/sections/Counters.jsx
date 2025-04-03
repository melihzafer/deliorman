"use client";

import { useEffect } from "react";

import Data from "@data/sections/counters.json";

import { ScrollAnimation } from "@common/scrollAnims";

const CountersSection = () => {
  useEffect(() => {
    ScrollAnimation();
  }, []);

  return (
    <>
        {/* counters */}
        <div className="row">
            {Data.items.map((item, key) => (
            <div className="col-sm-6 col-lg-3" key={`counters-item-${key}`}>

            {/* counter */}
            <div className="tst-count tst-mb-70">
                <div className="h3 tst-mb-15"><span className="tst-number" data-count={item.value}>0</span><span className="tst-color">{item.value_after}</span></div>
                <div className="tst-label">{item.label}</div>
            </div>
            {/* counter end */}

            </div>
            ))}
        </div>
        {/* counters end */}
    </>
  );
};

export default CountersSection;