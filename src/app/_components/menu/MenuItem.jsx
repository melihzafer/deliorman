"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";

const MenuItem = memo(function MenuItem({ item }) {
  return (
    <div className="tst-menu-book-item tst-mbi-3">
      <div className="tst-menu-book-descr">
        <div className="tst-menu-book-name" style={{ maxWidth: "100%" }}>
          <h5 className="tst-mb-15">{item.title}</h5>
          <div className="tst-text" dangerouslySetInnerHTML={{ __html: item.text }} />
          <div className="tst-spacer-sm"></div>
        </div>
        <div className="tst-menu-book-bottom">
          <div className="tst-menu-book-price">
            <div className="tst-price">{item.amount}</div>
          </div>
        </div>
      </div>
    </div>
  );
});
export default MenuItem;