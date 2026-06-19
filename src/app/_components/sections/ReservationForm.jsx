import { getTranslations } from "next-intl/server";
import ReservationForm from "@components/forms/ReservationForm";

const ReservationSection = async () => {
    const t = await getTranslations("reservation");
    return (
        <>
            <div className="row">

              <div className="col-lg-12">

                {/* title */}
                <div className="text-center">
                  <div className="tst-suptitle tst-suptitle-center tst-mb-15">{t("subtitle")}</div>
                  <h3 className="tst-mb-30" dangerouslySetInnerHTML={{__html : t.raw("title")}} />
                  <p className="tst-text tst-mb-60">{t("description")}</p>
                </div>
                {/* title end */}

              </div>

              <div className="col-lg-12">

                <div className="text-center">
                  <ReservationForm />
                </div>

              </div>
            </div>
        </>
    );
};

export default ReservationSection;