"use client";

import MenuItem from "@components/menu/MenuItem";

const MenuGrid = ({ categories, columns = 2 }) => {
  var columnsClass = '';
  
  switch (columns) {
    case 3:
      columnsClass = 'col-lg-4';
      break;
    case 2:
      columnsClass = 'col-lg-6';
      break;
    default:
      columnsClass = 'col-lg-3';
  }

  return (
    <>
      {categories.map((category, category_key) => (
      <div key={`menu-category-item-${category_key}`}>
        <div className="row">
          <div className="col-lg-12">
            {/* title */}
            <div className="text-center">
              <div className="tst-suptitle tst-suptitle-center tst-mb-15">{category.subtitle}</div>
              <h3 className="tst-mb-30" dangerouslySetInnerHTML={{__html : category.name}} />
              <p className="tst-text tst-mb-60" dangerouslySetInnerHTML={{__html : category.description}} />
            </div>
            {/* title end */}
          </div>

          {category.items.map((item, key) => (
          <div className={columnsClass} key={`menu-grid-item-${key}`}>
              <MenuItem item={item} />
          </div>
          ))}
        </div>

        {(categories.length-1 > category_key) &&
        <div className="tst-spacer tst-spacer-only-bottom-space"></div>
        }
      </div>
      ))}
    </>
  );
};
export default MenuGrid;
  