import Link from "next/link";

const ServiceItem = ({ content, button, image, rowReverse = 0 }) => {    
  return (
    <>
      <div className={rowReverse ? "row align-items-center flex-sm-row-reverse" : "row align-items-center"}>

        <div className="col-lg-6">

          {/* service text */}
          <div className="tst-mb-60">
            <div className="tst-suptitle tst-mb-15" dangerouslySetInnerHTML={{__html : content.subtitle}} />
            <h3 className="tst-mb-30" dangerouslySetInnerHTML={{__html : content.title}} />
            <div className="tst-text tst-mb-30" dangerouslySetInnerHTML={{__html : content.description}} />

            <Link href={button.link} className="tst-btn tst-anima-link tst-mr-30">{button.label}</Link>
          </div>
          {/* service text end */}

        </div>

        <div className="col-lg-6">

          {/* service img */}
          <div className="tst-about-cover tst-mb-60">
            <img src={image.url} alt={image.alt} className="tst-cover" />
          </div>
          {/* service img end */}

        </div>

      </div>
    </>
  );
};
export default ServiceItem;
