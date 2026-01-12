"use client";

import React from "react";
import PageBanner from "@components/PageBanner";
import ScrollHint from "@layouts/scroll-hint/Index";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import { ShoppingCart, Trash2, Plus, Minus, X, ArrowRight, ArrowLeft, Package, Truck, UtensilsCrossed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "@/app/_styles/scss/Cart.module.scss";

const Cart = () => {
  const items = useCartStore(state => state.items);
  const getSubtotal = useCartStore(state => state.getSubtotal);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);
  const clearCart = useCartStore(state => state.clearCart);

  const subtotal = getSubtotal();
  const deliveryFee = 0; // Can be configured later
  const total = subtotal + deliveryFee;

  const handleClearCart = () => {
    if (window.confirm('Сигурни ли сте, че искате да изпразните количката?')) {
      clearCart();
    }
  };

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
          <PageBanner pageTitle={"Вашата поръчка"} description={"Прегледайте и завършете вашата поръчка."} breadTitle={"Количка"} />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
          <div className="tst-content-frame">
              <div className="tst-content-box">
                  <div className="container tst-p-60-60">
                      <ScrollHint />

                      {/* cart */}
                      <section className="tst-p-90-90">
                        <div className="container">
                          {items.length === 0 ? (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={styles.emptyState}
                            >
                              <div className={styles.emptyIcon}>
                                <ShoppingCart size={48} />
                              </div>
                              <h4>Количката е празна</h4>
                              <p className="tst-text">Добавете продукти, за да продължите с поръчката.</p>
                              <Link href="/menu" className="tst-btn tst-btn-with-icon">
                                <span className="tst-icon">
                                  <img src="/img/ui/icons/arrow-2.svg" alt="icon" />
                                </span>
                                <span>Разгледайте менюто</span>
                              </Link>
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              {/* Cart Header */}
                              <div className={styles.cartHeader}>
                                <div className={styles.headerLeft}>
                                  <h3>
                                    <ShoppingCart size={28} />
                                    <span>Вашата количка</span>
                                  </h3>
                                  <p className={styles.itemCount}>
                                    {items.length} {items.length === 1 ? 'продукт' : 'продукта'}
                                  </p>
                                </div>
                                {items.length > 0 && (
                                  <button onClick={handleClearCart} className={styles.clearButton}>
                                    <Trash2 size={16} />
                                    <span>Изпразни количката</span>
                                  </button>
                                )}
                              </div>

                              {/* Cart Table */}
                              <div className={styles.cartTable}>
                                <div className={styles.tableHeader}>
                                  <div>Продукт</div>
                                  <div>Количество</div>
                                  <div>Цена</div>
                                  <div>Общо</div>
                                  <div></div>
                                </div>

                                <AnimatePresence mode="popLayout">
                                  {items.map((item) => (
                                    <motion.div
                                      key={item.id}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: 20 }}
                                      layout
                                      className={styles.cartItem}
                                    >
                                      <div className={styles.productInfo}>
                                        <div className={styles.productImage}>
                                          {item.image ? (
                                            <img src={item.image} alt={item.name} />
                                          ) : (
                                            <UtensilsCrossed size={32} />
                                          )}
                                        </div>
                                        <div className={styles.productDetails}>
                                          <div className={styles.productName}>{item.name}</div>
                                          <div className={styles.productMeta}>
                                            {item.category || 'Основно ястие'}
                                          </div>
                                        </div>
                                      </div>

                                      <div className={styles.quantityControl}>
                                        <button
                                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                          disabled={item.quantity <= 1}
                                        >
                                          <Minus size={16} />
                                        </button>
                                        <span className={styles.quantity}>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                          <Plus size={16} />
                                        </button>
                                      </div>

                                      <div className={styles.price}>
                                        {item.price.toFixed(2)} лв.
                                      </div>

                                      <div className={styles.total}>
                                        {(item.price * item.quantity).toFixed(2)} лв.
                                      </div>

                                      <button
                                        onClick={() => removeItem(item.id)}
                                        className={styles.removeButton}
                                      >
                                        <X size={20} />
                                      </button>
                                    </motion.div>
                                  ))}
                                </AnimatePresence>
                              </div>

                              {/* Cart Summary */}
                              <div className={styles.cartSummary}>
                                <div className={styles.summaryRow}>
                                  <div className={styles.label}>
                                    <Package size={18} />
                                    <span>Междинна сума:</span>
                                  </div>
                                  <div className={styles.value}>{subtotal.toFixed(2)} лв.</div>
                                </div>
                                <div className={styles.summaryRow}>
                                  <div className={styles.label}>
                                    <Truck size={18} />
                                    <span>Доставка:</span>
                                  </div>
                                  <div className={styles.value}>
                                    {deliveryFee === 0 ? 'Безплатна' : `${deliveryFee.toFixed(2)} лв.`}
                                  </div>
                                </div>
                                <div className={`${styles.summaryRow} ${styles.total}`}>
                                  <div className={styles.label}>Общо:</div>
                                  <div className={styles.value}>{total.toFixed(2)} лв.</div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className={styles.cartActions}>
                                <Link href="/menu" className={styles.continueButton}>
                                  <ArrowLeft size={20} />
                                  <span>Продължи пазаруването</span>
                                </Link>
                                <Link href="/checkout" className={styles.checkoutButton}>
                                  <span>Поръчай</span>
                                  <ArrowRight size={20} />
                                </Link>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </section>
                      {/* cart end */}

                  </div>
              </div>
          </div>
      </div>
    </>
  );
};
export default Cart;
