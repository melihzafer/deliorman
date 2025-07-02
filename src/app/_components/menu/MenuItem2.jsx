"use client";

import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import CartData from "@data/cart.json";

const MenuItem = ({ item }) => {  
  const [img, setImg] = useState(false);
  const [imgValue, setImgValue] = useState([]);

  const [cartTotal, setCartTotal] = useState(CartData.total);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const cartNumberEl = document.querySelector('.tst-cart-number');
    if (cartNumberEl) {
      cartNumberEl.innerHTML = cartTotal;
    }
  }, [cartTotal]);

  const addToCart = (e) => {
    e.preventDefault();
    const cartNumberEl = document.querySelector('.tst-cart-number');
    setCartTotal(cartTotal + quantity);
    console.log(cartTotal + quantity);

    if (cartNumberEl) {
      cartNumberEl.classList.add('tst-added');
      setTimeout(() => {
        cartNumberEl.classList.remove('tst-added');
      }, 600);
    }
    
    if (e.currentTarget) {
      e.currentTarget.classList.add('tst-added');
    }
  }

  return (
    <>
      <div className="tst-menu-book-item tst-mbi-3" data-swiper-parallax-y="60" data-swiper-parallax-opacity="0" data-swiper-parallax-duration="1000">
        {item.image && (
          <a href={item.image} data-fancybox="menu" className="tst-item-cover-frame tst-cursor-zoom" onClick={ (e) => { e.preventDefault(); setImg(true); setImgValue( [{ "src": item.image, "alt": item.title }] ); }}>
              <img 
                src={item.image} 
                alt={item.title}
                loading="lazy"
                onError={(e) => {
                  console.warn(`Failed to load image: ${item.image}`);
                  e.target.style.display = 'none';
                }}
              />
              <span className="tst-overlay"></span>
          </a>
        )}
        <div className="tst-menu-book-descr">
            <div className="tst-menu-book-name">
            <h5 className="tst-mb-15">{item.title}</h5>
            <div className="tst-text" dangerouslySetInnerHTML={{__html : item.text}} />
            <div className="tst-spacer-sm"></div>
            </div>
            <div className="tst-menu-book-bottom">
            <div className="tst-menu-book-price">
                
                <div className="tst-price"><span className="tst-symbol">{item.currency}</span>{item.price}</div>
                <div className="tst-weight">{item.weight}</div>
            </div>
            { /* We dont make reservation yet
             <a href="#." className="tst-btn tst-cart-btn" title="add to cart" onClick={(e) => addToCart(e) }> 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
                <path
                    d="M87.7,33.1l-0.8-10.8C86,10.4,76,1,64,1s-22.1,9.4-22.9,21.3l-0.8,10.8H28.8c-4.7,0-8.6,3.7-9,8.4l-5.4,75.9c0,0,0,0,0,0 c-0.2,2.5,0.7,5,2.4,6.8s4.1,2.9,6.6,2.9h81.3c2.5,0,4.9-1,6.6-2.9c1.7-1.8,2.6-4.3,2.4-6.8l-5.4-75.2c-0.4-5.1-4.6-9-9.7-9H87.7z M47.1,22.7C47.7,13.9,55.1,7,64,7s16.3,6.9,16.9,15.7l0.7,10.4H46.3L47.1,22.7z M102.3,42.6l5.4,75.2c0.1,0.8-0.2,1.6-0.8,2.3 c-0.6,0.6-1.4,1-2.2,1H23.4c-0.8,0-1.6-0.3-2.2-1s-0.9-1.4-0.8-2.3h0l5.4-75.9c0.1-1.6,1.4-2.8,3-2.8h11.1l-0.6,8 c-0.1,1.7,1.1,3.1,2.8,3.2c0.1,0,0.1,0,0.2,0c1.6,0,2.9-1.2,3-2.8l0.6-8.4h36.2l0.6,8.4c0.1,1.7,1.5,2.9,3.2,2.8 c1.7-0.1,2.9-1.5,2.8-3.2l-0.6-8h10.5C100.5,39.1,102.1,40.6,102.3,42.6z" />
                </svg>
            </a>*/}
            </div>
        </div>
      </div>
      
      <Lightbox
        open={img}
        close={() => setImg(false)}
        slides={imgValue}
        styles={{ container: { backgroundColor: "rgba(26, 47, 51, .85)" } }}
        render={{
          buttonPrev: imgValue.length <= 1 ? () => null : undefined,
          buttonNext: imgValue.length <= 1 ? () => null : undefined,
        }}
      />
    </>
  );
};
export default MenuItem;
