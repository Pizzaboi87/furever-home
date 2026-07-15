type PageLoadingSkeletonProps = {
  variant?: 'public' | 'admin'
}

const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`skeleton-shimmer rounded-xl bg-input ${className}`} aria-hidden="true" />
)

export default function PageLoadingSkeleton({ variant = 'public' }: PageLoadingSkeletonProps) {
  if (variant === 'admin') {
    return (
      <main className="min-h-screen bg-background" aria-busy="true" aria-label="Loading admin page">
        <div className="border-b border-border bg-white">
          <div className="mx-auto max-w-screen-2xl px-4 py-5 sm:px-6 lg:px-8">
            <SkeletonBlock className="h-7 w-56" />
            <SkeletonBlock className="mt-3 h-4 w-80 max-w-full" />
          </div>
        </div>
        <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <SkeletonBlock key={index} className="h-28" />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <SkeletonBlock className="h-200" />
            <SkeletonBlock className="h-200" />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background" aria-busy="true" aria-label="Loading page">
      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        <SkeletonBlock className="h-10 w-72 max-w-full" />
        <SkeletonBlock className="mt-4 h-5 w-md max-w-full" />
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <SkeletonBlock className="h-64 rounded-none" />
              <div className="space-y-3 p-5">
                <SkeletonBlock className="h-6 w-2/3" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
