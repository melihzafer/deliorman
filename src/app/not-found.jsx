import { getLocale } from "next-intl/server";

import { Link } from "@/src/i18n/navigation";
import { getLocaleSurfaceCopy } from "@/src/app/[locale]/(pages)/pageCopy";

export default async function NotFound() {
  const locale = await getLocale();
  const copy = getLocaleSurfaceCopy("notFound", locale);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "42rem",
          width: "100%",
          textAlign: "center",
          padding: "2.5rem 2rem",
          borderRadius: "1.5rem",
          background: "rgba(255, 255, 255, 0.92)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.95rem", letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.7 }}>
          404
        </p>
        <h1 style={{ margin: "1rem 0", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
          {copy.title}
        </h1>
        <p style={{ margin: "0 auto 2rem", maxWidth: "32rem", fontSize: "1.05rem", lineHeight: 1.7, opacity: 0.8 }}>
          {copy.description}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.75rem",
          }}
        >
          <Link href="/" className="tst-btn tst-btn-lg">
            <span>{copy.home}</span>
          </Link>
          <Link href="/menu" className="tst-btn tst-btn-border tst-btn-lg">
            <span>{copy.menu}</span>
          </Link>
          <Link href="/contact" className="tst-btn tst-btn-border tst-btn-lg">
            <span>{copy.contact}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
