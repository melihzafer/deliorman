"use client";

import React from "react";

import AppData from "@data/app.json";
import ScrollHint from "@layouts/scroll-hint/Index";

import PageBanner from "@components/PageBanner";
import CheckoutForm from "@components/forms/CheckoutForm";

import Link from "next/link";
import { useCartStore } from "@/store/cart-store";

const Checkout = () => {
  const items = useCartStore(state => state.items);
  const getSubtotal = useCartStore(state => state.getSubtotal);

  const subtotal = getSubtotal();

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
          <PageBanner pageTitle={"Поръчка"} description={"Завършете вашата поръчка."} breadTitle={"Поръчка"} />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
          <div className="tst-content-frame">
              <div className="tst-content-box">
                  <div className="container tst-p-60-60">
                      <ScrollHint />

                      {/* checkout */}
                      <section className="tst-p-90-90">
                        <div className="container" data-sticky-container>
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
                            <div className="row">
                              <div className="col-lg-8">
                                <CheckoutForm />
                              </div>
                              <div className="col-lg-4">

                                <div className="tst-pad-type-2 tst-sticky" data-margin-top="120">
                                  <div className="tst-co-cart-frame">
                                    <div className="tst-cart-table">
                                      <div className="tst-cart-table-header">
                                        <div className="row">
                                          <div className="col-lg-9">Продукт</div>
                                          <div className="col-lg-3 text-right">Общо</div>
                                        </div>
                                      </div>

                                      {items.map((item) => (
                                      <div className="tst-cart-item" key={item.id}>
                                        <div className="row align-items-center">
                                          <div className="col-lg-9">
                                            <Link className="tst-product" href="/product">
                                              <div className="tst-cover-frame">
                                                <img src={item.image || '/img/menu/1.webp'} alt={item.name} />
                                              </div>
                                              <div className="tst-prod-description">
                                                <h6 className="tst-mb-15">{item.name}</h6>
                                                <p className="tst-text tst-text-sm">x{item.quantity}</p>
                                              </div>
                                            </Link>
                                          </div>
                                          <div className="col-lg-3 text-md-right">
                                            <div className="tst-price-2"><span>Общо: </span>лв.{(item.price * item.quantity).toFixed(2)}</div>
                                          </div>
                                        </div>
                                      </div>
                                      ))}

                                      <div className="tst-cart-total tst-cart-total-2">
                                        <div className="tst-sum">
                                          <div className="row">
                                            <div className="col-6">
                                              <div className="tst-total-title">Междинна сума:</div>
                                            </div>
                                            <div className="col-6">
                                              <div className="tst-price-1 text-right">{subtotal.toFixed(2)} лв.</div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="tst-realy-sum">
                                          <div className="row">
                                            <div className="col-6">
                                              <div className="tst-total-title">Общо:</div>
                                            </div>
                                            <div className="col-6">
                                              <div className="tst-price-2 text-right">{subtotal.toFixed(2)} лв.</div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                              </div>
                            </div>
                          )}
                        </div>
                      </section>
                      {/* checkout end */}

                  </div>
              </div>
          </div>
      </div>
    </>
  );
};
export default Checkout;
