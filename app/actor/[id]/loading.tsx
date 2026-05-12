export default function Loading() {
  return (
    <main className="min-h-full bg-zinc-50 dark:bg-black px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Back link skeleton */}
        <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded mb-8 animate-pulse" />

        {/* Actor header skeleton */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0 animate-pulse" />
          <div className="flex flex-col gap-2">
            <div className="h-7 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>

        {/* Movie grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 20 }, (_, i) => `skeleton-${i}`).map((key) => (
            <div
              key={key}
              className="flex flex-col bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm border border-zinc-100 dark:border-zinc-800"
            >
              <div className="w-full aspect-[2/3] bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              <div className="p-3 flex flex-col gap-2">
                <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-3 w-12 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
