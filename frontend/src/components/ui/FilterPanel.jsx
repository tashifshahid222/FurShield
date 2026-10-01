import { useState } from 'react';
import Icon from '../Icon';

export const FilterPanel = ({
  title = 'Filters',
  onApply = null,
  onReset = null,
  children,
  defaultOpen = true,
  icon = 'filter',
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filter-panel" aria-label={title}>
      <div className="filter-panel-header">
        <button
          type="button"
          className="filter-panel-title"
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <Icon name={icon} size={16} />
          <span>{title}</span>
        </button>
        <div className="flex" style={{ gap: 8 }}>
          {onReset ? (
            <button type="button" className="btn-text" onClick={onReset}>
              Reset
            </button>
          ) : null}
          <button
            type="button"
            aria-label={open ? 'Collapse filters' : 'Expand filters'}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex' }}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} />
          </button>
        </div>
      </div>
      {open && (
        <>
          <div className="filter-row">{children}</div>
          {onApply ? (
            <div className="mt-2 flex justify-between wrap" style={{ gap: 10 }}>
              <span />
              <button type="button" className="btn btn-primary btn-sm" onClick={onApply}>
                <Icon name="check" size={14} />
                Apply filters
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};

export default FilterPanel;