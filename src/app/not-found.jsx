"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@layouts/headers/Index";
import Footer from "@layouts/footers/Index";

const NotFound = () => {
  return (
    <>
      <Header layout={"default"} />

      <div id="tst-dynamic-banner" className="tst-dynamic-banner">

        {/* banner */}
        <div className="tst-banner">
          <div className="tst-cover-frame" style={{"overflow": "hidden"}}>
            <Image 
              src="/img/outdoor_footage/IMG_9337.webp" 
              alt="Ресторант Делиорман - Страницата не е намерена" 
              fill
              priority
              quality={90}
              sizes="100vw"
              className="tst-cover tst-parallax"
              style={{ objectFit: 'cover' }}
            />
            <div className="tst-overlay"></div>
          </div>
          <div className="tst-banner-content-frame">
            <div className="container">
              <div className="tst-main-title-frame">
                <div className="tst-main-title text-center">
                  <div className="tst-suptitle tst-suptitle-center tst-suptitle-mobile-center tst-text-shadow tst-white-2 tst-mb-15">
                    404
                  </div>
                  <h1 className="tst-white-2 tst-text-shadow tst-mb-30">
                    Упс! Изгубихме се...
                  </h1>
                  <div className="tst-text tst-text-shadow tst-text-lg tst-white-2 tst-mb-30">
                    Страницата, която търсите, не съществува или е преместена.<br/>
                    Може да се върнете към началната страница или да разгледате менюто.
                  </div>
                  <div className="tst-404-buttons" style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link href="/" className="tst-btn tst-btn-lg tst-btn-shadow">
                      <span>Начална страница</span>
                    </Link>
                    <Link href="/menu" className="tst-btn tst-btn-lg tst-btn-shadow tst-btn-with-icon">
                      <span>Разгледай менюто</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* banner end */}

        {/* Quick links section */}
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <div className="row">
                <div className="col-lg-12">
                  <div className="text-center tst-mb-60">
                    <h3 className="tst-mb-30">Може би търсите нещо от това?</h3>
                    <p className="tst-text tst-mb-30">
                      Ето няколко полезни връзки, които могат да ви помогнат:
                    </p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-6">
                  <Link href="/menu" className="tst-404-link-card">
                    <div className="tst-icon-box text-center tst-mb-30">
                      <div className="tst-icon-frame tst-mb-20">
                        <i className="fas fa-utensils" style={{ fontSize: '40px', color: '#d4af37' }}></i>
                      </div>
                      <h5 className="tst-mb-10">Меню</h5>
                      <p className="tst-text-sm">Открийте нашите вкусни ястия</p>
                    </div>
                  </Link>
                </div>
                <div className="col-lg-3 col-md-6">
                  <Link href="/reservation" className="tst-404-link-card">
                    <div className="tst-icon-box text-center tst-mb-30">
                      <div className="tst-icon-frame tst-mb-20">
                        <i className="fas fa-calendar-check" style={{ fontSize: '40px', color: '#d4af37' }}></i>
                      </div>
                      <h5 className="tst-mb-10">Резервация</h5>
                      <p className="tst-text-sm">Запазете своята маса</p>
                    </div>
                  </Link>
                </div>
                <div className="col-lg-3 col-md-6">
                  <Link href="/about" className="tst-404-link-card">
                    <div className="tst-icon-box text-center tst-mb-30">
                      <div className="tst-icon-frame tst-mb-20">
                        <i className="fas fa-info-circle" style={{ fontSize: '40px', color: '#d4af37' }}></i>
                      </div>
                      <h5 className="tst-mb-10">За нас</h5>
                      <p className="tst-text-sm">Научете повече за ресторанта</p>
                    </div>
                  </Link>
                </div>
                <div className="col-lg-3 col-md-6">
                  <Link href="/contact" className="tst-404-link-card">
                    <div className="tst-icon-box text-center tst-mb-30">
                      <div className="tst-icon-frame tst-mb-20">
                        <i className="fas fa-phone" style={{ fontSize: '40px', color: '#d4af37' }}></i>
                      </div>
                      <h5 className="tst-mb-10">Контакти</h5>
                      <p className="tst-text-sm">Свържете се с нас</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Quick links section end */}

      </div>

      <Footer layout={"default"} />
      
      <style jsx>{`
        .tst-404-link-card {
          display: block;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-decoration: none;
          color: inherit;
        }
        
        .tst-404-link-card:hover {
          transform: translateY(-5px);
        }
        
        .tst-404-link-card:hover .tst-icon-frame i {
          transform: scale(1.1);
          transition: transform 0.3s ease;
        }
        
        .tst-404-buttons {
          margin-top: 10px;
        }
        
        @media (max-width: 768px) {
          .tst-404-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .tst-404-buttons .tst-btn {
            width: 100%;
            max-width: 300px;
          }
          
          h1.tst-white-2 {
            font-size: 2rem !important;
          }
        }
        
        @media (max-width: 576px) {
          .tst-text-lg {
            font-size: 1rem !important;
          }
          
          .tst-icon-box {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
};
export default NotFound;
