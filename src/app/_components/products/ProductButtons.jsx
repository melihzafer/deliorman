"use client";

import { useState, useCallback } from "react";
import { useCart } from "@library/CartContext";

/**
 * ProductButtons - Uses CartContext for reactive cart updates
 * Eliminates DOM queries for cart number updates
 */
const ProductButtons = () => {
  const { addToCart: addToCartContext } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [buttonAdded, setButtonAdded] = useState(false);
  const minQuantity = 1;
  const maxQuantity = 10;

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    addToCartContext(quantity);

    setButtonAdded(true);
    e.currentTarget.classList.add('tst-added');
    
    setTimeout(() => {
      setButtonAdded(false);
    }, 600);
  }, [addToCartContext, quantity]);

  const decreaseQuantity = useCallback(() => {
    setQuantity(q => q > minQuantity ? q - 1 : q);
  }, []);

  const increaseQuantity = useCallback(() => {
    setQuantity(q => q < maxQuantity ? q + 1 : q);
  }, []);

  return (
    <>
      <div className="tst-buttons-frame">
        <div className="tst-input-number-frame">
            <div className="tst-input-number-btn tst-sub" onClick={decreaseQuantity}>-</div>
            <input type="number" readOnly value={quantity} min={minQuantity} max={maxQuantity} />
            <div className="tst-input-number-btn tst-add" onClick={increaseQuantity}>+</div>
        </div>
        {/* button */}
        <a href="#." className="tst-btn tst-btn-with-icon tst-atc" onClick={handleAddToCart}>
            <span className="tst-icon">
                <img src="/img/ui/icons/cart.svg" alt="icon" />
            </span>
            <span className="tst-add-to-cart-text">Add to cart</span>
            <span className="tst-added-text">Added</span>
        </a>
        {/* button end */}
      </div>
    </>
  );
};
export default ProductButtons;