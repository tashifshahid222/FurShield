const MAX_STARS = 5;

export const RatingStars = ({ rating = 0, count = null, size = 16 }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  return (
    <span className="rating-stars" style={{ fontSize: `${size}px` }} aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: MAX_STARS }).map((_, i) => {
        let content = '☆';
        if (i < full) content = '★';
        else if (i === full && half) content = '★';
        return <span key={i}>{content}</span>;
      })}
      {count !== null && <span className="rating-value"> ({count})</span>}
    </span>
  );
};

export default RatingStars;