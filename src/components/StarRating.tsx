interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ rating, max = 5, size = 'md' }: StarRatingProps) {
  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <span
      className={`inline-flex items-center gap-0.5 ${sizeClass}`}
      aria-label={`${rating} out of ${max} stars`}
    >
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <span
            key={i}
            className={filled ? 'star-filled' : half ? 'star-filled opacity-40' : 'star-empty'}
          >
            ★
          </span>
        );
      })}
      <span className="ml-1 text-xs font-mono text-cyber-muted">{rating.toFixed(1)}</span>
    </span>
  );
}
