import { getInitials } from '../../utils/helpers';

const SIZE_MAP = { sm: 'avatar-sm', md: 'avatar-md', lg: 'avatar-lg' };

export const Avatar = ({ src, name = '', size = 'md', shape = 'round', className = '', ...rest }) => {
  const cls = `avatar ${SIZE_MAP[size] || 'avatar-md'} ${className}`.trim();
  return (
    <span
      className={cls}
      style={{ borderRadius: shape === 'square' ? 'var(--radius-sm)' : '50%' }}
      aria-label={name || 'avatar'}
      {...rest}
    >
      {src ? <img src={src} alt={name || ''} /> : getInitials(name) || '?'}
    </span>
  );
};

export const AvatarStack = ({ items = [], max = 4, size = 'md', className = '' }) => (
  <div className={`avatar-stack ${className}`.trim()}>
    {items.slice(0, max).map((a, i) => (
      <Avatar key={i} src={a.src} name={a.name} size={size} />
    ))}
    {items.length > max ? (
      <span className={`avatar ${SIZE_MAP[size] || 'avatar-md'}`}>+{items.length - max}</span>
    ) : null}
  </div>
);

export default Avatar;