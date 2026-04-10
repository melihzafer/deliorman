import Image from "next/image";
import Data from "@data/sections/promo-video.json";

const PromoVideoSection = () => {

  return (
    <>
        {/* video */}
        <div className="row">

            <div className="col-lg-12">

            {/* about video */}
            <div className="tst-about-cover tst-video-cover tst-mb-60">
                <Image src={Data.image.url} alt={Data.image.alt} fill className="tst-cover animateme" />
                {/* <div className="tst-overlay"></div>
                <div className="tst-btn-animation"></div>
                <a className="tst-play-button" data-fancybox onClick={() => setOpen(true)} style={{ "cursor" : "pointer" }} data-width="1000" data-height="600">
                    <i className="fas fa-play"></i>
                </a> */}
            </div>
            {/* about video end */}

            </div>

            {/* <ModalVideo channel='custom' isOpen={isOpen} videoId={Data.video.link.replace("https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F574305161867774%2F&show_text=false&width=267&t=0", "")} onClose={() => setOpen(false)} /> */}
        </div>
        {/* video end */}
    </>
  );
};

export default PromoVideoSection;