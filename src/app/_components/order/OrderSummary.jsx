"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useOrder } from "@library/CartContext";

/**
 * OrderSummary - Floating order bar at the bottom of the screen.
 * Expands to show full order with WhatsApp / Phone options.
 */
const OrderSummary = () => {
  const {
    orderItems,
    totalCount,
    removeItem,
    addItem,
    clearOrder,
    generateWhatsAppLink,
    generatePhoneCallLink,
    restaurantPhone,
  } = useOrder();
  const pathname = usePathname();
  const t = useTranslations("orderFlow");
  const [expanded, setExpanded] = useState(false);
  const cleanPath = pathname?.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";
  const isMenuRoute = ["/menu", "/menu-2", "/lunch-menu"].some((route) => cleanPath.startsWith(route));

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  if (!isMenuRoute || totalCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="tst-order-summary"
        aria-live="polite"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <button
          type="button"
          className="tst-order-summary-bar"
          onClick={toggleExpanded}
          aria-expanded={expanded}
          aria-label={t("reviewOrder")}
        >
          <div className="tst-order-summary-left">
            <span className="tst-order-badge">{totalCount}</span>
            <span className="tst-order-label">
              {totalCount === 1 ? t("itemSingular") : t("itemPlural")}
            </span>
          </div>
          <span className="tst-order-cta">
            {expanded ? t("hideOrder") : t("showOrder")}
          </span>
          <span
            className="tst-order-chevron"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}
          >
            <i className="fas fa-chevron-up"></i>
          </span>
        </button>

        {/* Expanded panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              className="tst-order-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="tst-order-panel-inner">
                <h5 className="tst-order-panel-title">{t("yourOrder")}</h5>

                <ul className="tst-order-list">
                  {orderItems.map((item, idx) => (
                    <li key={`order-${idx}`} className="tst-order-list-item">
                      <div className="tst-order-item-info">
                        <span className="tst-order-item-name">
                          {item.title}
                          {item.amount ? (
                            <small className="tst-order-item-amount">
                              {" "}({item.amount})
                            </small>
                          ) : null}
                        </span>
                      </div>
                      <div className="tst-order-item-controls">
                        <button
                          type="button"
                          className="tst-qty-btn tst-qty-minus"
                          onClick={() => removeItem(item.title, item.amount)}
                          aria-label={t("decreaseQty")}
                        >
                          −
                        </button>
                        <span className="tst-qty-value">{item.quantity}</span>
                        <button
                          type="button"
                          className="tst-qty-btn tst-qty-plus"
                          onClick={() => addItem({ title: item.title, amount: item.amount, price: item.price })}
                          aria-label={t("increaseQty")}
                        >
                          +
                        </button>
                      </div>
                  </li>
                  ))}
                </ul>

                <div className="tst-order-actions">
                  <a
                    href={generateWhatsAppLink({
                      introText: t("whatsappIntro"),
                      thanksText: t("whatsappThanks"),
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tst-order-action-btn tst-whatsapp-btn"
                  >
                    <i className="fab fa-whatsapp"></i> {t("orderByWhatsApp")}
                  </a>
                  <a
                    href={generatePhoneCallLink()}
                    className="tst-order-action-btn tst-phone-btn"
                  >
                    <i className="fas fa-phone-alt"></i> {t("callButton", { phone: restaurantPhone })}
                  </a>
                </div>

                <button
                  type="button"
                  className="tst-order-clear"
                  onClick={clearOrder}
                >
                  <i className="fas fa-trash-alt" style={{ marginRight: "4px" }}></i> {t("clearOrder")}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderSummary;
