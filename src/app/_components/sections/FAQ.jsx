import { getTranslations } from "next-intl/server";

import AnimateOnScroll from "@components/common/AnimateOnScroll";
import { getOrdersPhoneDisplay, getReservationsPhoneDisplay } from "@library/siteContact";
import styles from "./FAQ.module.scss";

// Renders the same Q&A used in the FAQPage JSON-LD (StructuredData.jsx).
// Google requires FAQ schema content to be visible on the page — this
// section is why the schema is only emitted on the homepage.
const FAQ = async () => {
  const t = await getTranslations("structuredData");
  const tc = await getTranslations("common");
  const items = t.raw("faq");
  const ordersPhone = getOrdersPhoneDisplay();
  const reservationsPhone = getReservationsPhoneDisplay();

  const resolve = (text) =>
    text
      .replace("{phone}", reservationsPhone)
      .replace("{ordersPhone}", ordersPhone)
      .replace("{reservationsPhone}", reservationsPhone);

  return (
    <div className={styles.faq}>
      <div className="container">
        <div className="text-center tst-mb-60">
          <div className="tst-suptitle tst-suptitle-center tst-mb-15" style={{ color: "#f39c12" }}>
            <i className="fas fa-question-circle" style={{ marginRight: "8px" }}></i>
            {tc("faqEyebrow")}
          </div>
          <h3>{tc("faqTitle")}</h3>
        </div>
        <div className={styles.list}>
          {items.map((item, index) => (
            <AnimateOnScroll key={`faq-${index}`} delay={index * 0.05} initialVisible={true}>
              <details className={styles.item}>
                <summary className={styles.question}>{item.question}</summary>
                <p className={styles.answer}>{resolve(item.answer)}</p>
              </details>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
