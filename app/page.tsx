"use client";

import { useState, useEffect } from "react";
import {
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getPopularTVShows,
  getTopRatedTVShows,
  getOnAirTVShows,
  getAiringTodayTVShows,
} from "@/lib/api";
import { Movie } from "@/dto/data";
import HeroBanner from "@/components/HeroBanner/HeroBanner";
import MovieRow from "@/components/MovieRow/MovieRow";

export default function Home() {
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);

  const [popularTV, setPopularTV] = useState<Movie[]>([]);
  const [topRatedTV, setTopRatedTV] = useState<Movie[]>([]);
  const [onAirTV, setOnAirTV] = useState<Movie[]>([]);
  const [airingTodayTV, setAiringTodayTV] = useState<Movie[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          popularRes,
          topRatedRes,
          nowPlayingRes,
          upcomingRes,
          popularTVRes,
          topRatedTVRes,
          onAirTVRes,
          airingTodayTVRes,
        ] = await Promise.all([
          getPopularMovies(),
          getTopRatedMovies(),
          getNowPlayingMovies(),
          getUpcomingMovies(),
          getPopularTVShows(),
          getTopRatedTVShows(),
          getOnAirTVShows(),
          getAiringTodayTVShows(),
        ]);

        setPopular(popularRes.data.results);
        setTopRated(topRatedRes.data.results);
        setNowPlaying(nowPlayingRes.data.results);
        setUpcoming(upcomingRes.data.results);

        setPopularTV(popularTVRes.data.results);
        setTopRatedTV(topRatedTVRes.data.results);
        setOnAirTV(onAirTVRes.data.results);
        setAiringTodayTV(airingTodayTVRes.data.results);
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

      {/* 영화 */}
      <MovieRow title="인기 영화" movies={popular} category="popular" />
      <MovieRow title="평점 높은 영화" movies={topRated} category="top_rated" />
      <MovieRow
        title="현재 상영중"
        movies={nowPlaying}
        category="now_playing"
      />
      <MovieRow title="개봉 예정" movies={upcoming} category="upcoming" />

      {/* TV 시리즈 */}
      <MovieRow
        title="인기 TV 시리즈"
        movies={popularTV}
        category="popular"
        type="tv"
      />
      <MovieRow
        title="평점 높은 TV 시리즈"
        movies={topRatedTV}
        category="top_rated"
        type="tv"
      />
      <MovieRow
        title="현재 방영중"
        movies={onAirTV}
        category="now_playing"
        type="tv"
      />
      <MovieRow
        title="오늘 방영"
        movies={airingTodayTV}
        category="upcoming"
        type="tv"
      />
    </main>
  );
}
