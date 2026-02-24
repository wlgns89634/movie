"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getGenreList,
  getMoviesByGenre,
} from "@/lib/api";
import MovieGrid from "@/components/MovieGrid/MovieGrid";
import { MovieGridSkeleton } from "@/components/Skeleton/Skeleton";
import Pagination from "@/components/Pagination/Pagination";
import { Movie, Genre } from "@/dto/data";

const CATEGORY_TABS = [
  { key: "popular", label: "인기" },
  { key: "top_rated", label: "평점순" },
  { key: "now_playing", label: "상영중" },
  { key: "upcoming", label: "개봉예정" },
];

export default function MovieList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") || "popular";
  const currentPage = Number(searchParams.get("page")) || 1;
  const selectedGenre = searchParams.get("genre")
    ? Number(searchParams.get("genre"))
    : null;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [genres, setGenres] = useState<Genre[]>([]);

  const updateParams = (params: {
    tab?: string;
    page?: number;
    genre?: number | null;
  }) => {
    const next = new URLSearchParams(searchParams.toString());

    if (params.tab !== undefined) next.set("tab", params.tab);
    if (params.page !== undefined) next.set("page", String(params.page));
    if (params.genre !== undefined) {
      if (params.genre === null) next.delete("genre");
      else next.set("genre", String(params.genre));
    }

    router.push(`?${next.toString()}`);
  };

  // 장르 목록
  useEffect(() => {
    getGenreList().then((res) => setGenres(res.data.genres));
  }, []);

  // 영화 불러오기
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);

        let res;
        if (selectedGenre) {
          res = await getMoviesByGenre(selectedGenre, currentPage);
        } else {
          switch (activeTab) {
            case "top_rated":
              res = await getTopRatedMovies(currentPage);
              break;
            case "now_playing":
              res = await getNowPlayingMovies(currentPage);
              break;
            case "upcoming":
              res = await getUpcomingMovies(currentPage);
              break;
            default:
              res = await getPopularMovies(currentPage);
          }
        }

        setMovies(res.data.results);
        setTotalPages(res.data.total_pages);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [activeTab, selectedGenre, currentPage]);

  const handleTabChange = (tab: string) => {
    updateParams({ tab, page: 1, genre: null });
  };

  const handleGenreChange = (genreId: number) => {
    updateParams({
      genre: selectedGenre === genreId ? null : genreId,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    updateParams({ page });
    window.scrollTo(0, 0);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      {/* 카테고리 탭 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              activeTab === tab.key && !selectedGenre
                ? "bg-blue-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 장르 필터 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => handleGenreChange(genre.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              selectedGenre === genre.id
                ? "bg-rose-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      <h1 className="text-2xl font-bold mb-6">
        {selectedGenre
          ? `${genres.find((g) => g.id === selectedGenre)?.name} 영화`
          : CATEGORY_TABS.find((t) => t.key === activeTab)?.label}
      </h1>

      {isLoading ? <MovieGridSkeleton /> : <MovieGrid movies={movies} />}

      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
}
