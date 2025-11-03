import React from "react";
import dynamic from "next/dynamic";

import AppData from "@data/app.json";
import ProductsData from "@data/products.json";
import ScrollHint from "@layouts/scroll-hint/Index";
import Divider from "@layouts/divider/Index";

import PageBanner from "@components/PageBanner";
import ReviewItem from "@components/reviews/ReviewItem";
import ProductImage from "@components/products/ProductImage";
import ProductButtons from "@components/products/ProductButtons";
import SubscribeSection from "@components/sections/Subscribe";

const ProductsSlider = dynamic( () => import("@components/sliders/Products") );
const ProductTabs = dynamic( () => import("@components/products/ProductTabs") );

export const metadata = {
  title: {
		default: "Product page",
	},
  description: AppData.settings.siteDescription,
}

const Products = () => {
  async function ProductAtts() {
    const AttsData = [
      {
        "label": "Numquam",
        "value": "1 pack"
      },
      {
        "label": "Cupiditate",
        "value": "150g"
      },
      {
        "label": "Adipisicing",
        "value": "500g"
      },
      {
        "label": "Dolorem obcaecati",
        "value": "3 Teaspoon"
      },
      {
        "label": "Porro",
        "value": "2 pack"
      },
      {
        "label": "Facilis",
        "value": "1kg"
      },
      {
        "label": "Goluptatem",
        "value": "1 Teaspoon"
      },
      {
        "label": "Vel fuga",
        "value": "300g"
      }
    ];

    return (
      <>
        <ul className="tst-list">
          {AttsData.map((item, key) => (
          <li key={`product-reviews-item-${key}`}><b>{item.label}</b><span>{item.value}</span></li>
          ))}
        </ul>
      </>
    );
  };

  async function ProductDescription() {
    return (
      <>
        <div className="tst-text">
          <p>Facilis ratione veritatis asperiores doloremque molestiae delectus iure officia earum dolores sit fugiat, repellendus, neque laboriosam optio culpa quibusdam, magnam totam quos. Mollitia dolorem, culpa, dignissimos quas et voluptates architecto in sit totam, quae animi ratione adipisci nulla ab quasi perferendis quo pariatur dolor magnam inventore. Sequi nisi ex excepturi non harum, asperiores laboriosam ipsum voluptate doloribus incidunt nam eveniet similique unde esse voluptatem minus necessitatibus eaque temporibus quaerat accusantium amet deserunt. Iste, facilis? Illo tenetur, libero, non dicta asperiores quisquam voluptas natus aperiam, at perspiciatis repellat voluptate. Autem non reprehenderit, perferendis.</p>
          <p>Consectetur adipisicing elit. Delectus quibusdam repellendus nesciunt cumque fugit numquam adipisci voluptatum quam, sapiente doloribus ut eaque natus laudantium alias illum quos maiores, quia perferendis.</p>
        </div>
      </>
    );
  };

  async function ProductReviews() {
    const ReviewsData = [
      {
        "title": "Very tasty",
        "name": "Emma Newman",
        "rating": 5,
        "image": "/img/faces/1.jpg",
        "date": "04.03.2024",
        "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis fugiat totam nobis quas unde excepturi inventore possimus laudantium provident, rem eligendi velit. Aut molestias, ipsa itaque laborum, natus tempora, ut soluta animi ducimus dignissimos deserunt doloribus in reprehenderit rem accusamus! Quibusdam labore, aliquam dolor harum!"
      },
      {
        "title": "I have lunch here every day",
        "name": "Paul Trueman",
        "rating": 5,
        "image": "/img/faces/2.jpg",
        "date": "02.03.2024",
        "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis fugiat totam nobis quas unde excepturi inventore possimus laudantium provident, rem eligendi velit. Aut molestias, ipsa itaque laborum, natus tempora, ut soluta animi ducimus dignissimos deserunt doloribus in reprehenderit rem accusamus! Quibusdam labore, aliquam dolor harum!"
      }
    ];
    
    return (
        <div className="row">
          {ReviewsData.map((item, key) => (
          <div className="col-lg-6" key={`product-reviews-item-${key}`}>
            <ReviewItem item={item} key={key} marginBottom={60} />
          </div>
          ))}
        </div>
    );
  };

  const tabs = [
    {
      "slug": "ingredients",
      "name": "Ingredients"
    },
    {
      "slug": "details",
      "name": "Product details"
    },
    {
      "slug": "reviews",
      "name": "Reviews"
    }
  ];

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
          <PageBanner pageTitle={"Product Detail"} description={"Quaerat debitis, vel, sapiente dicta sequi <br>labore porro pariatur harum expedita."} breadTitle={"Product"} />
      </div>
      <div id="tst-dynamic-content" className="tst-dynamic-content">
          <div className="tst-content-frame">
              <div className="tst-content-box">
                  <div className="container tst-p-60-60">
                      <ScrollHint />

                      {/* product */}
                      <section className="tst-p-90-0">
                        <div className="container">
                          <div className="row align-items-center">
                            <div className="col-lg-6">
                              <ProductImage src={"/img/menu/4.jpg"} alt={"Saumon Gravlax"} badge={"<div className='tst-badge tst-vegan'><i className='fas fa-leaf'></i> Vegan</div>"} />
                            </div>
                            <div className="col-lg-6">
                              <div className="tst-product-description tst-mb-90">
                                <div className="tst-price-frame tst-mb-30">
                                  <h4>Saumon Gravlax</h4>
                                  <div className="tst-price"><sub>$</sub> 19</div>
                                </div>
                                <ul className="tst-stars tst-mb-25">
                                  <li><i className="fas fa-star"></i></li>
                                  <li><i className="fas fa-star"></i></li>
                                  <li><i className="fas fa-star"></i></li>
                                  <li><i className="fas fa-star"></i></li>
                                  <li><i className="fas fa-star"></i></li>
                                  <li><span>(4 ratings)</span></li>
                                </ul>
                                <p className="tst-text tst-mb-30"><span>tomatoes</span>, <span>nori</span>, <span>feta cheese</span>, <span>mushrooms</span>, <span>rice noodles</span>, <span>corn</span>, <span>shrimp</span>.</p>
                                <div className="row">
                                  <div className="col-lg-4">
                                    <div className="tst-features-item tst-features-item-sm tst-mb-30">
                                      <div className="tst-number">01</div>
                                      <div className="tst-feature-text">
                                        <h6 className="tst-mb-15">Add to the cart and place an order</h6>
                                        <p className="tst-text tst-text-sm">Porro comirton pera nemo veniam</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-4">
                                    <div className="tst-features-item tst-features-item-sm tst-mb-30">
                                      <div className="tst-number">02</div>
                                      <div className="tst-feature-text">
                                        <h6 className="tst-mb-15">Enter your phone and address</h6>
                                        <p className="tst-text tst-text-sm">Eligendi adipisci numquam.</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-4">
                                    <div className="tst-features-item tst-features-item-sm tst-mb-30">
                                      <div className="tst-number">03</div>
                                      <div className="tst-feature-text">
                                        <h6 className="tst-mb-15">Enjoy your favorite food at home!</h6>
                                        <p className="tst-text tst-text-sm">Nnecessitatibus praesentium</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <ProductButtons />
                              </div>
                            </div>
                          </div>

                          <ProductTabs 
                            items={tabs}
                            active={"ingredients"}
                          />

                          <div className="tst-masonry-grid tst-tabs">
                            <div className="tst-grid-sizer" />
                            
                            {tabs.map((tab, key) => (
                            <div className={`tst-grid-item tst-${tab.slug}-tab`} key={`product-tab-${key}`}>
                              <div className="tst-tab">
                                {tab.slug == 'ingredients' && <ProductAtts />}
                                {tab.slug == 'details' && <ProductDescription />}
                                {tab.slug == 'reviews' && <ProductReviews />}
                              </div>
                            </div>
                            ))}
                          </div>

                        </div>
                      </section>
                      {/* product end */}

                      <ProductsSlider 
                        items={ProductsData.items} 
                        heading={
                          { 
                            "subtitle": "Related", 
                            "title": "Similar Products", 
                            "description": "Porro eveniet, autem ipsam corrupti consectetur cum. <br>Repudiandae dignissimos fugiat sit nam." 
                          }
                        }
                        button={
                          {
                            "link": "/products",
                            "label": "View all"
                          }
                        }
                      />

                      <Divider onlyBottom={0} />
                      <SubscribeSection />
                      
                  </div>
              </div>
          </div>
      </div>
    </>
  );
};
export default Products;