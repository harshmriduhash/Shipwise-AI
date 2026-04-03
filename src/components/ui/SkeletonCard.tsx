const SkeletonCard = () => (
  <div className="glass rounded-xl p-5 space-y-4 overflow-hidden relative">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-muted rounded-full w-3/4 animate-pulse" />
        <div className="h-2 bg-muted rounded-full w-1/2 animate-pulse" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-2 bg-muted rounded-full w-full animate-pulse" />
      <div className="h-2 bg-muted rounded-full w-5/6 animate-pulse" />
    </div>
    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-muted/30 to-transparent animate-shimmer" />
  </div>
);

export const SkeletonList = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="glass rounded-xl p-4 flex items-center gap-4 overflow-hidden relative">
        <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-muted rounded-full w-2/3 animate-pulse" />
          <div className="h-2 bg-muted rounded-full w-1/3 animate-pulse" />
        </div>
        <div className="w-16 h-6 rounded-full bg-muted animate-pulse" />
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-muted/30 to-transparent animate-shimmer" style={{ animationDelay: `${i * 0.3}s` }} />
      </div>
    ))}
  </div>
);

export default SkeletonCard;
