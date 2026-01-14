'use client';

import { useEffect, useState } from 'react';
import { useOrderHistoryStore } from '@/store/order-history-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, CheckCircle, Truck, XCircle, ChevronDown, ChevronUp, ShoppingBag, MapPin, Phone, User, CreditCard, Banknote, FileText } from 'lucide-react';
import Link from 'next/link';
import styles from '@/app/_styles/scss/OrderHistory.module.scss';

export default function OrderHistoryPage() {
  const [mounted, setMounted] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const orders = useOrderHistoryStore((state) => state.getAllOrders());

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={18} />;
      case 'confirmed':
        return <CheckCircle size={18} />;
      case 'preparing':
        return <Package size={18} />;
      case 'on-the-way':
        return <Truck size={18} />;
      case 'delivered':
        return <CheckCircle size={18} />;
      case 'cancelled':
        return <XCircle size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Очаква потвърждение';
      case 'confirmed':
        return 'Потвърдена';
      case 'preparing':
        return 'Приготвя се';
      case 'on-the-way':
        return 'В доставка';
      case 'delivered':
        return 'Доставена';
      case 'cancelled':
        return 'Отказана';
      default:
        return 'Неизвестно';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    // If less than 24 hours ago, show relative time
    if (diffInHours < 1) {
      const mins = Math.floor(diffInMs / (1000 * 60));
      return `Преди ${mins} ${mins === 1 ? 'минута' : 'минути'}`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `Преди ${hours} ${hours === 1 ? 'час' : 'часа'}`;
    } else if (diffInDays < 7) {
      const days = Math.floor(diffInDays);
      return `Преди ${days} ${days === 1 ? 'ден' : 'дни'}`;
    }

    // Otherwise show full date
    return date.toLocaleString('bg-BG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!mounted) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Зареждане...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={styles.container}>
        <motion.div
          className={styles.empty}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.emptyIconWrapper}>
            <Package size={64} className={styles.emptyIcon} />
          </div>
          <h2>Все още нямате поръчки</h2>
          <p>Когато направите поръчка, тя ще се появи тук.</p>
          <Link href="/shop" className={styles.shopButton}>
            <ShoppingBag size={18} />
            <span>Разгледайте менюто</span>
          </Link>
        </motion.div>
      </div>
    );
  }


  // Render the order history
  return (
    <div className={styles.container}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <div>
              <h1>История на поръчките</h1>
              <div className={styles.statsRow}>
                <div className={styles.statsPill}>
                  <Package size={14} />
                  <span>{orders.length} {orders.length === 1 ? 'поръчка' : 'поръчки'}</span>
                </div>
                {/* Optional: Add more stats here if available, e.g. total spent */}
                <p>Вашият архив с поръчки</p>
              </div>
            </div>
          </div>
          <Link href="/shop" className={styles.newOrderButton}>
            <span>Нова поръчка</span>
            <ShoppingBag size={18} />
          </Link>
        </div>
      </motion.div>

      <div className={styles.ordersList}>
        <AnimatePresence>
          {orders.map((order, index) => {
            const isExpanded = expandedOrders.has(order.orderId);

            return (
              <motion.div
                key={order.orderId}
                className={`${styles.orderCard} ${styles[`status-${order.status}`]}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                layout
              >
                <div className={styles.orderHeader} onClick={() => toggleOrderExpand(order.orderId)}>
                  <div className={styles.orderHeaderLeft}>
                    <div className={styles.statusBadge}>
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </div>
                    <div className={styles.orderMeta}>
                      <span className={styles.orderId}>#{order.orderId}</span>
                      <span className={styles.orderDate}>{formatDate(order.date)}</span>
                    </div>
                  </div>
                  <div className={styles.orderHeaderRight}>
                    <div className={styles.priceWrapper}>
                      <span className={styles.orderTotal}>{order.total.toFixed(2)} лв.</span>
                      <span className={styles.itemCount}>{order.items.length} {order.items.length === 1 ? 'продукт' : 'продукта'}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={styles.expandIcon}
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      className={styles.orderDetails}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.detailsGrid}>
                        {/* Customer Info */}
                        <div className={styles.infoCard}>
                          <div className={styles.infoCardHeader}>
                            <User size={18} />
                            <h3>Информация за доставка</h3>
                          </div>
                          <div className={styles.infoCardContent}>
                            <div className={styles.infoRow}>
                              <User size={16} className={styles.infoIcon} />
                              <span>{order.customer.name}</span>
                            </div>
                            <div className={styles.infoRow}>
                              <Phone size={16} className={styles.infoIcon} />
                              <span>{order.customer.phone}</span>
                            </div>
                            <div className={styles.infoRow}>
                              <MapPin size={16} className={styles.infoIcon} />
                              <span>{order.customer.address}</span>
                            </div>
                            <div className={styles.infoRow}>
                              {order.paymentMethod === 'cash' ? (
                                <Banknote size={16} className={styles.infoIcon} />
                              ) : (
                                <CreditCard size={16} className={styles.infoIcon} />
                              )}
                              <span>{order.paymentMethod === 'cash' ? 'Плащане в брой' : 'Плащане с карта'}</span>
                            </div>
                            {order.notes && (
                              <div className={styles.infoRow}>
                                <FileText size={16} className={styles.infoIcon} />
                                <span className={styles.notes}>{order.notes}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Items List */}
                        <div className={styles.infoCard}>
                          <div className={styles.infoCardHeader}>
                            <ShoppingBag size={18} />
                            <h3>Поръчани продукти</h3>
                          </div>
                          <div className={styles.infoCardContent}>
                            {order.items.map((item, idx) => (
                              <div key={item.id} className={styles.orderItem}>
                                <div className={styles.itemInfo}>
                                  <span className={styles.itemName}>{item.name}</span>
                                  <span className={styles.itemQuantity}>x{item.quantity}</span>
                                </div>
                                <span className={styles.itemPrice}>{(item.price * item.quantity).toFixed(2)} лв.</span>
                              </div>
                            ))}
                          </div>
                          <div className={styles.orderSummary}>
                            <div className={styles.summaryRow}>
                              <span>Обща сума:</span>
                              <strong>{order.total.toFixed(2)} лв.</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
