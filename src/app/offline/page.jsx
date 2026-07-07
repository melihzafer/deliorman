"use client";

import Image from "next/image";
import AppData from "@data/app.json";
import { getOrdersPhoneDisplay, getOrdersPhoneHref, getReservationsPhoneDisplay, getReservationsPhoneHref } from "@library/siteContact";

export default function OfflinePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-bg, #fcfcfc)",
        color: "var(--color-text, #1a2f33)",
        textAlign: "center",
        padding: "2rem",
        fontFamily: "var(--font-josefin_sans), sans-serif",
      }}
    >
      {/* Logo */}
      <Image
        src="/img/logo.webp"
        alt={AppData.header.logo.alt}
        width={180}
        height={60}
        style={{ marginBottom: "2rem", maxWidth: "80vw", height: "auto" }}
      />

      {/* Offline icon */}
      <div
        style={{
          fontSize: "3rem",
          marginBottom: "1.5rem",
          opacity: 0.6,
        }}
        aria-hidden="true"
      >
        📡
      </div>

      <h1
        style={{
          fontSize: "1.8rem",
          fontWeight: 700,
          marginBottom: "1rem",
          fontFamily: "var(--font-playfair_display), serif",
        }}
      >
        Няма интернет връзка
      </h1>

      <p
        style={{
          fontSize: "1.1rem",
          marginBottom: "2rem",
          maxWidth: "480px",
          lineHeight: 1.6,
          opacity: 0.8,
        }}
      >
        В момента нямате връзка с интернет. Моля, проверете мрежовата си
        настройка и опитайте отново.
      </p>

      {/* Retry button */}
      <button
        onClick={() => window.location.reload()}
        style={{
          padding: "0.75rem 2rem",
          fontSize: "1rem",
          fontWeight: 600,
          color: "#fff",
          backgroundColor: "var(--color-accent, #f39c12)",
          border: "none",
          borderRadius: "var(--radius-md, 8px)",
          cursor: "pointer",
          marginBottom: "2rem",
          transition: "opacity 0.2s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Опитай отново
      </button>

      {/* Contact info */}
      <div
        style={{
          borderTop: "1px solid var(--color-border, #e5ebef)",
          paddingTop: "1.5rem",
          opacity: 0.7,
          fontSize: "0.95rem",
          lineHeight: 1.8,
        }}
      >
        <p style={{ marginBottom: "0.25rem" }}>
          Можете да ни се обадите директно:
        </p>
        <p style={{ marginBottom: "0.25rem" }}>
          Телефон за поръчки:{" "}
          <a
            href={getOrdersPhoneHref()}
            style={{
              color: "var(--color-accent, #f39c12)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            {getOrdersPhoneDisplay()}
          </a>
        </p>
        <p style={{ marginBottom: "0.25rem" }}>
          Телефон за резервации:{" "}
          <a
            href={getReservationsPhoneHref()}
            style={{
              color: "var(--color-accent, #f39c12)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            {getReservationsPhoneDisplay()}
          </a>
        </p>
        <p style={{ marginTop: "0.75rem", fontSize: "0.85rem" }}>
          с. Самуил, ул. &quot;Хаджи Димитър&quot; №6, обл. Разград
        </p>
      </div>
    </div>
  );
}
