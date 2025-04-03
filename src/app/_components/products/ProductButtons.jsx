"use client";

import { useState, useEffect } from "react";

import CartData from "@data/cart.json";

const ProductButtons = () => {
  const [cartTotal, setCartTotal] = useState(CartData.total);
  const [quantity, setQuantity] = useState(1);
  const minQuantity = 1;
  const maxQuantity = 10;

  useEffect(() => {
    const cartNumberEl = document.querySelector('.tst-cart-number');
    cartNumberEl.innerHTML = cartTotal;
  }, [cartTotal]);

  const addToCart = (e) => {
    e.preventDefault();
    const cartNumberEl = document.querySelector('.tst-cart-number');
    setCartTotal(cartTotal + quantity);

    cartNumberEl.classList.add('tst-added');
    e.currentTarget.classList.add('tst-added');
    
    setTimeout(() => {
        cartNumberEl.classList.remove('tst-added');
    }, 600);
  }

  return (
    <>
      <div className="tst-buttons-frame">
        <div className="tst-input-number-frame">
            <div className="tst-input-number-btn tst-sub" onClick={() => setQuantity(quantity>minQuantity ? quantity-1 : quantity)}>-</div>
            <input type="number" readOnly value={quantity} min={minQuantity} max={maxQuantity} />
            <div className="tst-input-number-btn tst-add" onClick={() => setQuantity(quantity<maxQuantity ? quantity+1 : quantity)}>+</div>
        </div>
        {/* button */}
        <a href="#." className="tst-btn tst-btn-with-icon tst-atc" onClick={(e) => addToCart(e) }>
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