export const Skeleton = ({ className = '', ...props }) => (
  <div className={`skeleton ${className}`} aria-hidden="true" {...props} />
)

export const SkeletonCard = () => (
  <div className="surface space-y-4 p-5">
    <div className="flex items-center justify-between gap-4">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-9 w-9 rounded-xl" />
    </div>
    <Skeleton className="h-8 w-24" />
    <Skeleton className="h-3 w-2/3" />
  </div>
)

export const SkeletonList = ({ count = 4 }) => (
  <div className="surface divide-y divide-ink-100 overflow-hidden">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="flex items-center gap-3 p-4">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    ))}
  </div>
)
