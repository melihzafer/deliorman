import Image from "next/image";
import Data from "@data/sections/features.json";
import { useTranslations } from "next-intl";

const FeaturesOneSection = () => {
  const t = useTranslations("aboutSections");
  const content = t.raw("features");

  return (
    <>
        {/* features */}
        <div className="row">

            <div className="col-lg-12">
                {/* title */}
                <div className="text-center">
                    <div className="tst-suptitle tst-suptitle-center tst-mb-15" dangerouslySetInnerHTML={{__html : content.subtitle}} />
                    <h3 className="tst-mb-30" dangerouslySetInnerHTML={{__html : content.title}} />
                    <p className="tst-text tst-mb-60" dangerouslySetInnerHTML={{__html : content.description}} />
                </div>
                {/* title end */}
            </div>
            
            {Data.items.map((item, key) => (
            <div className="col-lg-4" key={`features-item-${key}`}>
                {/* icon box */}
                <div className="tst-icon-box tst-mb-60">
                    <Image src={item.icon} alt={content.items[key]?.title || item.title} width={60} height={60} className="tst-mb-30" />
                    <h5 className="tst-mb-30">{content.items[key]?.title || item.title}</h5>
                    <div className="tst-text" dangerouslySetInnerHTML={{__html : content.items[key]?.text || item.text}} />
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
