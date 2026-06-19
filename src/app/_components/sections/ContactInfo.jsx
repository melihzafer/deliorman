import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { getRestaurantPhoneDisplay } from "@library/siteContact";

const CONTACT_INFO_ICONS = [
  "fas fa-phone",
  "fas fa-envelope",
  "fas fa-location-dot",
];

const ContactInfoSection = async () => {
  const t = await getTranslations("contact");
  const phoneDisplay = getRestaurantPhoneDisplay();
  const infoItems = [
    {
      icon: CONTACT_INFO_ICONS[0],
      title: t("reservationPhoneTitle"),
      content: (
        <>
          <Link href="/reservation">{phoneDisplay}</Link>
          <br />
          <span style={{ fontSize: "14px", color: "#595959" }}>
            {t("workingHours")}
          </span>
        </>
      ),
    },
    {
      icon: CONTACT_INFO_ICONS[1],
      title: t("emailInquiriesTitle"),
      content: (
        <>
          <a href="mailto:restaurantdeliorman@gmail.com">
            restaurantdeliorman@gmail.com
          </a>
          <br />
          <span style={{ fontSize: "14px", color: "#595959" }}>
            {t("emailResponseTime")}
          </span>
        </>
      ),
    },
    {
      icon: CONTACT_INFO_ICONS[2],
      title: t("addressTitle"),
      content: (
        <>
          {t("addressLine1")}
          <br />
          {t("addressLine2")}
          <br />
          <span style={{ fontSize: "14px", color: "#595959" }}>
            {t("parkingAvailable")}
          </span>
        </>
      ),
    },
  ];

  return (
    <>
        {/* contact info */}
        <div className="row" id="contact">
            <div className="col-lg-12">

            {/* title */}
            <div className="text-center">
                <div className="tst-suptitle tst-suptitle-center tst-mb-15" dangerouslySetInnerHTML={{__html : t("infoSubtitle")}} />
                <h3 className="tst-mb-30" dangerouslySetInnerHTML={{__html : t("infoTitle")}} />
                <p className="tst-text tst-mb-60" dangerouslySetInnerHTML={{__html : t("infoDescription")}} />
            </div>
            {/* title end */}

            </div>

            {infoItems.map((item, key) => (
            <div className="col-lg-4" key={`contact-info-item-${key}`}>

            {/* icon box */}
            <div className="tst-icon-box tst-mb-60">
                <i className={`${item.icon} tst-mb-30`} style={{ fontSize: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }} aria-hidden="true"></i>
                <h5 className="tst-mb-30">{item.title}</h5>
                <div className="tst-text">{item.content}</div>
            </div>
            {/* icon box end */}

            </div>
            ))}
        </div>
        {/* contact info end */}
    </>
  );
};

export default ContactInfoSection;
