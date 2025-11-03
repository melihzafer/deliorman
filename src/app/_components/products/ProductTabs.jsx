"use client";

import { useEffect, useRef, useState } from "react";

const ProductTabs = ({items, active}) => {
  // Isotope
  const isotope = useRef();
  const [filterKey, setFilterKey] = useState(active);
  
  useEffect(() => {
      // Dynamically import isotope only on client side
      import("isotope-layout").then((Isotope) => {
          isotope.current = new Isotope.default(".tst-masonry-grid", {
              itemSelector: ".tst-grid-item",
              percentPosition: true,
              masonry: {
                  columnWidth: '.tst-grid-sizer'
              },
              transitionDuration: '0.5s',
          });
      });
  }, []);

  useEffect(() => {
      if (isotope.current) {
          filterKey === "*"
          ? isotope.current.arrange({ filter: `*` })
          : isotope.current.arrange({ filter: `.tst-${filterKey}-tab` });
      }
  }, [filterKey]);
  
  const handleFilterKeyChange = (key, e) => {
      e.preventDefault();
      setFilterKey(key);
      const filterLinks = document.querySelectorAll(".tst-filter a");
      filterLinks.forEach((filter) => {
          const filterValue = filter.getAttribute("data-filter");
          if (filterValue == 'tst-'+key+'-tab') {
              filter.classList.add("tst-active");
          } else {
              filter.classList.remove("tst-active");
          }
      });
  };

  return (
    <>   
      {/* filter */}
      <div className="tst-filter">
        {items.map((tab, key) => (
        <a href="#." data-filter={`tst-${tab.slug}-tab`} key={`product-tabs-item-${key}`} className={tab.slug == active ? "tst-filter-link tst-active" : "tst-filter-link"} onClick={(e) => handleFilterKeyChange(tab.slug, e)}>{tab.name}</a>
        ))}
      </div>
      {/* filter end */}
    </>
  );
};
export default ProductTabs;
