import Icon, { iconNames } from './Icon';

export const EmptyState = ({ title = 'Nothing here yet', message = '', action = null, icon = 'box' }) => {
  const isGlyph = typeof icon === 'string' && icon.length <= 4 && !iconNames.includes(icon);
  return (
    <div className="empty-state">
      <div className="empty-icon">
        {isGlyph ? icon : <Icon name={icon} size={40} />}
      </div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;