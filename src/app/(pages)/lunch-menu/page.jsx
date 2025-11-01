"use client";

import React from "react";

import AppData from "@data/app.json";

import PageBanner from "@components/PageBanner";
import CallToActionFourSection from "../../_components/sections/CallToActionFour";
import CallToActionThreeSection from "../../_components/sections/CallToActionThree";
import SpecialtiesShowcase from "../../_components/sections/SpecialtiesShowcase";

const LunchMenu = () => {
  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner 
          pageTitle={"Обедно меню"} 
          description={"Всеки ден ново и вкусно обедно меню<br>специално приготвено за вас"} 
          breadTitle={"Обедно меню"} 
        />
      </div>
      
      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              
              {/* Info Section */}
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="text-center tst-mb-60">
                    <div className="tst-suptitle tst-suptitle-center tst-mb-15">Ежедневно обновявано</div>
                    <h3 className="tst-mb-30">Нашето обедно меню</h3>
                    <p className="tst-text tst-mb-30">
                      Всеки ден готвим свежо и вкусно обедно меню със специални предложения. 
                      Менюто се качва ежедневно на нашата Facebook страница, за да можете да 
                      разгледате какво вкусно сме приготвили за вас.
                    </p>
                  </div>
                </div>
              </div>

              {/* Facebook CTA Card */}
              <div className="row justify-content-center tst-mb-60">
                <div className="col-lg-10">
                  <div className="tst-call-to-action" style={{backgroundColor: '#503d20ff', borderRadius: '15px', padding: '60px 40px'}}>
                    <div className="row align-items-center">
                      <div className="col-lg-8">
                        <div className="tst-cta-frame">
                          <div className="tst-cta">
                            <div className="tst-fade-up">
                              <div className="tst-suptitle tst-white-2 tst-mb-15">
                                <i className="fab fa-facebook" style={{marginRight: '10px'}}></i>
                                Следете ни във Facebook
                              </div>
                            </div>
                            <h3 className="tst-white-2 tst-mb-20 tst-fade-up">Ежедневно обедно меню</h3>
                            <div className="tst-fade-up">
                              <p className="tst-text tst-text-lg tst-white-2 tst-mb-30">
                                Качваме нашето дневно обедно меню всяка сутрин на Facebook страницата ни. 
                                Не пропускайте специалните предложения и любимите си ястия!
                              </p>
                            </div>
                            <a 
                              href="https://www.facebook.com/profile.php?id=61571085206794" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="tst-btn tst-btn-lg tst-btn-shadow tst-fade-up"
                              style={{backgroundColor: 'white !important', color: '#1877f2 !important'}}
                            >
                              <i className="fab fa-facebook" style={{marginRight: '8px'}}></i>
                              Отидете в Facebook
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="text-center tst-fade-up">
                          <i className="fab fa-facebook" style={{fontSize: '120px', color: 'white', opacity: '0.3'}}></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="row">
                <div className="col-lg-4">
                  <div className="tst-icon-box tst-mb-60 text-center">
                    <div className="tst-icon-frame tst-mb-15">
                      <i className="fas fa-calendar-day" style={{fontSize: '48px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15">Ежедневно обновяване</h5>
                    <p className="tst-text">
                      Всеки ден качваме ново меню с различни вкусни ястия
                    </p>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="tst-icon-box tst-mb-60 text-center">
                    <div className="tst-icon-frame tst-mb-15">
                      <i className="fas fa-utensils" style={{fontSize: '48px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15">Свежо приготвено</h5>
                    <p className="tst-text">
                      Всички ястия се готвят на момента от най-свежи съставки
                    </p>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="tst-icon-box tst-mb-60 text-center">
                    <div className="tst-icon-frame tst-mb-15">
                      <i className="fas fa-tags" style={{fontSize: '48px', color: '#f39c12'}}></i>
                    </div>
                    <h5 className="tst-mb-15">Специални цени</h5>
                    <p className="tst-text">
                      Изгодни цени на обедното меню с богат избор от ястия
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="text-center">
                    <div className="tst-separator tst-mb-30"></div>
                    <h5 className="tst-mb-15">Работно време за обяд</h5>
                    <p className="tst-text tst-mb-15">
                      Понеделник - Неделя: 12:00 - 15:00
                    </p>
                    <p className="tst-text">
                      За резервации: <a href="tel:+359894766273" style={{color: '#04161B', fontWeight: '600'}}>+359 89 4766273</a>
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* New Specialties Showcase Section */}
      
            
        {/* Call to Action - View Full Menu */}
        <div className="tst-call-to-action" style={{backgroundColor: '#f8f9fa10'}}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="tst-cta-frame">
                  <div className="tst-cta">
                    <div className="tst-fade-up">
                      <div className="tst-suptitle tst-suptitle-mobile-md-center tst-text-shadow tst-white-2 tst-mb-15">
                        Нашето пълно меню
                      </div>
                    </div>
                    <h2 className="tst-white-2 tst-text-shadow tst-mb-30 tst-fade-up">
                      Разгледайте пълното<br/>ни меню
                    </h2>
                    <div className="tst-fade-up">
                      <div className="tst-text tst-text-lg tst-text-shadow tst-white-2">
                        Освен обедното меню, разполагаме с богато основно меню със специалитети от скара, 
                        пици, салати, супи и много други вкусни ястия.
                      </div>
                    </div>
                    <a href="/menu" className="tst-btn tst-btn-lg tst-btn-shadow tst-mt-30 tst-fade-up">
                      Вижте менюто
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <img 
                  src="/img/menu/menu-cta.jpg" 
                  alt="Меню на ресторант Делиорман" 
                  className="tst-cta-image tst-fade-up"
                  onError={(e) => {
                    e.target.src = '/img/bg.jpg';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
                    <SpecialtiesShowcase />
      </div>
    </>
  );
};

export default LunchMenu;
