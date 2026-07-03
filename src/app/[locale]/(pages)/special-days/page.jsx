"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/src/i18n/navigation";
import PageBanner from "@components/PageBanner";
import DarkSection from "@components/DarkSection";

const SpecialDays = () => {
  const t = useTranslations("components.specialDays");
  const tc = useTranslations("common");
  const [imageError, setImageError] = useState(false);

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner 
          pageTitle={t("pageTitle")}
          description={t("pageDescription")}
          breadTitle={t("breadTitle")}
        />
      </div>
      
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              
              {/* Intro Section */}
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="text-center tst-mb-60">
                    <div className="tst-suptitle tst-suptitle-center tst-mb-15" style={{color: '#f39c12'}}>
                      <i className="fas fa-glass-cheers" style={{marginRight: '8px'}}></i>
                      {t("subtitle")}
                    </div>
                    <h3 className="tst-mb-30">{t("title")}</h3>
                    <p className="tst-text tst-text-lg">
                      {t("description")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Events Grid */}
              <div className="row tst-mb-60 card-list-grid">
                <div className="col-lg-4 col-md-6">
                  <div className="tst-icon-box tst-mb-40 text-center">
                    <div className="tst-icon-frame tst-mb-20">
                      <i className="fas fa-birthday-cake" style={{fontSize: '56px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15" style={{color: '#05232B'}}>{t("events.birthdays")}</h5>
                    <p className="tst-text">
                      {t("events.birthdaysDesc")}
                    </p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="tst-icon-box tst-mb-40 text-center">
                    <div className="tst-icon-frame tst-mb-20">
                      <i className="fas fa-ring" style={{fontSize: '56px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15" style={{color: '#05232B'}}>{t("events.engagements")}</h5>
                    <p className="tst-text">
                      {t("events.engagementsDesc")}
                    </p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="tst-icon-box tst-mb-40 text-center">
                    <div className="tst-icon-frame tst-mb-20">
                      <i className="fas fa-users" style={{fontSize: '56px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15" style={{color: '#05232B'}}>{t("events.family")}</h5>
                    <p className="tst-text">
                      {t("events.familyDesc")}
                    </p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="tst-icon-box tst-mb-40 text-center">
                    <div className="tst-icon-frame tst-mb-20">
                      <i className="fas fa-briefcase" style={{fontSize: '56px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15" style={{color: '#05232B'}}>{t("events.corporate")}</h5>
                    <p className="tst-text">
                      {t("events.corporateDesc")}
                    </p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="tst-icon-box tst-mb-40 text-center">
                    <div className="tst-icon-frame tst-mb-20">
                      <i className="fas fa-graduation-cap" style={{fontSize: '56px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15" style={{color: '#05232B'}}>{t("events.graduation")}</h5>
                    <p className="tst-text">
                      {t("events.graduationDesc")}
                    </p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="tst-icon-box tst-mb-40 text-center">
                    <div className="tst-icon-frame tst-mb-20">
                      <i className="fas fa-star-and-crescent" style={{fontSize: '56px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15" style={{color: '#05232B'}}>{t("events.religious")}</h5>
                    <p className="tst-text">
                      {t("events.religiousDesc")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Decoration Section */}
              <div className="row align-items-center tst-mb-60">
                <div className="col-lg-6 tst-mb-30">
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    padding: '1em',
                    height: '100%',
                    gap: "1em",
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <div className="tst-suptitle tst-mb-15" style={{color: '#f39c12'}}>
                      <i className="fas fa-paint-brush" style={{marginRight: '8px'}}></i>
                      {t("decorationSection.subtitle")}
                    </div>
                    <h4 className="tst-mb-20" style={{color: '#05232B'}}>{t("decorationSection.title")}</h4>
                    <p className="tst-text tst-mb-20">
                      {t("decorationSection.description")}
                    </p>
                    <ul style={{listStyle: 'none', padding: 0}}>
                      <li className="tst-text tst-mb-10">
                        <i className="fas fa-check-circle" style={{color: '#f39c12', marginRight: '10px'}}></i>
                        {t("decorationSection.balloons")}
                      </li>
                      <li className="tst-text tst-mb-10">
                        <i className="fas fa-check-circle" style={{color: '#f39c12', marginRight: '10px'}}></i>
                        {t("decorationSection.themed")}
                      </li>
                      <li className="tst-text tst-mb-10">
                        <i className="fas fa-check-circle" style={{color: '#f39c12', marginRight: '10px'}}></i>
                        {t("decorationSection.lighting")}
                      </li>
                      <li className="tst-text tst-mb-10">
                        <i className="fas fa-check-circle" style={{color: '#f39c12', marginRight: '10px'}}></i>
                        {t("decorationSection.tables")}
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-6 tst-mb-30">
                  <div style={{
                    height: '400px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#f8f9fa',
                    position: 'relative'
                  }}>
                    {imageError ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', background: 'linear-gradient(135deg, #f39c12, #d4a373)' }}>
                        <i className="fas fa-paint-brush" style={{ fontSize: '96px', color: 'white', opacity: 0.3 }}></i>
                      </div>
                    ) : (
                      <Image 
                        src="/img/decoration_footage/ukrasa1.webp"
                        alt={t("decorationSection.imageAlt")}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: 'cover' }}
                        onError={() => setImageError(true)}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Mevlid Special Section */}
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <DarkSection>
                    <div className="text-center tst-mb-40">
                      <div className="tst-suptitle tst-white-2 tst-mb-15">
                        <i className="fas fa-star-and-crescent" style={{marginRight: '10px'}}></i>
                        {t("mevlid.subtitle")}
                      </div>
                      <h3 className="tst-white-2 tst-mb-20">{t("mevlid.title")}</h3>
                      <p className="tst-text-lg tst-white-2">
                        {t("mevlid.description")}
                      </p>
                    </div>

                    {/* Mevlid Menu Items */}
                    <div className="row">
                      <div className="col-lg-6 tst-mb-30">
                        <div style={{
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          borderRadius: '10px',
                          padding: '25px',
                          height: '100%'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            marginBottom: '15px'
                          }}>
                            <div style={{
                              backgroundColor: '#f39c12',
                              borderRadius: '50%',
                              width: '40px',
                              height: '40px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '15px',
                              flexShrink: 0
                            }}>
                              <i className="fas fa-drumstick-bite" style={{fontSize: '20px'}}></i>
                            </div>
                            <div>
                              <h5 className="tst-white-2 tst-mb-10">{t("mevlid.chickenLeg")}</h5>
                              <p className="tst-text tst-white-2" style={{opacity: 0.9, fontSize: '14px', marginBottom: 0}}>
                                {t("mevlid.chickenLegDesc")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 tst-mb-30">
                        <div style={{
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          borderRadius: '10px',
                          padding: '25px',
                          height: '100%'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            marginBottom: '15px'
                          }}>
                            <div style={{
                              backgroundColor: '#f39c12',
                              borderRadius: '50%',
                              width: '40px',
                              height: '40px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '15px',
                              flexShrink: 0
                            }}>
                              <i className="fas fa-utensils" style={{fontSize: '20px'}}></i>
                            </div>
                            <div>
                              <h5 className="tst-white-2 tst-mb-10">{t("mevlid.chickenSteak")}</h5>
                              <p className="tst-text tst-white-2" style={{opacity: 0.9, fontSize: '14px', marginBottom: 0}}>
                                {t("mevlid.chickenSteakDesc")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Customization Note */}
                    <div className="text-center tst-mt-30 tst-mb-30">
                      <div style={{
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        borderRadius: '10px',
                        padding: '20px',
                        border: '2px dashed rgba(255,255,255,0.3)'
                      }}>
                        <i className="fas fa-info-circle" style={{fontSize: '24px', color: '#f39c12', marginBottom: '10px', display: 'block'}}></i>
                        <p className="tst-text-lg tst-white-2" style={{marginBottom: 0}}>
                          <strong>{t("mevlid.customNote")}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Contact Button */}
                    <div className="text-center">
                      <Link 
                        href="/reservation"
                        style={{
                          display: 'inline-block',
                          padding: '18px 40px',
                          backgroundColor: '#f39c12',
                          color: 'white',
                          textDecoration: 'none',
                          borderRadius: '8px',
                          fontWeight: '600',
                          fontSize: '16px',
                          transition: 'background-color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d4a373'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f39c12'}
                      >
                        <i className="fas fa-calendar" style={{marginRight: '10px'}}></i>
                        <span>{tc("reserveTable")}</span>
                      </Link>
                      
                      <p className="tst-text tst-white-2 mt-3" style={{opacity: 0.8}}>
                        <i className="fas fa-phone" style={{marginRight: '8px'}}></i>
                        +359 89 4766273
                      </p>
                    </div>
                  </DarkSection>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpecialDays;
