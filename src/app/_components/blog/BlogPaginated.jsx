import BlogItem from "@components/blog/BlogItem";

const PaginatedBlogPosts = ({ items, columns }) => {
  var columnsClass = '';
  
  switch (columns) {
      case 2:
          columnsClass = 'col-lg-6';
      break;
      default:
          columnsClass = 'col-lg-4';
  }

  return (
    <div className="row">
      {items.map((item, key) => (
      <div className={`${columnsClass}`} key={`blog-post-${key}`}>
        <BlogItem item={item} />
      </div>
      ))}
    </div>
  );
};
export default PaginatedBlogPosts;
  