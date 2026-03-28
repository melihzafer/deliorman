"use client";

import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import { useOrder } from "@library/CartContext";

/**
 * MiniCart - Legacy popup adapted to the menu ordering flow.
 */
const MiniCart = () => {
    const { orderItems, totalCount, removeItem, clearOrder, generateWhatsAppLink } = useOrder();
    const t = useTranslations("orderFlow");

    if (orderItems.length === 0) {
        return (
            <>
                <div className="tst-minicart-header">
                    <div className="tst-suptitle tst-suptitle-center"></div>
                    <h5>{t("emptyTitle")}</h5>
                </div>
                <p className="tst-text text-center" style={{ padding: "0 15px 15px" }}>
                    {t("emptyDescription")}
                </p>
                <p className="woocommerce-mini-cart__buttons buttons">
                    <Link href="/menu" className="tst-btn">{t("menuButton")}</Link>
                </p>
            </>
        );
    }

    return (
        <>
            <div className="tst-minicart-header">
                <div className="tst-suptitle tst-suptitle-center"></div>
                <h5>{t("currentOrderTitle")}</h5>
            </div>
            <ul className="woocommerce-mini-cart cart_list product_list_widget">
                {orderItems.map((item, index) => (
                <li key={`mini-cart-item-${index}`} className={`woocommerce-mini-cart-item mini_cart_item mini-cart-item-${index}`}>
                    <button
                        type="button"
                        className="remove remove_from_cart_button"
                        aria-label={t("removeItem")}
                        onClick={() => removeItem(item.title, item.amount)}
                    >
                        ×
                    </button>
                    <Link href="/menu">
                        {item.title}
                    </Link>
                    <span className="quantity">
                        {item.quantity} × <span className="woocommerce-Price-amount amount"><bdi>{item.amount || t("itemFallback")}</bdi></span>
                    </span>
                </li>
                ))}
            </ul>
            <p className="woocommerce-mini-cart__total total">
                <strong>{t("totalItems")}</strong> <span className="woocommerce-Price-amount amount"><bdi>{totalCount}</bdi></span>
            </p>
            <p className="woocommerce-mini-cart__buttons buttons">
                <Link href="/menu" className="tst-btn tst-btn-2">{t("menuButton")}</Link>
                <a
                  href={generateWhatsAppLink({
                    introText: t("whatsappIntro"),
                    thanksText: t("whatsappThanks"),
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tst-btn"
                >
                  {t("whatsappButton")}
                </a>
            </p>
            <p className="woocommerce-mini-cart__buttons buttons">
                <button type="button" className="tst-btn tst-btn-2" onClick={clearOrder}>{t("clearButton")}</button>
            </p>
        </>
    );
};
export default MiniCart;
