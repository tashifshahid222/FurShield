import { useState } from 'react';
import Icon from '../Icon';

export const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search…',
  label = 'Search',
  className = '',
  debounceMs = 0,
}) => {
  const [inner, setInner] = useState(value || '');

  const commit = (next) => {
    setInner(next);
    if (debounceMs > 0) {
      clearTimeout(commit._t);
      commit._t = setTimeout(() => onChange?.(next), debounceMs);
    } else {
      onChange?.(next);
    }
  };

  return (
    <form
      className={`search-bar ${className}`.trim()}
      role="search"
      aria-label={label}
      onSubmit={(e) => {
        e.preventDefault();
        onSearch?.(inner);
      }}
    >
      <div className="input-wrap" style={{ flex: 1 }}>
        <span className="input-icon-left">
          <Icon name="search" size={17} />
        </span>
        <input
          type="search"
          className="form-control"
          value={inner}
          placeholder={placeholder}
          aria-label={label}
          onChange={(e) => commit(e.target.value)}
        />
        {inner && (
          <button
            type="button"
            className="input-clear"
            aria-label="Clear search"
            onClick={() => commit('')}
          >
            <Icon name="x" size={14} />
          </button>
        )}
      </div>
      <button type="submit" className="btn btn-primary">
        <Icon name="search" size={16} />
        Search
      </button>
    </form>
  );
};

export default SearchBar;