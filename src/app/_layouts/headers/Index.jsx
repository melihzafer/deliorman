import HeaderLayoutDefault from "./LayoutDefault";

const Header = ({ layout }) => {
  switch (layout) {
    case 1:
      return;

    case 2:
      return;

    default:
      return (
        <HeaderLayoutDefault />
      );
  }
};
export default Header;
