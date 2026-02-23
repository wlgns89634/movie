"use client";

import { useState, useEffect } from "react";
import {
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
} from "@/lib/api";
import { Movie } from "@/dto/data";
import HeroBanner from "@/components/HeroBanner/HeroBanner";
import MovieRow from "@/components/MovieRow/MovieRow";

export default function Home() {
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [popularRes, topRatedRes, nowPlayingRes, upcomingRes] =
          await Promise.all([
            getPopularMovies(),
            getTopRatedMovies(),
            getNowPlayingMovies(),
            getUpcomingMovies(),
          ]);
        setPopular(popularRes.data.results);
        setTopRated(topRatedRes.data.results);
        setNowPlaying(nowPlayingRes.data.results);
        setUpcoming(upcomingRes.data.results);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (isLoading)
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600" />
      </div>
    );

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {popular[0] && <HeroBanner movie={popular[0]} />}
      <MovieRow title="🔥 인기 영화" movies={popular} category="popular" />
      <MovieRow
        title="⭐ 평점 높은 영화"
        movies={topRated}
        category="top_rated"
      />
      <MovieRow
        title="🎬 현재 상영중"
        movies={nowPlaying}
        category="now_playing"
      />
      <MovieRow title="🗓 개봉 예정" movies={upcoming} category="upcoming" />
    </main>
  );
}
