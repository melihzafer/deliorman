"use client";

import Image from "next/image";
import { memo, useState, useCallback, useMemo } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const MenuItem2 = memo(function MenuItem2({ item }) {
  const [img, setImg] = useState(false);
  const slides = useMemo(() => [{ src: item.image, alt: item.title }], [item.image, item.title]);

  const handleImageClick = useCallback((e) => {
    e.preventDefault();
    setImg(true);
  }, []);

  return (
    <>
      <div className="tst-menu-book-item tst-mbi-3" data-swiper-parallax-y="60" data-swiper-parallax-opacity="0" data-swiper-parallax-duration="1000">
        {item.image && (
          <a href={item.image} data-fancybox="menu" className="tst-item-cover-frame tst-cursor-zoom" onClick={handleImageClick}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "3/2" }}>
              <Image src={item.image} alt={item.title} fill style={{ objectFit: "cover" }} />
            </div>
            <span className="tst-overlay"></span>
          </a>
        )}
        <div className="tst-menu-book-descr">
          <div className="tst-menu-book-name" style={{ maxWidth: "100%" }}>
            <h5 className="tst-mb-15">{item.title}</h5>
            <div className="tst-text" dangerouslySetInnerHTML={{ __html: item.text }} />
            <div className="tst-spacer-sm"></div>
          </div>
          <div className="tst-menu-book-bottom">
            <div className="tst-menu-book-price">
              <div className="tst-price"><span className="tst-symbol">€</span>{Number(item.price).toFixed(2)}</div>
              <div className="tst-weight">{item.amount}</div>
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        open={img}
        close={() => setImg(false)}
        slides={slides}
        styles={{ container: { backgroundColor: "rgba(26, 47, 51, .85)" } }}
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  );
});
export default MenuItem2;