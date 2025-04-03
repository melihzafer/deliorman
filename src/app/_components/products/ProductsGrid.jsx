"use client";

import ProductItem from "@components/products/ProductItem";

const ProductsGrid = ({ items, columns }) => {
  var columnsClass = '';
  var moreType = '';
  
  switch (columns) {
    case 3:
      columnsClass = 'col-lg-4';
      moreType = 2;
      break;
    case 2:
      columnsClass = 'col-lg-6';
      moreType = 2;
      break;
    default:
      columnsClass = 'col-lg-4';
      moreType = 1;
  }

  return (
    <>
      <div className="row">
        {items.map((item, key) => (
        <div className={columnsClass} key={`products-grid-item-${key}`}>
          <ProductItem item={item} index={key} marginBottom={30} moreType={moreType} />
        </div>
        ))}
      </div>
    </>
  );
};
export default ProductsGrid;
  