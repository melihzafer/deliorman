import Data from "@data/sections/features.json";

const FeaturesOneSection = () => {
  return (
    <>
        {/* features */}
        <div className="row">

            <div className="col-lg-12">
                {/* title */}
                <div className="text-center">
                    <div className="tst-suptitle tst-suptitle-center tst-mb-15" dangerouslySetInnerHTML={{__html : Data.subtitle}} />
                    <h3 className="tst-mb-30" dangerouslySetInnerHTML={{__html : Data.title}} />
                    <p className="tst-text tst-mb-60" dangerouslySetInnerHTML={{__html : Data.description}} />
                </div>
                {/* title end */}
            </div>
            
            {Data.items.map((item, key) => (
            <div className="col-lg-4" key={`features-item-${key}`}>
                {/* icon box */}
                <div className="tst-icon-box tst-mb-60">
                    <img src={item.icon} alt="icon" className="tst-mb-30" />
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