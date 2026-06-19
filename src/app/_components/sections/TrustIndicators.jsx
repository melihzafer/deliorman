'use client';

import { useTranslations } from 'next-intl';
import AnimateOnScroll from "@components/common/AnimateOnScroll";
import styles from "./TrustIndicators.module.scss";

const TrustIndicators = () => {
  const t = useTranslations('components.trustIndicators');

  const indicators = [
    {
      icon: "fas fa-leaf",
      title: t('freshProducts'),
      subtitle: t('freshProductsDesc'),
    },
    {
      icon: "fas fa-home",
      title: t('homeRecipes'),
      subtitle: t('homeRecipesDesc'),
    },
    {
      icon: "fas fa-shipping-fast",
      title: t('fastDelivery'),
      subtitle: t('fastDeliveryDesc'),
    },
    {
      icon: "fas fa-heart",
      title: t('familyRestaurant'),
      subtitle: t('familyRestaurantDesc'),
    },
  ];

  return (
    <div className={styles.trustIndicators}>
      <div className="container">
        <div className={styles.grid}>
          {indicators.map((item, index) => (
            <AnimateOnScroll key={`trust-${index}`} delay={index * 0.1} initialVisible={true}>
              <div className={styles.item}>
                <div className={styles.icon}>
                  <i className={item.icon}></i>
                </div>
                <div className={styles.text}>
                  <span className={styles.title}>{item.title}</span>
                  <span className={styles.subtitle}>{item.subtitle}</span>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustIndicators;
