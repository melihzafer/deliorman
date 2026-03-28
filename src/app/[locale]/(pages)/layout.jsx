import dynamic from 'next/dynamic';
import Header from "@layouts/headers/Index";
import ScrollAnimationInit from "@components/ScrollAnimationInit";
import PageTransition from "@components/common/PageTransition";
import ScrollToTop from "@components/common/ScrollToTop";

// Lazy load footer since it's below the fold
const Footer = dynamic(() => import("@layouts/footers/Index"), {
  ssr: true, // Still render on server for SEO
});

const PagesLayouts = ({
  children
}) => {
  return (
    <>
      <ScrollToTop />
      <ScrollAnimationInit />
      <Header layout={"default"} />

      {/* dynamic content */}
      <PageTransition>
        {children}
      </PageTransition>
      {/* dynamic content end */}
      
      <Footer layout={"default"} />
    </>
  );
};
export default PagesLayouts;
