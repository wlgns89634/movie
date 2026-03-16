"use client";

import { Suspense, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import { useSearch, SearchResult } from "@/hooks/useSearch";
import MovieCard from "@/components/MovieCard/MovieCard";
import { MovieGridSkeleton } from "@/components/Skeleton/Skeleton";
import SearchLoading from "@/components/Loading/SearchLoading";

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

  const [inputValue, setInputValue] = useState(query);
  const { results, isLoading, totalResults } = useSearch(query);

  const handleSearch = () => {
    if (inputValue.trim()) {
      router.replace(`/search?q=${encodeURIComponent(inputValue)}`);
    } else {
      router.replace("/search");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      {isLoading && <SearchLoading />}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-lg">
              <Image
                src="/images/search.svg"
                alt="검색 아이콘"
                width={20}
                height={20}
                className="object-contain"
              />
            </span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="영화, TV 시리즈 검색..."
              className="w-full bg-zinc-800 text-white rounded-xl pl-11 pr-4 py-3.5 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
              autoFocus
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-5 rounded-xl transition"
          >
            검색
          </button>
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
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <p className="text-6xl mb-6">😢</p>
          <p className="text-2xl">
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
