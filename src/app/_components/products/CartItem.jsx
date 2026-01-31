"use client";

import Link from "next/link";
import { useState, useCallback, useMemo } from "react";
import { useCart } from "@library/CartContext";

/**
 * CartItem - Uses CartContext for reactive cart updates
 * Eliminates DOM queries for cart number updates and item removal
 */
const CartItem = ({ item, index }) => {
  const { removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const minQuantity = 1;
  const maxQuantity = 10;

  // Memoize total calculation
  const total = useMemo(() => (quantity * item.price).toFixed(2), [quantity, item.price]);

  const handleRemoveFromCart = useCallback((e) => {
    e.preventDefault();
    removeFromCart(quantity);
    
    // Hide the item visually (parent should handle actual removal)
    const itemEl = e.currentTarget.closest('.tst-cart-item');
    if (itemEl) {
      itemEl.style.display = 'none';
    }
  }, [removeFromCart, quantity]);

  const decreaseQuantity = useCallback(() => {
    setQuantity(q => q > minQuantity ? q - 1 : q);
  }, []);

  const increaseQuantity = useCallback(() => {
    setQuantity(q => q < maxQuantity ? q + 1 : q);
  }, []);
  
  return (
    <>   
      <div className={`tst-cart-item tst-cart-item-${index}`}>
        <div className="row align-items-center">
            <div className="col-lg-6">
                <Link className="tst-product" href={`/product`}>
                    <div className="tst-cover-frame">
                        <img src={item.image} alt={item.title} />
                    </div>
                    <div className="tst-prod-description">
                        <h6 className="media-heading tst-mb-15">{item.title}</h6>
                        <p className="tst-text tst-text-sm">{item.description}</p>
                    </div>
                </Link>
            </div>
            <div className="col-6 col-lg-3">
                <div className="tst-input-number-frame">
                    <div className="tst-input-number-btn tst-sub" onClick={decreaseQuantity}>-</div>
                    <input type="number" value={quantity} readOnly />
                    <div className="tst-input-number-btn tst-add" onClick={increaseQuantity}>+</div>
                </div>
            </div>
            <div className="col-3 col-lg-1">
                <div className="tst-price-1"><span>Price: </span>{item.currency}{item.price}</div>
            </div>
            <div className="col-3 col-lg-1">
                <div className="tst-price-2"><span>Total: </span>{item.currency}{total}</div>
            </div>
            <div className="col-1">
                <a href="#." className="tst-remove" onClick={handleRemoveFromCart}>+</a>
            </div>
        </div>
      </div>
    </>
  );
};
export default CartItem;