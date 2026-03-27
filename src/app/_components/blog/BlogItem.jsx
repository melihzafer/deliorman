import Image from "next/image";
import Link from "next/link";
import Date from '@library/date';

const BlogItem = ({ item, popular }) => {
  return (
    <>
      {/* blog card */}
      <div className="tst-blog-card tst-mb-60">
        <Link href={`/blog/${item.id}`} className="tst-cover-frame tst-anima-link">
          <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{ objectFit: 'cover' }} />
          {popular == 1 ? (
          <div className="tst-card-badge tst-auxiliary-color-1">Popular</div>
          ) : (
          <div className="tst-card-badge" style={{"backgroundColor": item.badgeColor}}>{item.categories[0]}</div>
          )}
        </Link>
        <div className="tst-descr">
          <h5 className="tst-mb-15"><a href={`/blog/${item.id}`} className="tst-anima-link">{item.title}</a></h5>
          <div className="tst-text">{item.short}</div>
          <div className="tst-spacer-sm"></div>
          <div className="tst-post-bottom">
            <div className="tst-post-author">
              <Image src={item.authorAvatar} alt={item.author} width={40} height={40} /> 
              <h6>{item.author}</h6>
            </div>
            <div className="tst-date"><Date dateString={item.date} /></div>
          </div>
        </div>
      </div>
      {/* blog card end */}
    </>
  );
};
export default BlogItem;