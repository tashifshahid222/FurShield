import { Link } from 'react-router-dom';
import Icon from '../Icon';

export const Breadcrumb = ({ items = [], home = true, className = '' }) => (
  <nav className={`breadcrumbs ${className}`.trim()} aria-label="Breadcrumb">
    {home && (
      <>
        <Link to="/" aria-label="Home" className="flex items-center">
          <Icon name="home" size={15} />
        </Link>
        <span className="crumb-sep" aria-hidden="true">
          <Icon name="chevron-right" size={14} />
        </span>
      </>
    )}
    {items.map((item, i) => {
      const isLast = i === items.length - 1;
      return (
        <span key={i} className="flex items-center">
          {item.to && !isLast ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span aria-current="page" className="crumb-current">
              {item.label}
            </span>
          )}
          {!isLast && (
            <span className="crumb-sep" aria-hidden="true">
              <Icon name="chevron-right" size={14} />
            </span>
          )}
        </span>
      );
    })}
  </nav>
);

export default Breadcrumb;