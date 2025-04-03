import FooterLayoutDefault from "./LayoutDefault";

const Footer = ({ layout }) => {
  switch (layout) {
    case 1:
      return;
    case 2:
      return;
    default:
      return <FooterLayoutDefault />;
  }
};
export default Footer;
