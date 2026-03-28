"use client";

import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import { getRestaurantPhoneDisplay, getRestaurantPhoneHref, getRestaurantPhoneNormalized } from "@library/siteContact";

export default function LegacyOrderNotice({
  title,
  description,
  menuHref = "/menu",
}) {
  const t = useTranslations("orderFlow");
  const restaurantPhone = getRestaurantPhoneDisplay();
  const phoneHref = getRestaurantPhoneHref();
  const whatsappHref = `https://wa.me/${getRestaurantPhoneNormalized()}?text=${encodeURIComponent(
    t("whatsappIntro")
  )}`;

  return (
    <section className="tst-p-90-90">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="tst-icon-box text-center">
            <div className="tst-icon-frame tst-mb-15">
              <i className="fas fa-utensils" style={{ fontSize: "48px", color: "#f39c12" }}></i>
            </div>
            <h4 className="tst-mb-15">{title}</h4>
            <p className="tst-text tst-mb-15">{description}</p>
            <p className="tst-text tst-mb-30">
              {t("legacyLead")}
            </p>

            <div
              className="tst-buttons-frame"
              style={{ justifyContent: "center", gap: "12px", flexWrap: "wrap" }}
            >
              <Link href={menuHref} className="tst-btn tst-btn-with-icon">
                <span className="tst-icon">
                  <i className="fas fa-utensils"></i>
                </span>
                <span>{t("menuButton")}</span>
              </Link>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="tst-btn tst-btn-with-icon tst-btn-2"
              >
                <span className="tst-icon">
                  <i className="fab fa-whatsapp"></i>
                </span>
                <span>{t("whatsappButton")}</span>
              </a>

              <a href={phoneHref} className="tst-btn tst-btn-with-icon tst-btn-2">
                <span className="tst-icon">
                  <i className="fas fa-phone-alt"></i>
                </span>
                <span>{restaurantPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
