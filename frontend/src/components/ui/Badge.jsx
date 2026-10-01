import Icon from '../Icon';

const VARIANT_MAP = {
  success: 'badge-success',
  danger: 'badge-danger',
  warning: 'badge-warning',
  info: 'badge-info',
  neutral: 'badge-neutral',
  primary: 'badge-primary',
  accent: 'badge-accent',
  teal: 'badge-teal',
};

export const Badge = ({ variant = 'neutral', icon, dot = false, children, className = '' }) => (
  <span className={`badge ${VARIANT_MAP[variant] || VARIANT_MAP.neutral} ${className}`.trim()}>
    {dot ? <span className="badge-dot" aria-hidden="true" /> : null}
    {icon && !dot ? <Icon name={icon} size={12} /> : null}
    {children}
  </span>
);

export default Badge;