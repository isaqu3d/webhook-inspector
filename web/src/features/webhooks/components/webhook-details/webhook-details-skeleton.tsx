export function WebhookDetailsSkeleton() {
  return (
    <div className="flex h-full flex-col">
      {/* Header Skeleton */}
      <div className="border-b border-zinc-700 bg-zinc-800/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-5 w-16 bg-zinc-700/50 rounded animate-pulse" />
            <div className="h-5 w-48 bg-zinc-700/50 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-4 w-24 bg-zinc-700/50 rounded animate-pulse" />
            <div className="h-4 w-32 bg-zinc-700/50 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 overflow-auto">
        <div className="space-y-6 p-6">
          {/* Request Overview Section */}
          <div className="space-y-4">
            <div className="h-5 w-32 bg-zinc-700/50 rounded animate-pulse" />
            <div className="overflow-hidden rounded-lg border border-zinc-700">
              <div className="space-y-px">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex">
                    <div className="w-1/3 p-3 bg-zinc-800/50 border-r border-zinc-700">
                      <div className="h-4 bg-zinc-700/50 rounded animate-pulse" style={{ width: '60%' }} />
                    </div>
                    <div className="flex-1 p-3">
                      <div className="h-4 bg-zinc-700/50 rounded animate-pulse" style={{ width: '40%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Headers Section */}
          <div className="space-y-4">
            <div className="h-5 w-20 bg-zinc-700/50 rounded animate-pulse" />
            <div className="overflow-hidden rounded-lg border border-zinc-700">
              <div className="space-y-px">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex">
                    <div className="w-1/3 p-3 bg-zinc-800/50 border-r border-zinc-700">
                      <div className="h-4 bg-zinc-700/50 rounded animate-pulse" style={{ width: `${50 + (i * 5)}%` }} />
                    </div>
                    <div className="flex-1 p-3">
                      <div className="h-4 bg-zinc-700/50 rounded animate-pulse" style={{ width: `${40 + (i * 3)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Request Body Section */}
          <div className="space-y-4">
            <div className="h-5 w-28 bg-zinc-700/50 rounded animate-pulse" />
            <div className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900/50 p-4">
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-4 bg-zinc-700/30 rounded animate-pulse" style={{ width: `${60 + (i % 3) * 10}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
