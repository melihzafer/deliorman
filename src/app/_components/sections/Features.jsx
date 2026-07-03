import Image from "next/image";
import { getLocalizedFeaturesData } from "@data/sections/features/getLocalizedFeaturesData";
import { useTranslations, useLocale } from "next-intl";
import { useMemo } from "react";

const FeaturesOneSection = () => {
  const locale = useLocale();
  const localizedData = useMemo(() => getLocalizedFeaturesData(locale), [locale]);

  return (
    <>
        {/* features */}
        <div className="row">

            <div className="col-lg-12">
                {/* title */}
                <div className="text-center">
                    <div className="tst-suptitle tst-suptitle-center tst-mb-15" dangerouslySetInnerHTML={{__html : localizedData.subtitle}} />
                    <h3 className="tst-mb-30" dangerouslySetInnerHTML={{__html : localizedData.title}} />
                    <p className="tst-text tst-mb-60" dangerouslySetInnerHTML={{__html : localizedData.description}} />
                </div>
                {/* title end */}
            </div>
            
            {localizedData.items.map((item, key) => (
            <div className="col-lg-4" key={`features-item-${key}`}>
                {/* icon box */}
                <div className="tst-icon-box tst-mb-60">
                    <Image src={item.icon} alt={item.title} width={60} height={60} className="tst-mb-30" />
                    <h5 className="tst-mb-30">{item.title}</h5>
                    <div className="tst-text" dangerouslySetInnerHTML={{__html : item.text}} />
                </div>
                {/* icon box end */}
            </div>
            ))}

        </div>
        {/* features end */}
    </>
  );
};

export default FeaturesOneSection;
