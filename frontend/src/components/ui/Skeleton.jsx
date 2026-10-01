export const Skeleton = ({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
  style,
  ...rest
}) => {
  const base = {
    text: { height: 14 },
    circle: { width: 44, height: 44, borderRadius: '50%' },
    rect: { height: 120 },
  }[variant] || { height: 14 };

  return (
    <span
      className={`skeleton ${variant === 'circle' ? 'skeleton-circle' : variant === 'text' ? 'skeleton-line' : ''} ${className}`.trim()}
      style={{ display: 'block', width: width || '100%', height: height || base.height, ...(variant !== 'circle' ? { borderRadius: base.borderRadius } : {}), ...style }}
      aria-hidden="true"
      data-testid="skeleton"
      {...rest}
    />
  );
};

export const SkeletonText = ({ lines = 3, firstWidth = '40%', gap = 10, className = '' }) => (
  <div className={className} style={{ display: 'flex', flexDirection: 'column', gap }}>
    <Skeleton width={firstWidth} height={16} />
    {Array.from({ length: lines - 1 }).map((_, i) => (
      <Skeleton key={i} height={13} />
    ))}
  </div>
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={`card card-padded ${className}`.trim()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
    <Skeleton variant="rect" height={140} />
    <SkeletonText lines={2} firstWidth="60%" />
    <Skeleton width={90} height={34} />
  </div>
);

export default Skeleton;