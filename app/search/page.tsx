"use client";

import { Suspense } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useSearch, SearchResult } from "@/hooks/useSearch";
import MovieCard from "@/components/MovieCard/MovieCard";
import { MovieGridSkeleton } from "@/components/Skeleton/Skeleton";

function SearchCard({ item }: { item: SearchResult }) {
  return (
    <div className="relative">
      <span
        className={`absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-xs font-bold text-white ${
          item.media_type === "tv" ? "bg-blue-600" : "bg-red-600"
        }`}
      >
        {item.media_type === "tv" ? "TV" : "영화"}
      </span>
      <MovieCard movie={item} type={item.media_type} />
    </div>
  );
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { results, isLoading, totalResults } = useSearch(query);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.trim()) {
      router.replace(`/search?q=${encodeURIComponent(value)}`);
    } else {
      router.replace("/search");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">
            🔍
          </span>
          <input
            type="text"
            defaultValue={query}
            onChange={handleChange}
            placeholder="영화, TV 시리즈 검색..."
            className="w-full bg-zinc-800 text-white rounded-xl pl-11 pr-4 py-3.5 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
            autoFocus
          />
        </div>
      </div>

      {!query ? (
        <div className="text-center text-zinc-500 mt-20">
          <p className="text-4xl mb-4">🎬</p>
          <p className="text-lg">검색어를 입력하세요</p>
        </div>
      ) : isLoading ? (
        <MovieGridSkeleton />
      ) : results.length === 0 ? (
        <div className="text-center text-zinc-500 mt-20">
          <p className="text-4xl mb-4">😢</p>
          <p className="text-lg">
            <span className="text-white font-semibold">{query}</span> 검색
            결과가 없어요
          </p>
        </div>
      ) : (
        <>
          <p className="text-zinc-400 text-sm mb-6">
            <span className="text-white font-semibold">{`"${query}"`}</span>{" "}
            검색 결과{" "}
            <span className="text-red-500 font-semibold">
              {totalResults.toLocaleString()}
            </span>
            건
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((item) => (
              <SearchCard key={`${item.media_type}-${item.id}`} item={item} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
