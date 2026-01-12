"use client";

import React from "react";
import AppData from "@data/app.json";
import ScrollHint from "@layouts/scroll-hint/Index";
import PageBanner from "@components/PageBanner";
import CheckoutForm from "@components/forms/CheckoutForm";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";
import styles from "@/app/_styles/scss/Checkout.module.scss";

const Checkout = () => {
  const items = useCartStore(state => state.items);
  const getSubtotal = useCartStore(state => state.getSubtotal);

  const subtotal = getSubtotal();

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
          <PageBanner pageTitle={"Поръчка"} description={"Завършете вашата поръчка."} breadTitle={"Поръчка"} />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
          <div className="tst-content-frame">
              <div className="tst-content-box">
                  <div className="container tst-p-60-60">
                      <ScrollHint />

                      {/* checkout */}
                      <section className="tst-p-90-90">
                        <div className="container" data-sticky-container>
                          {items.length === 0 ? (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-center"
                              style={{ padding: '60px 0' }}
                            >
                              <h4>Количката е празна</h4>
                              <p className="tst-text" style={{ marginTop: '20px' }}>Добавете продукти, за да продължите с поръчката.</p>
                              <Link href="/menu" className="tst-btn tst-btn-with-icon" style={{ marginTop: '30px' }}>
                                <span className="tst-icon">
                                  <img src="/img/ui/icons/arrow-2.svg" alt="icon" />
                                </span>
                                <span>Разгледайте менюто</span>
                              </Link>
                            </motion.div>
                          ) : (
                            <div className="row">
                              <div className="col-lg-8">
                                <CheckoutForm />
                              </div>
                              <div className="col-lg-4">
                                <motion.div
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.2 }}
                                  className={styles.orderSummary}
                                  style={{ position: 'sticky', top: '140px' }}
                                >
                                  <div className={styles.summaryTitle}>Обобщение на поръчката</div>

                                  <div style={{ marginBottom: '24px' }}>
                                    {items.map((item) => (
                                      <div key={item.id} className={styles.summaryItem}>
                                        <div className={styles.itemImage}>
                                          {item.image ? (
                                            <img src={item.image} alt={item.name} />
                                          ) : (
                                            <UtensilsCrossed size={24} />
                                          )}
                                        </div>
                                        <div className={styles.itemDetails}>
                                          <div className={styles.itemName}>{item.name}</div>
                                          <div className={styles.itemQuantity}>x{item.quantity}</div>
                                        </div>
                                        <div className={styles.itemPrice}>
                                          {(item.price * item.quantity).toFixed(2)} лв.
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  <div className={styles.summaryTotal}>
                                    <div className={styles.totalRow}>
                                      <div className={styles.label}>Междинна сума:</div>
                                      <div className={styles.value}>{subtotal.toFixed(2)} лв.</div>
                                    </div>
                                    <div className={styles.totalRow}>
                                      <div className={styles.label}>Доставка:</div>
                                      <div className={styles.value}>Безплатна</div>
                                    </div>
                                    <div className={`${styles.totalRow} ${styles.final}`}>
                                      <div className={styles.label}>Общо:</div>
                                      <div className={styles.value}>{subtotal.toFixed(2)} лв.</div>
                                    </div>
                                  </div>
                                </motion.div>
                              </div>
                            </div>
                          )}
                        </div>
                      </section>
                      {/* checkout end */}

                  </div>
              </div>
          </div>
      </div>
    </>
  );
};
export default Checkout;
