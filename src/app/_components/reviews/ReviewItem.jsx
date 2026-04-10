import Image from "next/image";

const ReviewItem = ({ item, index }) => {
  const stars = [ '', '', '', '', '' ];
    
  return (
    <>
      <div className="tst-testimonial-card">
        <div className="tst-quote">"</div>
        <h5 className="tst-mb-30" dangerouslySetInnerHTML={{__html : item.title}} />
        <ul className="tst-stars">
            {stars.slice(0, item.rating).map((star_item, star_key) => (
            <li key={`testimonial-item-${index}-rating-star-${star_key}`}><i className="fas fa-star"></i></li>
            ))}
        </ul>
        <p className="tst-text" dangerouslySetInnerHTML={{__html : item.text}} />
        <div className="tst-spacer-sm"></div>
        <div className="tst-testimonial-bottom">
          <div className="tst-visitor">
            <div style={{ position: "relative", width: 60, height: 60, borderRadius: "50%", overflow: "hidden" }}>
              <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
            </div>
            <h6>{item.name}</h6>
          </div>
          <div className="tst-date">{item.date}</div>
        </div>
      </div>
    </>
  );
};
export default ReviewItem;
