const skeletonWidths = [
  { path: '75%', time: '35%' },
  { path: '50%', time: '45%' },
  { path: '65%', time: '30%' },
  { path: '80%', time: '40%' },
];

function SkeletonItem({ pathWidth, timeWidth }: { pathWidth: string; timeWidth: string }) {
  return (
    <div className="rounded-lg">
      <div className="flex items-start gap-3 px-4 py-2.5">
        <div className="w-4 h-4 bg-zinc-700/50 rounded animate-pulse mt-0.5" />

        <div className="flex flex-1 min-w-0 items-start gap-3">
          <div className="w-12 shrink-0 h-4 bg-zinc-700/50 rounded animate-pulse" />

          <div className="flex-1 min-w-0">
            <div className="h-3 bg-zinc-700/50 rounded animate-pulse mb-2" style={{ width: pathWidth }} />
            <div className="h-3 bg-zinc-700/30 rounded animate-pulse" style={{ width: timeWidth }} />
          </div>
        </div>

        <div className="w-6 h-6 bg-zinc-700/30 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function WebhooksListItemSkeleton() {
  return (
    <div className="space-y-1">
      {skeletonWidths.map((widths, index) => (
        <SkeletonItem
          key={index}
          pathWidth={widths.path}
          timeWidth={widths.time}
        />
      ))}
    </div>
  );
}