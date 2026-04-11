"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import SpecialtiesData from "@data/specialties.json";
import styles from "./SpecialtiesShowcase.module.scss";

const SpecialtiesShowcase = () => {
  const t = useTranslations("components.specialtiesShowcase");
  const tSpec = useTranslations("specialties");
  const specialties = tSpec.raw("items") || [];
  const [failedImages, setFailedImages] = useState(new Set());

  const getImageSrc = (index) => {
    const item = specialties[index];
    if (item?.image) return item.image;
    const fallback = SpecialtiesData?.categories?.[0]?.items?.[index];
    if (fallback?.image) return fallback.image;
    return `/img/menu/menu${index + 1}.webp`;
  };

  return (
    <>
      <div className="tst-content-frame">
        <div className="tst-content-box">
          <div className="container tst-p-60-60">
            <div className="row justify-content-center tst-mb-60">
              <div className="col-lg-8">
                <div className="text-center">
                  <div className="tst-suptitle tst-suptitle-center tst-mb-15" style={{color: '#f39c12'}}>
                    <i className="fas fa-star" style={{marginRight: '8px'}}></i>
                    {t("subtitle")}
                  </div>
                  <h2 className="tst-mb-30">{t("title")}</h2>
                  <p className="tst-text tst-text-lg">
                    {t("description")}
                  </p>
                </div>
              </div>
            </div>

            <div className="row">
              {specialties.map((specialty, index) => (
                <div className="col-lg-4 col-md-6 tst-mb-40" key={`specialty-${index}`}>
                  <div className={styles.card}>
                    <div className={styles.cardImage}>
                      {failedImages.has(index) ? (
                        <div className={styles.cardFallback}>
                          <i className="fas fa-utensils"></i>
                        </div>
                      ) : (
                        <Image 
                          src={getImageSrc(index)}
                          alt={specialty.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: 'cover' }}
                          onError={() => setFailedImages(prev => new Set([...prev, index]))}
                        />
                      )}
                      <div className={styles.priceBadge}>
                        {specialty.price}
                      </div>
                    </div>

                    <div className={styles.cardContent}>
                      <h4 className={styles.cardTitle}>
                        {specialty.title}
                      </h4>
                      
                      <p className={styles.cardText}>
                        {specialty.text}
                      </p>

                      <div className={styles.cardWeight}>
                        <i className="fas fa-weight" style={{color: '#f39c12', marginRight: '8px'}}></i>
                        <span className={styles.cardWeightValue}>
                          {specialty.weight}
                        </span>
                      </div>

                      <div className={styles.cardLinks}>
                        <Link 
                          href="/menu" 
                          className={styles.menuLink}
                        >
                          <i className="fas fa-list" style={{marginRight: '6px'}}></i>
                          {t("menuButton")}
                        </Link>
                        <Link 
                          href="/reservation"
                          className={styles.reservationLink}
                        >
                          <i className="fas fa-calendar" style={{marginRight: '6px'}}></i>
                          {t("reservationButton")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="row justify-content-center">
              <div className="col-lg-6">
                <Link 
                  href="/reservation"
                  className="tst-btn tst-btn-lg tst-btn-shadow"
                  style={{ width: '100%', maxWidth: 'none' }}
                >
                  <span>{t("ctaButton")}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpecialtiesShowcase;