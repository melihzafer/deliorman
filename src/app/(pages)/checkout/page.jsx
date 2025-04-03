import React from "react";

import AppData from "@data/app.json";
import CartData from "@data/cart.json";
import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import PageBanner from "@components/PageBanner";
import CheckoutForm from "@components/forms/CheckoutForm";

import Link from "next/link";

export const metadata = {
  title: {
		default: "Order checkout",
	},
  description: AppData.settings.siteDescription,
}

const Checkout = () => {
  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
          <PageBanner pageTitle={"Checkout"} description={"Quaerat debitis, vel, sapiente dicta sequi <br>labore porro pariatur harum expedita."} breadTitle={"Checkout"} />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
          <div className="tst-content-frame">
              <div className="tst-content-box">
                  <div className="container tst-p-60-60">
                      <ScrollHint />

                      {/* checkout */}
                      <section className="tst-p-90-90">
                        <div className="container" data-sticky-container>
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
                                        <div className="col-lg-9">Product</div>
                                        <div className="col-lg-3 text-right">Total</div>
                                      </div>
                                    </div>

                                    {CartData.items.map((item, key) => (
                                    <div className="tst-cart-item">
                                      <div className="row align-items-center">
                                        <div className="col-lg-9">
                                          <Link className="tst-product" href="/product">
                                            <div className="tst-cover-frame">
                                              <img src={item.image} alt={item.title} />
                                            </div>
                                            <div className="tst-prod-description">
                                              <h6 className="tst-mb-15">{item.title}</h6>
                                              <p className="tst-text tst-text-sm">x{item.quantity}</p>
                                            </div>
                                          </Link>
                                        </div>
                                        <div className="col-lg-3 text-md-right">
                                          <div className="tst-price-2"><span>Total: </span>{item.currency}{item.price}</div>
                                        </div>
                                      </div>
                                    </div>
                                    ))}

                                    <div className="tst-cart-total tst-cart-total-2">
                                      <div className="tst-sum">
                                        <div className="row">
                                          <div className="col-6">
                                            <div className="tst-total-title">Subtotal:</div>
                                          </div>
                                          <div className="col-6">
                                            <div className="tst-price-1 text-right">$32.99</div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="tst-realy-sum">
                                        <div className="row">
                                          <div className="col-6">
                                            <div className="tst-total-title">Total:</div>
                                          </div>
                                          <div className="col-6">
                                            <div className="tst-price-2 text-right">$37.99</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>
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