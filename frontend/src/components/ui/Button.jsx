import Icon from '../Icon';

const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  outline: 'btn-outline',
  'outline-teal': 'btn-outline-teal',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  success: 'btn-success',
  warning: 'btn-warning',
};

const SIZES = { sm: 'btn-sm', md: '', lg: 'btn-lg' };

export const Button = ({
  variant = 'primary',
  size = 'md',
  icon,
  rightIcon,
  loading = false,
  block = false,
  className = '',
  children,
  href,
  type = 'button',
  ...rest
}) => {
  const cls = ['btn', VARIANTS[variant] || VARIANTS.primary, SIZES[size] || '', block ? 'btn-block' : '', className]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {loading ? (
        <span className="spinner-sm" aria-hidden="true" />
      ) : icon ? (
        <Icon name={icon} size={16} />
      ) : null}
      <span>{children}</span>
      {rightIcon && !loading ? <Icon name={rightIcon} size={16} /> : null}
    </>
  );

  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} className={cls} disabled={loading || rest.disabled} aria-busy={loading ? 'true' : undefined} {...rest}>
      {content}
    </button>
  );
};

export default Button;