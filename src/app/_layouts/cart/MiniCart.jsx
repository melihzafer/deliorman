"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Trash2, ArrowRight, UtensilsCrossed } from "lucide-react";
import styles from "@/app/_styles/scss/MiniCart.module.scss";

const MiniCart = ({ onClose }) => {
    const items = useCartStore(state => state.items);
    const removeItem = useCartStore(state => state.removeItem);
    const getItemCount = useCartStore(state => state.getItemCount);
    const getSubtotal = useCartStore(state => state.getSubtotal);

    const cartTotal = getItemCount();
    const subtotal = getSubtotal();

    useEffect(() => {
        const cartNumberEl = document.querySelector('.tst-cart-number');
        if (cartNumberEl) {
            cartNumberEl.innerHTML = cartTotal.toString();
        }
    }, [cartTotal]);

    const removeFromCart = (e, id) => {
        e.preventDefault();
        const cartNumberEl = document.querySelector('.tst-cart-number');

        if (cartNumberEl) {
            cartNumberEl.classList.add('tst-added');
            setTimeout(() => {
                cartNumberEl.classList.remove('tst-added');
            }, 600);
        }

        removeItem(id);
    };

    return (
        <div className={styles.miniCart}>
            {/* Close Button */}
            <button
                onClick={onClose}
                className={styles.closeButton}
                aria-label="Close cart"
            >
                <X size={20} />
            </button>

            {/* Header */}
            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <ShoppingBag size={20} />
                    <h5>Вашата поръчка</h5>
                </div>
                {items.length > 0 && (
                    <p className={styles.itemCount}>
                        {items.length} {items.length === 1 ? 'продукт' : 'продукта'}
                    </p>
                )}
            </div>

            {/* Content */}
            <div className={styles.content}>
                <AnimatePresence mode="wait">
                    {items.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={styles.emptyState}
                        >
                            <div className={styles.emptyIcon}>
                                <ShoppingBag size={40} />
                            </div>
                            <p>Количката е празна</p>
                            <Link href="/shop" className="tst-btn">
                                Поръчай сега
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.ul
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={styles.cartList}
                        >
                            <AnimatePresence>
                                {items.map((item) => (
                                    <motion.li
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={styles.cartItem}
                                    >
                                        <div className={styles.itemIcon}>
                                            <UtensilsCrossed size={24} />
                                        </div>

                                        <div className={styles.itemDetails}>
                                            <h6 className={styles.itemName}>{item.name}</h6>
                                            <div className={styles.itemMeta}>
                                                <span className={styles.quantity}>{item.quantity}</span>
                                                {' × '}
                                                <span className={styles.price}>{item.price.toFixed(2)} лв.</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => removeFromCart(e, item.id)}
                                            className={styles.removeButton}
                                            title="Премахни"
                                        >
                                            <X size={16} />
                                        </button>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </motion.ul>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.footer}
                >
                    <div className={styles.subtotal}>
                        <span className={styles.label}>Междинна сума</span>
                        <span className={styles.amount}>{subtotal.toFixed(2)} лв.</span>
                    </div>

                    <div className={styles.actions}>
                        <Link href="/cart" className={styles.cartButton}>
                            Количка
                        </Link>
                        <Link href="/checkout" className={styles.checkoutButton}>
                            <span>Поръчай</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default MiniCart;
