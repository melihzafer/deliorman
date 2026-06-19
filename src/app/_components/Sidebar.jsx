import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import SearchBarModule from '@components/SearchBar';

async function Sidebar() {
  const t = await getTranslations("searchPage");

  return (
    <>
        {/* sidebar */}
        <div className="tst-sidebar">
            <div className="tst-ib-title-frame tst-mb-30">
                <h4>{t("searchSectionTitle")}</h4>
                <i className="fas fa-arrow-down" />
            </div>
            <Suspense fallback={<div>{t("loading")}</div>}>
                <SearchBarModule />
            </Suspense>
        </div>
        {/* sidebar end */}
    </>
  );
};
export default Sidebar;
