"use client";

import { memo, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useOrder } from "@library/CartContext";

/**
 * MenuItem - Memoized to prevent re-renders when sibling items change
 * Uses OrderContext for reactive menu ordering updates.
 */
const MenuItem = memo(function MenuItem({ item }) {
  const { addItem } = useOrder();
  const [buttonAdded, setButtonAdded] = useState(false);
  const t = useTranslations("menu");

  const handleAddToOrder = useCallback(() => {
    addItem(item);
    setButtonAdded(true);
    setTimeout(() => setButtonAdded(false), 600);
  }, [addItem, item]);

  return (
    <>
      <div className="tst-menu-book-item tst-mbi-3">
        <div className="tst-menu-book-descr">
            <div className="tst-menu-book-name" style={{ maxWidth: "80%" }}>
            <h5 className="tst-mb-15">{item.title}</h5>
            <div className="tst-text" dangerouslySetInnerHTML={{ __html: item.text }} />
            <div className="tst-spacer-sm"></div>
            </div>
            <div className="tst-menu-book-bottom">
            <div className="tst-menu-book-price">
                
                <div className="tst-price">{/*<span className="tst-symbol">{item.currency}</span>*/}{item.amount}</div>
                {/* <div className="tst-weight">{item.weight}</div> */}
            </div>
            <button
              type="button"
              className={`tst-btn tst-cart-btn ${buttonAdded ? "tst-added" : ""}`}
              title={t("addToOrder")}
              aria-label={t("addSpecificItem", { item: item.title })}
              onClick={handleAddToOrder}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
                <path
                    d="M87.7,33.1l-0.8-10.8C86,10.4,76,1,64,1s-22.1,9.4-22.9,21.3l-0.8,10.8H28.8c-4.7,0-8.6,3.7-9,8.4l-5.4,75.9c0,0,0,0,0,0 c-0.2,2.5,0.7,5,2.4,6.8s4.1,2.9,6.6,2.9h81.3c2.5,0,4.9-1,6.6-2.9c1.7-1.8,2.6-4.3,2.4-6.8l-5.4-75.2c-0.4-5.1-4.6-9-9.7-9H87.7z M47.1,22.7C47.7,13.9,55.1,7,64,7s16.3,6.9,16.9,15.7l0.7,10.4H46.3L47.1,22.7z M102.3,42.6l5.4,75.2c0.1,0.8-0.2,1.6-0.8,2.3 c-0.6,0.6-1.4,1-2.2,1H23.4c-0.8,0-1.6-0.3-2.2-1s-0.9-1.4-0.8-2.3h0l5.4-75.9c0.1-1.6,1.4-2.8,3-2.8h11.1l-0.6,8 c-0.1,1.7,1.1,3.1,2.8,3.2c0.1,0,0.1,0,0.2,0c1.6,0,2.9-1.2,3-2.8l0.6-8.4h36.2l0.6,8.4c0.1,1.7,1.5,2.9,3.2,2.8 c1.7-0.1,2.9-1.5,2.8-3.2l-0.6-8h10.5C100.5,39.1,102.1,40.6,102.3,42.6z" />
                </svg>
            </button>
            </div>
        </div>
      </div>
    </>
  );
});
export default MenuItem;
