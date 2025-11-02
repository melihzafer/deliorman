"use client";

import React from "react";
import PageBanner from "@components/PageBanner";
import DarkSection from "@components/DarkSection";

const SpecialDays = () => {
  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner 
          pageTitle={"Специални дни"} 
          description={"Празнувайте вашите специални моменти с нас"} 
          breadTitle={"Специални дни"} 
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
                      Празненства и събития
                    </div>
                    <h3 className="tst-mb-30">Вашите специални моменти са нашият приоритет</h3>
                    <p className="tst-text tst-text-lg">
                      В ресторант Делиорман организираме незабравими празненства за всички ваши специални дни - 
                      рожденни дни, годежи, семейни тържества и корпоративни събития.
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
                    <h5 className="tst-mb-15" style={{color: '#05232B'}}>Рожденни дни</h5>
                    <p className="tst-text">
                      Направете вашия рожден ден незабравим с нашето специално меню и атмосфера
                    </p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="tst-icon-box tst-mb-40 text-center">
                    <div className="tst-icon-frame tst-mb-20">
                      <i className="fas fa-ring" style={{fontSize: '56px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15" style={{color: '#05232B'}}>Годежи и сватби</h5>
                    <p className="tst-text">
                      Празнувайте вашата любов с перфектна организация и изискано меню
                    </p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="tst-icon-box tst-mb-40 text-center">
                    <div className="tst-icon-frame tst-mb-20">
                      <i className="fas fa-users" style={{fontSize: '56px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15" style={{color: '#05232B'}}>Семейни тържества</h5>
                    <p className="tst-text">
                      Съберете цялото семейство за специални моменти в топла и уютна обстановка
                    </p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="tst-icon-box tst-mb-40 text-center">
                    <div className="tst-icon-frame tst-mb-20">
                      <i className="fas fa-briefcase" style={{fontSize: '56px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15" style={{color: '#05232B'}}>Корпоративни събития</h5>
                    <p className="tst-text">
                      Професионално обслужване за бизнес срещи, тийм билдинги и коктейли
                    </p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="tst-icon-box tst-mb-40 text-center">
                    <div className="tst-icon-frame tst-mb-20">
                      <i className="fas fa-graduation-cap" style={{fontSize: '56px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15" style={{color: '#05232B'}}>Дипломирания и абитуриенти</h5>
                    <p className="tst-text">
                      Празнувайте успехите с приятели и близки в стилна обстановка
                    </p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="tst-icon-box tst-mb-40 text-center">
                    <div className="tst-icon-frame tst-mb-20">
                      <i className="fas fa-star-and-crescent" style={{fontSize: '56px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15" style={{color: '#05232B'}}>Религиозни празници</h5>
                    <p className="tst-text">
                      Специални менюта за Мевлид и други важни религиозни дни
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
                      Декорация
                    </div>
                    <h4 className="tst-mb-20" style={{color: '#05232B'}}>Перфектната атмосфера за вашето събитие</h4>
                    <p className="tst-text tst-mb-20">
                      <strong>Украсата е от нас!</strong> Нашият екип се грижи за цялостната декорация на пространството 
                      според вашите предпочитания и темата на събитието.
                    </p>
                    <ul style={{listStyle: 'none', padding: 0}}>
                      <li className="tst-text tst-mb-10">
                        <i className="fas fa-check-circle" style={{color: '#f39c12', marginRight: '10px'}}></i>
                        Балони и цветни аранжименти
                      </li>
                      <li className="tst-text tst-mb-10">
                        <i className="fas fa-check-circle" style={{color: '#f39c12', marginRight: '10px'}}></i>
                        Тематична украса по желание
                      </li>
                      <li className="tst-text tst-mb-10">
                        <i className="fas fa-check-circle" style={{color: '#f39c12', marginRight: '10px'}}></i>
                        Специално осветление
                      </li>
                      <li className="tst-text tst-mb-10">
                        <i className="fas fa-check-circle" style={{color: '#f39c12', marginRight: '10px'}}></i>
                        Персонализирана украса на масите
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src="/img/decoration_footage/ukrasa1.webp"
                      alt="Декорация за специални дни"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: linear-gradient(135deg, #f39c12, #d4a373);">
                            <i class="fas fa-paint-brush" style="font-size: 96px; color: white; opacity: 0.3;"></i>
                          </div>
                        `;
                      }}
                    />
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
                        Специално меню
                      </div>
                      <h3 className="tst-white-2 tst-mb-20">Мевлид и религиозни празници</h3>
                      <p className="tst-text-lg tst-white-2">
                        Организираме специални порции за Мевлид и други религиозни дни 
                        с традиционно меню и професионално обслужване
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
                              <h5 className="tst-white-2 tst-mb-10">Пилешко бутче с гарнитура</h5>
                              <p className="tst-text tst-white-2" style={{opacity: 0.9, fontSize: '14px', marginBottom: 0}}>
                                Сочно пилешко бутче с ориз, варени картофи, чушка и питка
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
                              <h5 className="tst-white-2 tst-mb-10">Пилешка пържола с гарнитура</h5>
                              <p className="tst-text tst-white-2" style={{opacity: 0.9, fontSize: '14px', marginBottom: 0}}>
                                Пилешка пържола с ориз, варени картофи, чушка и питка
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
                          <strong>Менюто може да бъде променено според предпочитанията на клиента</strong>
                        </p>
                      </div>
                    </div>

                    {/* Contact Button */}
                    <div className="text-center">
                      <a 
                        href="tel:+359894766273"
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
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#d4a373'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#f39c12'}
                      >
                        <i className="fas fa-phone" style={{marginRight: '10px'}}></i>
                        Обадете се за повече информация
                      </a>
                      
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
