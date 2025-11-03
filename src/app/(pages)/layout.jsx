import dynamic from 'next/dynamic';
import Header from "@layouts/headers/Index";

// Lazy load footer since it's below the fold
const Footer = dynamic(() => import("@layouts/footers/Index"), {
  ssr: true, // Still render on server for SEO
});

const PagesLayouts = ({
  children
}) => {
  return (
    <>
      <Header layout={"default"} />

      {/* dynamic content */}
      {children} 
      {/* dynamic content end */}
      
      <Footer layout={"default"} />
    </>
  );
};
export default PagesLayouts;
