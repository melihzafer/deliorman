"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";

import { Link } from "@/src/i18n/navigation";
import PageBanner from "@components/PageBanner";
import DecorationGallery from "@components/sections/DecorationGallery";

import { getCateringServicesContent } from "./content";

const CateringServices = () => {
  const locale = useLocale();
  const content = getCateringServicesContent(locale);
  const [imageError, setImageError] = useState(false);

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner
          pageTitle={content.banner.pageTitle}
          description={content.banner.description}
          breadTitle={content.banner.breadTitle}
        />
      </div>

      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="text-center tst-mb-60">
                    <div className="tst-suptitle tst-suptitle-center tst-mb-15" style={{ color: "#f39c12" }}>
                      <i className="fas fa-concierge-bell" style={{ marginRight: "8px" }}></i>
                      {content.intro.eyebrow}
                    </div>
                    <h3 className="tst-mb-30">{content.intro.title}</h3>
                    <p className="tst-text tst-text-lg">{content.intro.description}</p>
                  </div>
                </div>
              </div>

              <div className="row align-items-center tst-mb-60">
                <div className="col-lg-6 tst-mb-30">
                  <div
                    style={{
                      height: "450px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      backgroundColor: "#f8f9fa",
                      position: "relative",
                    }}
                  >
                    {imageError ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          height: "100%",
                          background: "linear-gradient(135deg, #f39c12, #d4a373)",
                        }}
                      >
                        <i className="fas fa-concierge-bell" style={{ fontSize: "96px", color: "white", opacity: 0.3 }}></i>
                      </div>
                    ) : (
                      <Image
                        src="/img/indoor_footage/IMG_93.webp"
                        alt={content.main.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: "cover" }}
                        onError={() => setImageError(true)}
                      />
                    )}
                  </div>
                </div>
                <div className="col-lg-6 tst-mb-30">
                  <div className="tst-suptitle tst-mb-15" style={{ color: "#f39c12" }}>
                    <i className="fas fa-truck" style={{ marginRight: "8px" }}></i>
                    {content.main.eyebrow}
                  </div>
                  <h4 className="tst-mb-20" style={{ color: "#05232B" }}>
                    {content.main.title}
                  </h4>
                  <p className="tst-text tst-mb-30">{content.main.description}</p>

                  <div className="row catering-list-group">
                    {content.features.map((feature) => (
                      <div className="col-md-6 tst-mb-20" key={feature.title}>
                        <div style={{ display: "flex", alignItems: "flex-start" }}>
                          <div
                            style={{
                              backgroundColor: "#f39c12",
                              borderRadius: "50%",
                              width: "35px",
                              height: "35px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginRight: "12px",
                              flexShrink: 0,
                            }}
                          >
                            <i className="fas fa-check" style={{ fontSize: "16px", color: "white" }}></i>
                          </div>
                          <div>
                            <h6 style={{ color: "#05232B", marginBottom: "5px" }}>{feature.title}</h6>
                            <p className="tst-text" style={{ fontSize: "14px", marginBottom: 0 }}>
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="row tst-mb-60 card-list-grid">
                {content.services.map((service) => (
                  <div className="col-lg-4 col-md-6" key={service.title}>
                    <div className="tst-icon-box tst-mb-40 text-center">
                      <div className="tst-icon-frame tst-mb-20">
                        <i className={service.icon} style={{ fontSize: "56px", color: "#f39c12" }}></i>
                      </div>
                      <h5 className="tst-mb-15" style={{ color: "#05232B" }}>
                        {service.title}
                      </h5>
                      <p className="tst-text">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <DecorationGallery copy={content.decorationGallery} />

              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: "15px",
                      padding: "50px 40px",
                      textAlign: "center",
                    }}
                  >
                    <i className="fas fa-phone-volume" style={{ fontSize: "64px", color: "#f39c12", marginBottom: "20px" }}></i>
                    <h4 className="tst-mb-20" style={{ color: "#04161B" }}>
                      {content.cta.title}
                    </h4>
                    <p className="tst-text tst-text-lg tst-mb-30">{content.cta.description}</p>
                    <Link
                      href="/reservation"
                      style={{
                        display: "inline-block",
                        padding: "1em 2em",
                        backgroundColor: "#04161B",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "16px",
                        transition: "background-color 0.3s ease",
                        marginRight: "auto",
                        marginLeft: "auto",
                        marginBottom: "15px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#6b3c1a";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#04161B";
                      }}
                    >
                      <i className="fas fa-calendar" style={{ marginRight: "10px" }}></i>
                      {content.cta.reserve}
                    </Link>
                    <div style={{ display: "flex", width: "1em", height: "1em" }}></div>
                    <Link
                      href="/menu"
                      style={{
                        display: "inline-block",
                        padding: "18px 40px",
                        backgroundColor: "#f39c12",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        fontSize: "16px",
                        transition: "background-color 0.3s ease",
                        marginBottom: "15px",
                        marginRight: "auto",
                        marginLeft: "auto",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#d4a373";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#f39c12";
                      }}
                    >
                      <i className="fas fa-list" style={{ marginRight: "10px" }}></i>
                      {content.cta.menu}
                    </Link>
                    <p className="tst-text tst-mt-30" style={{ fontSize: "18px", fontWeight: "600", color: "#04161B" }}>
                      <i className="fas fa-phone" style={{ marginRight: "8px", color: "#f39c12" }}></i>
                      {content.cta.phone}
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
