import Image from "next/image";
import { getLocalizedTeamData } from "@data/sections/team/getLocalizedTeamData";
import { useLocale } from "next-intl";
import { useMemo } from "react";

const TeamSection = ( { items } ) => {
  const locale = useLocale();
  const localizedData = useMemo(() => getLocalizedTeamData(locale), [locale]);

  return (
    <>
        {/* team */}
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

            {localizedData.items.slice(0, items).map((item, key) => (
            <div className="col-lg-4" key={`teams-item-${key}`}>

                {/* team member */}
                <div className="tst-team-member">
                    <div className="tst-member-portrait-frame tst-anima-link">
                        <div style={{ position: "relative", width: "100%", aspectRatio: "1", overflow: "hidden" }}>
                          <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                        </div>
                    </div>
                    <div className="tst-member-descr">
                        <h5 className="tst-mb-15">{item.name}</h5>
                        <div className="tst-text">{item.role}</div>
                        <div className="tst-spacer-sm"></div>
                        <div className="tst-member-social">
                            {item.social.map((social_item, social_key) => (
                            <a href={social_item.url} className="tst-icon-link" key={`team-item-${key}-social-${social_key}`} title={social_item.title}><i className={social_item.icon}></i></a>
                            ))}
                        </div>
                    </div>
                </div>
                {/* team member end */}

            </div>
            ))}
        </div>
        {/* team end */}
    </>
  );
};
export default TeamSection;