"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart-store";

const ProductButtons = ({ item }) => {
  const addItem = useCartStore(state => state.addItem);
  const getItemCount = useCartStore(state => state.getItemCount);

  const [quantity, setQuantity] = useState(1);
  const minQuantity = 1;
  const maxQuantity = 10;

  const cartTotal = getItemCount();

  useEffect(() => {
    const cartNumberEl = document.querySelector('.tst-cart-number');
    if (cartNumberEl) {
      cartNumberEl.innerHTML = cartTotal.toString();
    }
  }, [cartTotal]);

  const addToCart = (e) => {
    e.preventDefault();

    // Add item to cart with selected quantity
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: item?.id || `item-${Date.now()}`,
        name: item?.name || 'Product',
        price: item?.price || 0,
        image: item?.image,
        description: item?.description,
      });
    }

    const cartNumberEl = document.querySelector('.tst-cart-number');
    if (cartNumberEl) {
      cartNumberEl.classList.add('tst-added');
    }

    e.currentTarget.classList.add('tst-added');

    setTimeout(() => {
      if (cartNumberEl) {
        cartNumberEl.classList.remove('tst-added');
      }
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