export default function SearchLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-zinc-700" />
        <div className="absolute inset-0 rounded-full border-4 border-t-red-600 animate-spin" />
      </div>
      <p className="mt-4 text-zinc-400 text-sm tracking-widest animate-pulse">
        검색 중...
      </p>
    </div>
  );
}
