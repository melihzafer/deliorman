import Data from "@data/sections/contact-info.json";

const ContactInfoSection = () => {
  return (
    <>
        {/* contact info */}
        <div className="row" id="contact">
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
            <div className="col-lg-4" key={`contact-info-item-${key}`}>

            {/* icon box */}
            <div className="tst-icon-box tst-mb-60">
                <img src={item.icon} alt={item.title} className="tst-mb-30" />
                <h5 className="tst-mb-30">{item.title}</h5>
                <div className="tst-text" dangerouslySetInnerHTML={{__html : item.text}} />
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