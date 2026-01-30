"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { useCart } from "@library/CartContext";
import CartData from "@data/cart.json";

/**
 * MiniCart - Uses CartContext for reactive cart updates
 * Eliminates DOM queries for cart number updates
 */
const MiniCart = () => {
    const { removeFromCart } = useCart();
    const [items, setItems] = useState(CartData.items);

    const handleRemoveFromCart = useCallback((e, index) => {
        e.preventDefault();
        const item = items[index];
        if (item) {
            removeFromCart(item.quantity || 1);
            setItems(prev => prev.filter((_, i) => i !== index));
        }
    }, [items, removeFromCart]);

    return (
        <>
            <div className="tst-minicart-header">
                <div className="tst-suptitle tst-suptitle-center"></div>
                <h5>Вашата поръчка!</h5>
            </div>
            <ul className="woocommerce-mini-cart cart_list product_list_widget">
                {items.map((item, index) => (
                <li key={`mini-cart-item-${index}`} className={`woocommerce-mini-cart-item mini_cart_item mini-cart-item-${index}`}>
                    <a href="#." className="remove remove_from_cart_button" aria-label="Remove this item" onClick={(e) => handleRemoveFromCart(e, index)}>×</a>
                    <Link href="/product">
                        <img src={item.image} alt={item.title} className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail" />
                        {item.title}
                    </Link>
                    <span className="quantity">{item.quantity} × <span className="woocommerce-Price-amount amount"><bdi><span className="woocommerce-Price-currencySymbol">{item.currency}</span>{item.price}</bdi></span></span>
                </li>
                ))}
            </ul>
            <p className="woocommerce-mini-cart__total total">
                <strong>Междинна сума:</strong> <span className="woocommerce-Price-amount amount"><bdi><span className="woocommerce-Price-currencySymbol">лв.</span>52.00</bdi></span>
            </p>
            <p className="woocommerce-mini-cart__buttons buttons">
                <Link href="/cart" className="tst-btn tst-btn-2">Виж количката</Link>
                <Link href="/checkout" className="tst-btn">Поръчай</Link>
            </p>
        </>
    );
};
export default MiniCart;