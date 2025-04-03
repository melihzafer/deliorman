import Header from "@layouts/headers/Index";
import Footer from "@layouts/footers/Index";

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
