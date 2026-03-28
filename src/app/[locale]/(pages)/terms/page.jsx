import React from "react";
import { getLocale } from "next-intl/server";

import { buildAlternates } from "@/src/i18n/seo";
import PageBanner from "@components/PageBanner";

import { getTermsContent } from "./content";

export async function generateMetadata() {
  const locale = await getLocale();
  const content = getTermsContent(locale);

  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: buildAlternates("/terms", locale),
    robots: { index: false, follow: false },
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      type: "website",
    },
  };
}

export default async function TermsPage() {
  const locale = await getLocale();
  const content = getTermsContent(locale);
  const { banner, sections } = content;

  return (
    <>
      <div id="tst-dynamic-banner" className="tst-dynamic-banner">
        <PageBanner
          pageTitle={banner.pageTitle}
          description={banner.description}
          breadTitle={banner.breadTitle}
        />
      </div>

      <div id="tst-dynamic-content" className="tst-dynamic-content">
        <div className="tst-content-frame">
          <div className="tst-content-box">
            <div className="container tst-p-60-60">
              <div className="row">
                <div className="col-lg-10 offset-lg-1">
                  <h3 className="tst-mb-30">{sections.general.title}</h3>
                  {sections.general.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="tst-text tst-mb-15">
                      {paragraph}
                    </p>
                  ))}

                  <h4 className="tst-mb-15">{sections.reservationRequest.title}</h4>
                  <ul className="tst-text tst-mb-30">
                    {sections.reservationRequest.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <h3 className="tst-mb-30">{sections.personalData.title}</h3>
                  {sections.personalData.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="tst-text tst-mb-15">
                      {paragraph}
                    </p>
                  ))}

                  <h4 className="tst-mb-15">{sections.dataController.title}</h4>
                  {sections.dataController.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="tst-text tst-mb-30">
                      {paragraph}
                    </p>
                  ))}

                  <h4 className="tst-mb-15">{sections.collectedData.title}</h4>
                  <ul className="tst-text tst-mb-30">
                    {sections.collectedData.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <h4 className="tst-mb-15">{sections.ipAddress.title}</h4>
                  {sections.ipAddress.paragraphs.map((paragraph, index) => (
                    <p key={paragraph} className={`tst-text ${index === sections.ipAddress.paragraphs.length - 1 ? "tst-mb-30" : "tst-mb-15"}`}>
                      {paragraph}
                    </p>
                  ))}

                  <h4 className="tst-mb-15">{sections.usage.title}</h4>
                  <ul className="tst-text tst-mb-30">
                    {sections.usage.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <h4 className="tst-mb-15">{sections.legalBasis.title}</h4>
                  {sections.legalBasis.paragraphs.map((paragraph, index) => (
                    <p key={paragraph} className={`tst-text ${index === sections.legalBasis.paragraphs.length - 1 ? "tst-mb-30" : "tst-mb-15"}`}>
                      {paragraph}
                    </p>
                  ))}

                  <h4 className="tst-mb-15">{sections.retention.title}</h4>
                  {sections.retention.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="tst-text tst-mb-30">
                      {paragraph}
                    </p>
                  ))}

                  <h4 className="tst-mb-15">{sections.processors.title}</h4>
                  {sections.processors.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="tst-text tst-mb-30">
                      {paragraph}
                    </p>
                  ))}

                  <h4 className="tst-mb-15">{sections.rights.title}</h4>
                  <ul className="tst-text tst-mb-30">
                    {sections.rights.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <p className="tst-text tst-mb-30">{sections.complaint}</p>

                  <h4 className="tst-mb-15">{sections.contact.title}</h4>
                  <p className="tst-text tst-mb-0">{sections.contact.lead}</p>
                  <ul className="tst-text">
                    {sections.contact.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <div className="tst-spacer tst-white"></div>
                  <p className="tst-text" style={{ opacity: 0.8 }}>
                    {content.updated}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
