// 카드 스켈레톤
export function MovieCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-zinc-900 animate-pulse">
      <div className="aspect-[2/3] bg-zinc-800" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-zinc-800 rounded w-3/4" />
        <div className="h-3 bg-zinc-800 rounded w-1/2" />
      </div>
    </div>
  );
}

// 그리드 스켈레톤
export function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}

// 상세페이지 스켈레톤
export function MovieDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-64 bg-zinc-800 rounded-xl w-full" />
      <div className="h-6 bg-zinc-800 rounded w-1/3" />
      <div className="h-4 bg-zinc-800 rounded w-full" />
      <div className="h-4 bg-zinc-800 rounded w-5/6" />
      <div className="h-4 bg-zinc-800 rounded w-4/6" />
    </div>
  );
}

// 검색 결과 스켈레톤
export function SearchSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}
