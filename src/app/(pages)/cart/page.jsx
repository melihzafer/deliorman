import React from "react";

import AppData from "@data/app.json";
import CartData from "@data/cart.json";

import PageBanner from "@components/PageBanner";
import CartItem from "@components/products/CartItem"
import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import Link from "next/link";

export const metadata = {
  title: {
		default: "Shopping Cart",
	},
  description: AppData.settings.siteDescription,
}

const Cart = () => {
  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
          <PageBanner pageTitle={"Your order"} description={"Quaerat debitis, vel, sapiente dicta sequi <br>labore porro pariatur harum expedita."} breadTitle={"Cart"} />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
          <div className="tst-content-frame">
              <div className="tst-content-box">
                  <div className="container tst-p-60-60">
                      <ScrollHint />

                      {/* cart */}
                      <section className="tst-p-90-90">
                        <div className="container">
                          <div className="tst-cart-table">
                            <div className="tst-cart-table-header">
                              <div className="row">
                                <div className="col-lg-6">Product</div>
                                <div className="col-lg-3">Quantity</div>
                                <div className="col-lg-1">Price</div>
                                <div className="col-lg-1">Total</div>
                                <div className="col-lg-1"></div>
                              </div>
                            </div>

                            {CartData.items.map((item, key) => (
                            <CartItem item={item} key={key} />
                            ))}

                            <div className="row justify-content-end">
                              <div className="col-lg-6">
                                <div className="tst-cart-total">
                                  <div className="tst-sum">
                                    <div className="row">
                                      <div className="col-8">
                                        <div className="tst-total-title">Subtotal:</div>
                                      </div>
                                      <div className="col-4">
                                        <div className="tst-price-1 text-right">$32.99</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="tst-sum">
                                    <div className="row">
                                      <div className="col-8">
                                        <div className="tst-total-title">Estimated shipping:</div>
                                      </div>
                                      <div className="col-4">
                                        <div className="tst-price-1 text-right">$5</div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="tst-realy-sum">
                                    <div className="row">
                                      <div className="col-8">
                                        <div className="tst-total-title">Total:</div>
                                      </div>
                                      <div className="col-4">
                                        <div className="tst-price-2 text-right">$37.99</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="tst-cart-btns-frame text-right">
                                  {/* button */}
                                  <Link href="/shop" className="tst-btn tst-btn-with-icon tst-btn-2 tst-btn-gray">
                                    <span className="tst-icon">
                                      <img src="/img/ui/icons/arrow-2.svg" alt="icon" />
                                    </span>
                                    <span>Continue shopping</span>
                                  </Link>
                                  {/* button end */}
                                  {/* button */}
                                  <Link href="/checkout" className="tst-btn tst-btn-with-icon tst-m-0">
                                    <span className="tst-icon">
                                      <img src="/img/ui/icons/arrow.svg" alt="icon" />
                                    </span>
                                    <span>Checkout</span>
                                  </Link>
                                  {/* button end */}
                                </div>
                              </div>
                            </div>
                          </div>
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