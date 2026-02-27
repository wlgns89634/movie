"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getGenreList,
  getMoviesByGenre,
  getPopularTVShows,
  getTopRatedTVShows,
  getOnAirTVShows,
  getAiringTodayTVShows,
  getTVGenreList,
  getTVByGenre,
} from "@/lib/api";
import MovieGrid from "@/components/MovieGrid/MovieGrid";
import { MovieGridSkeleton } from "@/components/Skeleton/Skeleton";
import Pagination from "@/components/Pagination/Pagination";
import { Movie, Genre } from "@/dto/data";

const MOVIE_TABS = [
  { key: "popular", label: "인기" },
  { key: "top_rated", label: "평점순" },
  { key: "now_playing", label: "상영중" },
  { key: "upcoming", label: "개봉예정" },
];

const TV_TABS = [
  { key: "popular", label: "인기" },
  { key: "top_rated", label: "평점순" },
  { key: "on_air", label: "방영중" },
  { key: "airing_today", label: "오늘방영" },
];

const MOVIE_SORT_MAP: Record<string, string> = {
  popular: "popularity.desc",
  top_rated: "vote_average.desc",
  now_playing: "primary_release_date.desc",
  upcoming: "primary_release_date.asc",
};

const TV_SORT_MAP: Record<string, string> = {
  popular: "popularity.desc",
  top_rated: "vote_average.desc",
  on_air: "first_air_date.desc",
  airing_today: "first_air_date.desc",
};

function MovieListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type") === "tv" ? "tv" : "movie";
  const isTV = type === "tv";
  const TABS = isTV ? TV_TABS : MOVIE_TABS;
  const SORT_MAP = isTV ? TV_SORT_MAP : MOVIE_SORT_MAP;

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
    const fetchGenres = async () => {
      const res = isTV ? await getTVGenreList() : await getGenreList();
      setGenres(res.data.genres);
    };
    fetchGenres();
  }, [isTV]);

  // 데이터 불러오기
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);

        let res;
        if (selectedGenre) {
          res = isTV
            ? await getTVByGenre(
                selectedGenre,
                currentPage,
                SORT_MAP[activeTab],
              )
            : await getMoviesByGenre(
                selectedGenre,
                currentPage,
                SORT_MAP[activeTab],
              );
        } else if (isTV) {
          switch (activeTab) {
            case "top_rated":
              res = await getTopRatedTVShows(currentPage);
              break;
            case "on_air":
              res = await getOnAirTVShows(currentPage);
              break;
            case "airing_today":
              res = await getAiringTodayTVShows(currentPage);
              break;
            default:
              res = await getPopularTVShows(currentPage);
          }
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
  }, [activeTab, selectedGenre, currentPage, isTV]);

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

  const getTitle = () => {
    const tabLabel = TABS.find((t) => t.key === activeTab)?.label;
    const genreLabel = genres.find((g) => g.id === selectedGenre)?.name;
    if (selectedGenre && genreLabel) return `${tabLabel} · ${genreLabel}`;
    return tabLabel;
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      {/* 영화/TV 타입 표시 */}
      <div className="flex gap-3 mb-2">
        <h2 className="text-zinc-500 text-sm font-semibold">
          {isTV ? "📺 TV 시리즈" : "🎬 영화"}
        </h2>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              activeTab === tab.key
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

      <h1 className="text-2xl font-bold mb-6">{getTitle()}</h1>

      {isLoading ? (
        <MovieGridSkeleton />
      ) : (
        <MovieGrid movies={movies} type={isTV ? "tv" : "movie"} />
      )}

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

export default function MovieList() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600" />
        </div>
      }
    >
      <MovieListContent />
    </Suspense>
  );
}
