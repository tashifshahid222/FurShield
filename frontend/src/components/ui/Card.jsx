export const Card = ({ hover = false, padded = false, className = '', children, ...rest }) => {
  const cls = ['card', hover ? 'card-hover' : '', padded ? 'card-padded' : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
};

export const CardHeader = ({ title, action = null, children, className = '' }) => (
  <div className={`card-header ${className}`.trim()}>
    {title ? <h3 className="card-title">{title}</h3> : children}
    {action}
  </div>
);

export const CardBody = ({ children, className = '' }) => <div className={`card-body ${className}`.trim()}>{children}</div>;

export const CardFooter = ({ children, className = '' }) => <div className={`card-footer ${className}`.trim()}>{children}</div>;

export default Card;