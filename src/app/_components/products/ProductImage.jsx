"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const ProductImage = ({ src, alt, badge }) => {
  const [img, setImg] = useState(false);
  const [imgValue, setImgValue] = useState([]);

  return (
    <>   
      <div className="tst-gallery-item tst-gallery-square tst-mb-90">
        <img src={src} alt={alt} />

        {/* button */}
        <a data-fancybox="menu" data-no-swup href={src} className="tst-btn tst-btn-2 tst-btn-icon tst-btn-gray tst-zoom" onClick={ (e) => { e.preventDefault(); setImg(true); setImgValue( [{ "src": src, "alt": alt }] ); }}>
            <span className="tst-icon">
                <img src="/img/ui/icons/zoom.svg" alt="icon" />
            </span>
        </a>
        {/* button end */}

        <Lightbox
            open={img}
            close={() => setImg(false)}
            slides={imgValue}
            styles={{ container: { backgroundColor: "rgba(38, 31, 65, .85)" } }}
            render={{
                buttonPrev: imgValue.length <= 1 ? () => null : undefined,
                buttonNext: imgValue.length <= 1 ? () => null : undefined,
            }}
        />

        <div dangerouslySetInnerHTML={{__html : badge}} />
      </div>
    </>
  );
};
export default ProductImage;
