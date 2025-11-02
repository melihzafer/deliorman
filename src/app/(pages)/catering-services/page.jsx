"use client";

import React from "react";
import PageBanner from "@components/PageBanner";
import DecorationGallery from "@components/sections/DecorationGallery";

const CateringServices = () => {
  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner 
          pageTitle={"Услуги"} 
          description={"Професионално кетъринг обслужване за вашите събития"} 
          breadTitle={"Услуги"} 
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
                      <i className="fas fa-concierge-bell" style={{marginRight: '8px'}}></i>
                      Нашите услуги
                    </div>
                    <h3 className="tst-mb-30">Кетъринг и специално обслужване</h3>
                    <p className="tst-text tst-text-lg">
                      Предлагаме професионално кетъринг обслужване за всички видове събития - 
                      от малки семейни събирания до големи корпоративни мероприятия.
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Catering Section */}
              <div className="row align-items-center tst-mb-60">
                <div className="col-lg-6 tst-mb-30">
                  <div style={{
                    height: '450px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src="/img/indoor_footage/IMG_93.png"
                      alt="Кетъринг услуги"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: linear-gradient(135deg, #f39c12, #d4a373);">
                            <i class="fas fa-concierge-bell" style="font-size: 96px; color: white; opacity: 0.3;"></i>
                          </div>
                        `;
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-6 tst-mb-30">
                  <div className="tst-suptitle tst-mb-15" style={{color: '#f39c12'}}>
                    <i className="fas fa-truck" style={{marginRight: '8px'}}></i>
                    Кетъринг
                  </div>
                                    <h4 className="tst-mb-20" style={{color: '#05232B'}}>Огромни количества за вашите събития</h4>
                  <p className="tst-text tst-mb-30">
                    Организираме кетъринг за <strong>големи събития от 10 порции нагоре</strong>. 
                    Нашият екип се грижи за всичко - от приготвянето на храната до доставката и сервирането.
                  </p>
                  
                  <div className="row catering-list-group">
                    <div className="col-md-6 tst-mb-20">
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                       
                      }}>
                        <div style={{
                          backgroundColor: '#f39c12',
                          borderRadius: '50%',
                          width: '35px',
                          height: '35px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px',
                          flexShrink: 0
                        }}>
                          <i className="fas fa-check" style={{fontSize: '16px', color: 'white'}}></i>
                        </div>
                        <div>
                          <h6 style={{color: '#05232B', marginBottom: '5px'}}>Минимум 10 порции</h6>
                          <p className="tst-text" style={{fontSize: '14px', marginBottom: 0}}>
                            Идеално за събития
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 tst-mb-20">
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start'
                      }}>
                        <div style={{
                          backgroundColor: '#f39c12',
                          borderRadius: '50%',
                          width: '35px',
                          height: '35px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px',
                          flexShrink: 0
                        }}>
                          <i className="fas fa-check" style={{fontSize: '16px', color: 'white'}}></i>
                        </div>
                        <div>
                          <h6 style={{color: '#05232B', marginBottom: '5px'}}>Свежа храна</h6>
                          <p className="tst-text" style={{fontSize: '14px', marginBottom: 0}}>
                            Приготвена на момента
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 tst-mb-20">
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start'
                      }}>
                        <div style={{
                          backgroundColor: '#f39c12',
                          borderRadius: '50%',
                          width: '35px',
                          height: '35px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px',
                          flexShrink: 0
                        }}>
                          <i className="fas fa-check" style={{fontSize: '16px', color: 'white'}}></i>
                        </div>
                        <div>
                          <h6 style={{color: '#05232B', marginBottom: '5px'}}>Доставка</h6>
                          <p className="tst-text" style={{fontSize: '14px', marginBottom: 0}}>
                            Навреме и безопасно
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 tst-mb-20">
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start'
                      }}>
                        <div style={{
                          backgroundColor: '#f39c12',
                          borderRadius: '50%',
                          width: '35px',
                          height: '35px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px',
                          flexShrink: 0
                        }}>
                          <i className="fas fa-check" style={{fontSize: '16px', color: 'white'}}></i>
                        </div>
                        <div>
                          <h6 style={{color: '#05232B', marginBottom: '5px'}}>Персонализирано меню</h6>
                          <p className="tst-text" style={{fontSize: '14px', marginBottom: 0}}>
                            По ваш избор
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services Grid */}
              <div className="row tst-mb-60 card-list-grid">
                <div className="col-lg-4 col-md-6">
                  <div className="tst-icon-box tst-mb-40 text-center">
                    <div className="tst-icon-frame tst-mb-20">
                      <i className="fas fa-building" style={{fontSize: '56px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15" style={{color: '#05232B'}}>Корпоративен кетъринг</h5>
                    <p className="tst-text">
                      Бизнес обеди, конференции и корпоративни събития с професионално обслужване
                    </p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="tst-icon-box tst-mb-40 text-center">
                    <div className="tst-icon-frame tst-mb-20">
                      <i className="fas fa-home" style={{fontSize: '56px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15" style={{color: '#05232B'}}>Домашни партита</h5>
                    <p className="tst-text">
                      Семейни събирания и домашни празненства с богато меню
                    </p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="tst-icon-box tst-mb-40 text-center">
                    <div className="tst-icon-frame tst-mb-20">
                      <i className="fas fa-utensils" style={{fontSize: '56px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15" style={{color: '#05232B'}}>Специални менюта</h5>
                    <p className="tst-text">
                      Персонализирани менюта според вашите изисквания и диетични нужди
                    </p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="tst-icon-box tst-mb-40 text-center">
                    <div className="tst-icon-frame tst-mb-20">
                      <i className="fas fa-users-cog" style={{fontSize: '56px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15" style={{color: '#05232B'}}>Професионален персонал</h5>
                    <p className="tst-text">
                      Опитен екип за обслужване на вашето събитие
                    </p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="tst-icon-box tst-mb-40 text-center">
                    <div className="tst-icon-frame tst-mb-20">
                      <i className="fas fa-wine-glass-alt" style={{fontSize: '56px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15" style={{color: '#05232B'}}>Напитки и коктейли</h5>
                    <p className="tst-text">
                      Пълна гама напитки и специални коктейли за вашите гости
                    </p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="tst-icon-box tst-mb-40 text-center">
                    <div className="tst-icon-frame tst-mb-20">
                      <i className="fas fa-boxes" style={{fontSize: '56px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15" style={{color: '#05232B'}}>Пакетни предложения</h5>
                    <p className="tst-text">
                      Изгодни пакети според броя гости и вида на събитието
                    </p>
                  </div>
                </div>
              </div>

              {/* Decoration Gallery Section */}
              <DecorationGallery />

              {/* CTA Section */}
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '15px',
                    padding: '50px 40px',
                    textAlign: 'center'
                  }}>
                    <i className="fas fa-phone-volume" style={{fontSize: '64px', color: '#f39c12', marginBottom: '20px'}}></i>
                    <h4 className="tst-mb-20" style={{color: '#04161B'}}>Свържете се с нас за оферта</h4>
                    <p className="tst-text tst-text-lg tst-mb-30">
                      Обадете се на нашия екип за консултация и индивидуална оферта за вашето събитие. 
                      Ще ви помогнем да изберете перфектното меню и организация.
                    </p>
                    <a 
                      href="tel:+359894766273"
                      style={{
                        display: 'inline-block',
                        padding: '18px 40px',
                        backgroundColor: '#04161B',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '16px',
                        transition: 'background-color 0.3s ease',
                        marginRight: '15px',
                        marginBottom: '15px'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#6b3c1a'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#04161B'}
                    >
                      <i className="fas fa-phone" style={{marginRight: '10px'}}></i>
                      Обадете се сега
                    </a>
                    <a 
                      href="/menu"
                      style={{
                        display: 'inline-block',
                        padding: '18px 40px',
                        backgroundColor: '#f39c12',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '16px',
                        transition: 'background-color 0.3s ease',
                        marginBottom: '15px'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#d4a373'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#f39c12'}
                    >
                      <i className="fas fa-list" style={{marginRight: '10px'}}></i>
                      Вижте менюто
                    </a>
                    <p className="tst-text tst-mt-30" style={{fontSize: '18px', fontWeight: '600', color: '#04161B'}}>
                      <i className="fas fa-phone" style={{marginRight: '8px', color: '#f39c12'}}></i>
                      +359 89 4766273
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CateringServices;
