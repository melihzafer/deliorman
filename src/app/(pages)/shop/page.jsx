'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UtensilsCrossed,
  Coffee,
  Wine,
  Pizza,
  Soup,
  Flame,
  Search,
  ShoppingCart,
  Sparkles,
  CheckCircle
} from 'lucide-react';

import { useCartStore } from '@store/cart-store';
import styles from '@styles/scss/Shop.module.scss';

// Icon mapping for categories
const categoryIcons = {
  'soft-drinks-beverages': Coffee,
  'salads': UtensilsCrossed,
  'hot-appetizers': Flame,
  'soups-fish-sandwiches': Soup,
  'pizzas': Pizza,
  'grill-and-specialties': Flame,
  'sach-cold-appetizers-sides': UtensilsCrossed,
  'new-specialties': Sparkles,
  'desserts': UtensilsCrossed,
  'beer': Wine,
  'rakia': Wine,
  'wines': Wine,
  'vodka-other-spirits': Wine,
  'whiskey-and-nuts': Wine
};

const Shop = () => {
  const [menuData, setMenuData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetch('/menu.json')
      .then(res => res.json())
      .then(data => {
        setMenuData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load menu:', err);
        setLoading(false);
      });
  }, []);

  const showToast = (message, itemName) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, itemName }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const handleAddToCart = (item, category) => {
    addItem({
      id: `${category.slug}-${item.title}`,
      name: item.title,
      price: item.price || 0,
      description: item.text || item.amount || '',
      image: null,
      quantity: 1
    });
    showToast('Добавено в количката', item.title);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div
          className={styles.loadingSpinner}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <UtensilsCrossed size={48} />
        </motion.div>
      </div>
    );
  }

  if (!menuData) {
    return (
      <div className={styles.errorContainer}>
        <UtensilsCrossed size={48} />
        <p>Failed to load menu. Please try again later.</p>
      </div>
    );
  }

  const filteredCategories = menuData.categories.filter(category => {
    if (selectedCategory !== 'all' && category.slug !== selectedCategory) {
      return false;
    }
    return true;
  });

  const filteredItems = filteredCategories.flatMap(category =>
    category.items
      .filter(item => {
        if (!searchQuery) return true;
        const search = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(search) ||
          (item.text && item.text.toLowerCase().includes(search))
        );
      })
      .map(item => ({ ...item, categorySlug: category.slug, categoryName: category.name }))
  );

  return (
    <div className={styles.shopContainer}>
      {/* Toast Notifications */}
      <div className={styles.toastContainer}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className={styles.toast}
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <div className={styles.toastIcon}>
                <CheckCircle size={20} />
              </div>
              <div className={styles.toastContent}>
                <p className={styles.toastMessage}>{toast.message}</p>
                <p className={styles.toastItem}>{toast.itemName}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Hero Section */}
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.heroContent}>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Order Online
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Explore our full menu and order for delivery or pickup
          </motion.p>
        </div>
      </motion.div>

      {/* Search Bar */}
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={20} />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className={styles.categoryFilter}>
        <motion.button
          className={`${styles.categoryBtn} ${selectedCategory === 'all' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('all')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <UtensilsCrossed size={20} />
          <span>All Items</span>
        </motion.button>
        {menuData.categories.map((category) => {
          const IconComponent = categoryIcons[category.slug] || UtensilsCrossed;
          return (
            <motion.button
              key={category.slug}
              className={`${styles.categoryBtn} ${selectedCategory === category.slug ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category.slug)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconComponent size={20} />
              <span>{category.name}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Menu Items Grid */}
      <div className={styles.menuGrid}>
        <AnimatePresence mode="popLayout">
          {filteredItems.length === 0 ? (
            <motion.div
              key="no-results"
              className={styles.noResults}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Search size={48} />
              <p>No items found matching your search</p>
            </motion.div>
          ) : (
            filteredItems.map((item, index) => {
              const category = menuData.categories.find(c => c.slug === item.categorySlug);
              const IconComponent = categoryIcons[item.categorySlug] || UtensilsCrossed;

              return (
                <motion.div
                  key={`${item.categorySlug}-${item.title}-${index}`}
                  className={styles.menuCard}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.3) }}
                  whileHover={{ y: -5 }}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.iconContainer}>
                      <IconComponent size={32} />
                    </div>
                    <span className={styles.categoryBadge}>{category.name}</span>
                  </div>

                  <div className={styles.cardBody}>
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    {item.amount && (
                      <p className={styles.itemAmount}>{item.amount}</p>
                    )}
                    {item.text && (
                      <p className={styles.itemDescription}>{item.text}</p>
                    )}
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.priceContainer}>
                      {item.price !== null ? (
                        <>
                          <span className={styles.price}>{item.price.toFixed(2)}</span>
                          <span className={styles.currency}>лв.</span>
                        </>
                      ) : (
                        <span className={styles.priceUnavailable}>Price on request</span>
                      )}
                    </div>
                    {item.price !== null && (
                      <motion.button
                        className={styles.addToCartBtn}
                        onClick={() => handleAddToCart(item, category)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ShoppingCart size={18} />
                        <span>Add</span>
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Results Count */}
      {filteredItems.length > 0 && (
        <motion.div
          className={styles.resultsCount}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Showing {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
        </motion.div>
      )}
    </div>
  );
};

export default Shop;
