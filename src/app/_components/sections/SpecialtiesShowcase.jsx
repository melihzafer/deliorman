"use client";

import React from "react";
import SpecialtiesData from "@data/specialties.json";

const SpecialtiesShowcase = () => {
  const specialties = SpecialtiesData.categories[0]?.items || [];

  return (
    <>
      <div className="tst-content-frame">
        <div className="tst-content-box">
          <div className="container tst-p-60-60">
            {/* Section Header */}
            <div className="row justify-content-center tst-mb-60">
              <div className="col-lg-8">
                <div className="text-center">
                  <div className="tst-suptitle tst-suptitle-center tst-mb-15" style={{color: '#f39c12'}}>
                    <i className="fas fa-star" style={{marginRight: '8px'}}></i>
                    Нови Специалитети
                  </div>
                  <h2 className="tst-mb-30">Изпробвайте нашите нови ястия</h2>
                  <p className="tst-text tst-text-lg">
                    Свежо приготвени специалитети, вдъхновени от традиционната българска кухня с модерен подход.
                  </p>
                </div>
              </div>
            </div>

            {/* Specialties Grid */}
            <div className="row">
              {specialties.map((specialty, index) => (
                <div className="col-lg-4 col-md-6 tst-mb-40" key={`specialty-${index}`}>
                  <div className="tst-product-card tst-fade-up" style={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer'
                  }}>
                    {/* Card Image */}
                    <div style={{
                      height: '250px',
                      backgroundColor: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <img 
                        src={`/img/menu/specialty-${index + 1}.jpg`}
                        alt={specialty.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: linear-gradient(135deg, #f39c12, #d4a373);">
                              <i class="fas fa-utensils" style="font-size: 64px; color: white; opacity: 0.3;"></i>
                            </div>
                          `;
                        }}
                      />
                      {/* Price Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        backgroundColor: '#f39c12',
                        color: 'white',
                        padding: '8px 15px',
                        borderRadius: '25px',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        {specialty.price}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div style={{padding: '25px'}}>
                      <h4 style={{
                        color: '#05232B',
                        marginBottom: '10px',
                        fontSize: '18px',
                        fontWeight: '600'
                      }}>
                        {specialty.title}
                      </h4>
                      
                      <p style={{
                        color: '#666',
                        marginBottom: '15px',
                        fontSize: '14px',
                        lineHeight: '1.5'
                      }}>
                        {specialty.text}
                      </p>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '20px',
                        paddingBottom: '15px',
                        borderBottom: '1px solid #e8e8e8'
                      }}>
                        <i className="fas fa-weight" style={{color: '#f39c12', marginRight: '8px'}}></i>
                        <span style={{color: '#05232B', fontWeight: '600', fontSize: '14px'}}>
                          {specialty.weight}
                        </span>
                      </div>

                      {/* Links */}
                      <div style={{display: 'flex', gap: '10px'}}>
                        <a 
                          href="/menu" 
                          style={{
                            flex: 1,
                            padding: '12px 15px',
                            backgroundColor: '#f39c12',
                            color: 'white',
                            textAlign: 'center',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'background-color 0.3s ease',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#ff9100ff'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#f39c12'}
                        >
                          <i className="fas fa-list" style={{marginRight: '6px'}}></i>
                          Меню
                        </a>
                        <a 
                          href="tel:+359894766273" 
                          style={{
                            flex: 1,
                            padding: '12px 15px',
                            backgroundColor: '#05232B',
                            color: 'white',
                            textAlign: 'center',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'background-color 0.3s ease',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#6b3c1a'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#05232B'}
                        >
                          <i className="fas fa-calendar" style={{marginRight: '6px'}}></i>
                          Резервация
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA Button */}
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <a 
                  href="tel:+359894766273" 
                  className="tst-btn tst-btn-lg tst-btn-shadow"
                  style={{
                    width: '100%',
                    display: 'block',
                    textAlign: 'center',
                    backgroundColor: '#05232B',
                    color: 'white !important',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '16px',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#6b3c1a'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#05232B'}
                >
                  {/* <i className="fas fa-phone" style={{marginRight: '10px'}}></i> */}
                  Резервирайте вашата маса сега
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpecialtiesShowcase;
