import Image from "next/image";
import Data from "@data/sections/awards.json";

const AwardsSection = () => {
  return (
    <>
        {/* awards */}
        <div className="row justify-content-center">
            {Data.items.map((item, key) => (
            <div className="col-6 col-lg-2" key={`awards-item-${key}`}>
                <div className="tst-awards">
                    <Image src={item.icon} alt={item.title} width={80} height={80} />
                    <div className="tst-label">{item.title}</div>
                </div>
            </div>
            ))}
        </div>
        {/* awards end */}
    </>
  );
};

export default AwardsSection;