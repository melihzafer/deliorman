"use client";

import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MenuItem = ({ item }) => {
  const pathname = usePathname();
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  // Only show Add to Cart button on /shop page (Order Now page)
  const showAddToCart = pathname === '/shop';

  const handleAddToCart = (e) => {
    e.preventDefault();

    // Generate a simple ID if not present
    const itemId = item.id || item.title.toLowerCase().replace(/\s+/g, '-');

    addItem({
      id: itemId,
      name: item.title,
      price: item.price,
      description: item.text,
      image: item.image || null
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="tst-menu-book-item tst-mbi-3" data-swiper-parallax-y="60" data-swiper-parallax-opacity="0" data-swiper-parallax-duration="1000">
      <div className="tst-menu-book-descr">
        <div className="tst-menu-book-name" style={{maxWidth: showAddToCart ? '85%' : '100%'}}>
          <h5 className="tst-mb-15">{item.title}</h5>
          {item.text && (
            <div className="tst-text mb-10" dangerouslySetInnerHTML={{__html : item.text}} />
          )}
          <div className="text-xs opacity-50 mb-10">{item.amount}</div>
        </div>

        <div className="tst-menu-book-bottom flex items-center justify-between gap-10 mt-10">
          <div className="tst-menu-book-price font-bold text-lg">
            {(item.price || 0).toFixed(2)} <span className="text-xs uppercase opacity-70">лв.</span>
          </div>

          {showAddToCart && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className={`tst-btn flex items-center gap-8 ${isAdded ? 'tst-btn-secondary' : 'tst-btn-main'}`}
              style={{
                height: '38px',
                lineHeight: '38px',
                padding: '0 15px',
                backgroundColor: isAdded ? '#2ecc71' : undefined // Success green
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
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
