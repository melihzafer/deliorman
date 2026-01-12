"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";

const CartItem = ({ item }) => {
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);
  const getItemCount = useCartStore(state => state.getItemCount);

  const minQuantity = 1;
  const maxQuantity = 10;

  const total = (item.price * item.quantity).toFixed(2);
  const cartTotal = getItemCount();

  useEffect(() => {
    const cartNumberEl = document.querySelector('.tst-cart-number');
    if (cartNumberEl) {
      cartNumberEl.innerHTML = cartTotal.toString();
    }
  }, [cartTotal]);

  const handleRemove = (e) => {
    e.preventDefault();
    const cartNumberEl = document.querySelector('.tst-cart-number');

    if (cartNumberEl) {
      cartNumberEl.classList.add('tst-added');
      setTimeout(() => {
        cartNumberEl.classList.remove('tst-added');
      }, 600);
    }

    removeItem(item.id);
  };
  
  return (
    <>   
      <div className={`tst-cart-item tst-cart-item-${item.id}`}>
        <div className="row align-items-center">
            <div className="col-lg-6">
                <Link className="tst-product" href={`/product`}>
                    <div className="tst-cover-frame">
                        <img src={item.image || '/img/menu/1.webp'} alt={item.name} />
                    </div>
                    <div className="tst-prod-description">
                        <h6 className="media-heading tst-mb-15">{item.name}</h6>
                        <p className="tst-text tst-text-sm">{item.description}</p>
                    </div>
                </Link>
            </div>
            <div className="col-6 col-lg-3">
                <div className="tst-input-number-frame">
                    <div className="tst-input-number-btn tst-sub" onClick={() => updateQuantity(item.id, item.quantity > minQuantity ? item.quantity - 1 : item.quantity)}>-</div>
                    <input type="number" value={item.quantity} readOnly />
                    <div className="tst-input-number-btn tst-add" onClick={() => updateQuantity(item.id, item.quantity < maxQuantity ? item.quantity + 1 : item.quantity)}>+</div>
                </div>
            </div>
            <div className="col-3 col-lg-1">
                <div className="tst-price-1"><span>Price: </span>лв.{item.price.toFixed(2)}</div>
            </div>
            <div className="col-3 col-lg-1">
                <div className="tst-price-2"><span>Total: </span>лв.{total}</div>
            </div>
            <div className="col-1">
                <a href="#." className="tst-remove" onClick={handleRemove}>+</a>
            </div>
        </div>
      </div>
    </>
  );
};
export default CartItem;