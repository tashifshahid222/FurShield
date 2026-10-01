export const Pagination = ({ page = 1, pages = 1, onPageChange }) => {
  if (pages <= 1) return null;

  const items = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(pages, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);

  for (let i = start; i <= end; i++) {
    items.push(
      <button
        key={i}
        className={`page-btn ${i === page ? 'active' : ''}`}
        onClick={() => onPageChange(i)}
        disabled={i === page}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="pagination">
      <button
        className="page-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        ‹
      </button>
      {start > 1 && (
        <>
          <button className="page-btn" onClick={() => onPageChange(1)}>1</button>
          {start > 2 && <span className="text-muted">…</span>}
        </>
      )}
      {items}
      {end < pages && (
        <>
          {end < pages - 1 && <span className="text-muted">…</span>}
          <button className="page-btn" onClick={() => onPageChange(pages)}>{pages}</button>
        </>
      )}
      <button
        className="page-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pages}
        aria-label="Next page"
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;