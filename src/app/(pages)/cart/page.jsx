"use client";

import React from "react";

import PageBanner from "@components/PageBanner";
import CartItem from "@components/products/CartItem"
import ScrollHint from "@layouts/scroll-hint/Index";

import Link from "next/link";
import { useCartStore } from "@/store/cart-store";

const Cart = () => {
  const items = useCartStore(state => state.items);
  const getSubtotal = useCartStore(state => state.getSubtotal);

  const subtotal = getSubtotal();
  const deliveryFee = 0; // Can be configured later
  const total = subtotal + deliveryFee;

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
                            <div className="text-center" style={{ padding: '60px 0' }}>
                              <h4>Количката е празна</h4>
                              <p className="tst-text" style={{ marginTop: '20px' }}>Добавете продукти, за да продължите с поръчката.</p>
                              <Link href="/menu" className="tst-btn tst-btn-with-icon" style={{ marginTop: '30px' }}>
                                <span className="tst-icon">
                                  <img src="/img/ui/icons/arrow-2.svg" alt="icon" />
                                </span>
                                <span>Разгледайте менюто</span>
                              </Link>
                            </div>
                          ) : (
                            <div className="tst-cart-table">
                              <div className="tst-cart-table-header">
                                <div className="row">
                                  <div className="col-lg-6">Продукт</div>
                                  <div className="col-lg-3">Количество</div>
                                  <div className="col-lg-1">Цена</div>
                                  <div className="col-lg-1">Общо</div>
                                  <div className="col-lg-1"></div>
                                </div>
                              </div>

                              {items.map((item) => (
                                <CartItem item={item} key={item.id} />
                              ))}

                              <div className="row justify-content-end">
                                <div className="col-lg-6">
                                  <div className="tst-cart-total">
                                    <div className="tst-sum">
                                      <div className="row">
                                        <div className="col-8">
                                          <div className="tst-total-title">Междинна сума:</div>
                                        </div>
                                        <div className="col-4">
                                          <div className="tst-price-1 text-right">{subtotal.toFixed(2)} лв.</div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="tst-sum">
                                      <div className="row">
                                        <div className="col-8">
                                          <div className="tst-total-title">Доставка:</div>
                                        </div>
                                        <div className="col-4">
                                          <div className="tst-price-1 text-right">{deliveryFee.toFixed(2)} лв.</div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="tst-realy-sum">
                                      <div className="row">
                                        <div className="col-8">
                                          <div className="tst-total-title">Общо:</div>
                                        </div>
                                        <div className="col-4">
                                          <div className="tst-price-2 text-right">{total.toFixed(2)} лв.</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="tst-cart-btns-frame text-right">
                                    {/* button */}
                                    <Link href="/menu" className="tst-btn tst-btn-with-icon tst-btn-2 tst-btn-gray">
                                      <span className="tst-icon">
                                        <img src="/img/ui/icons/arrow-2.svg" alt="icon" />
                                      </span>
                                      <span>Продължи пазаруването</span>
                                    </Link>
                                    {/* button end */}
                                    {/* button */}
                                    <Link href="/checkout" className="tst-btn tst-btn-with-icon tst-m-0">
                                      <span className="tst-icon">
                                        <img src="/img/ui/icons/arrow.svg" alt="icon" />
                                      </span>
                                      <span>Поръчай</span>
                                    </Link>
                                    {/* button end */}
                                  </div>
                                </div>
                              </div>
                            </div>
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
