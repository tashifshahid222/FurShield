import Icon from '../Icon';

export const Tabs = ({ tabs = [], active, onChange, className = '', buttonClassName = '' }) => (
  <div className={`tabs ${className}`.trim()} role="tablist" aria-label="Tabs">
    {tabs.map((t) => {
      const isActive = active === t.id;
      return (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          className={`tab ${buttonClassName} ${isActive ? 'active' : ''}`.trim()}
          onClick={() => onChange?.(t.id)}
        >
          {t.icon ? <Icon name={t.icon} size={16} /> : null}
          {t.label}
          {typeof t.count === 'number' ? <span className="text-caption">({t.count})</span> : null}
        </button>
      );
    })}
  </div>
);

export default Tabs;