import { Skeleton, SkeletonCard, SkeletonText } from './ui/Skeleton';

export const Loading = ({ text = 'Loading...', variant = 'spinner', count = 3, skeleton = 'grid' }) => {
  if (variant === 'skeleton') {
    if (skeleton === 'card') {
      return (
        <div className="grid grid-3" aria-hidden="true">
          {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }
    if (skeleton === 'text') {
      return (
        <div className="card card-padded" style={{ maxWidth: 560 }}>
          <SkeletonText lines={4} />
        </div>
      );
    }
    return (
      <div role="status" aria-label={text} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Skeleton height={180} />
        <SkeletonText lines={3} />
      </div>
    );
  }

  return (
    <div className="loader-wrap" role="status" aria-label={text}>
      <div className="spinner" aria-hidden="true" />
      <p>{text}</p>
    </div>
  );
};

export default Loading;