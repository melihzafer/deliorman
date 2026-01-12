"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const ProductItem = ({ item }) => {
  const addItem = useCartStore(state => state.addItem);
  const [isAdded, setIsAdded] = useState(false);
  const [img, setImg] = useState(false);
  const [imgValue, setImgValue] = useState([]);

  const handleAddToCart = (e) => {
    e.preventDefault();

    addItem({
      id: item.id || item.title.toLowerCase().replace(/\s+/g, '-'),
      name: item.title,
      price: parseFloat(item.price) || 0,
      image: item.image,
      description: item.short,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  }

  return (
    <>
      <div className="tst-menu-book-item">
        <a href={item.image} className="tst-item-cover-frame tst-cursor-zoom" onClick={ (e) => { e.preventDefault(); setImg(true); setImgValue( [{ "src": item.image, "alt": item.title }] ); }}>
          <img src={item.image} alt={item.title} />
          <span className="tst-overlay"></span>
        </a>
        <div className="tst-menu-book-descr">
          <div className="tst-menu-book-name">
            <h6 className="tst-mb-15">{item.title}</h6>
            <div className="tst-text">{item.short}</div>
            <div className="tst-spacer-sm"></div>
          </div>
          <div className="tst-menu-book-bottom flex items-center justify-between">
            <div className="tst-menu-book-price">
              {item.old_price && (
                <del><span className="tst-price tst-old-price"><bdi><span className="tst-symbol">{item.currency}</span>{item.old_price}</bdi></span></del>
              )}
              <div className="tst-price">{item.price} <span className="text-xs uppercase opacity-70">{item.currency}</span></div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className={`tst-btn flex items-center gap-8 ${isAdded ? 'tst-btn-secondary' : 'tst-btn-main'}`}
              style={{ 
                height: '38px', 
                lineHeight: '38px', 
                padding: '0 15px',
                backgroundColor: isAdded ? '#2ecc71' : undefined
              }}
            >
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <motion.span 
                    key="added"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-5"
                  >
                    <Check size={14} />
                    <span style={{ fontSize: '10px' }}>Добавено</span>
                  </motion.span>
                ) : (
                  <motion.span 
                    key="add"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-5"
                  >
                    <Plus size={14} />
                    <span style={{ fontSize: '10px' }}>Добави</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
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
export default ProductItem;
