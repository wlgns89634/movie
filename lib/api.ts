import tmdb from "./tmdb";

// 멀티 검색 (영화 + TV 한번에)
export const searchMulti = (query: string, page: number = 1) =>
  tmdb.get("/search/multi", {
    params: { query, language: "ko-KR", page },
  });

// 인기 영화
export const getPopularMovies = (page: number = 1) =>
  tmdb.get("/movie/popular", {
    params: { language: "ko-KR", page },
  });

// 영화 검색
export const searchMovies = (query: string) =>
  tmdb.get("/search/movie", {
    params: { query, language: "ko-KR" },
  });

// 영화 상세
export const getMovieDetail = (id: string) =>
  tmdb.get(`/movie/${id}`, {
    params: { language: "ko-KR" },
  });

// 출연진
export const getMovieCredits = (id: string) =>
  tmdb.get(`/movie/${id}/credits`, {
    params: { language: "ko-KR" },
  });

// 트레일러
export const getMovieVideos = (id: string) =>
  tmdb.get(`/movie/${id}/videos`, {
    params: { language: "ko-KR" },
  });

// 추천 영화
export const getMovieRecommendations = (id: string) =>
  tmdb.get(`/movie/${id}/recommendations`, {
    params: { language: "ko-KR" },
  });

// 장르 목록
export const getGenreList = () =>
  tmdb.get("/genre/movie/list", {
    params: { language: "ko-KR" },
  });

// 장르별 영화
export const getMoviesByGenre = (
  genreId: number,
  page: number = 1,
  sortBy: string = "popularity.desc",
) =>
  tmdb.get("/discover/movie", {
    params: { with_genres: genreId, language: "ko-KR", page, sort_by: sortBy },
  });

// 평점 높은 영화
export const getTopRatedMovies = (page: number = 1) =>
  tmdb.get("/movie/top_rated", {
    params: { language: "ko-KR", page },
  });

// 현재 상영중
export const getNowPlayingMovies = (page: number = 1) =>
  tmdb.get("/movie/now_playing", {
    params: { language: "ko-KR", page },
  });

// 개봉 예정
export const getUpcomingMovies = (page: number = 1) =>
  tmdb.get("/movie/upcoming", {
    params: { language: "ko-KR", page },
  });

// =================== TV 시리즈 ===================

// TV 장르 목록
export const getTVGenreList = () =>
  tmdb.get("/genre/tv/list", {
    params: { language: "ko-KR" },
  });

// 장르별 TV
export const getTVByGenre = (
  genreId: number,
  page: number = 1,
  sortBy: string = "popularity.desc",
) =>
  tmdb.get("/discover/tv", {
    params: { with_genres: genreId, language: "ko-KR", page, sort_by: sortBy },
  });

// 인기 TV
export const getPopularTVShows = (page: number = 1) =>
  tmdb.get("/tv/popular", {
    params: { language: "ko-KR", page },
  });

// 평점 높은 TV
export const getTopRatedTVShows = (page: number = 1) =>
  tmdb.get("/tv/top_rated", {
    params: { language: "ko-KR", page },
  });

// 현재 방영중
export const getOnAirTVShows = (page: number = 1) =>
  tmdb.get("/tv/on_the_air", {
    params: { language: "ko-KR", page },
  });

// 오늘 방영
export const getAiringTodayTVShows = (page: number = 1) =>
  tmdb.get("/tv/airing_today", {
    params: { language: "ko-KR", page },
  });

// TV 상세
export const getTVDetail = (id: string) =>
  tmdb.get(`/tv/${id}`, {
    params: { language: "ko-KR" },
  });

// TV 출연진
export const getTVCredits = (id: string) =>
  tmdb.get(`/tv/${id}/credits`, {
    params: { language: "ko-KR" },
  });

// TV 트레일러
export const getTVVideos = (id: string) =>
  tmdb.get(`/tv/${id}/videos`, {
    params: { language: "ko-KR" },
  });

// TV 추천
export const getTVRecommendations = (id: string) =>
  tmdb.get(`/tv/${id}/recommendations`, {
    params: { language: "ko-KR" },
  });

// 시즌 상세 (에피소드 목록 포함)
export const getTVSeasonDetail = (id: string, seasonNumber: number) =>
  tmdb.get(`/tv/${id}/season/${seasonNumber}`, {
    params: { language: "ko-KR" },
  });

// 에피소드 상세
export const getTVEpisodeDetail = (
  id: string,
  seasonNumber: number,
  episodeNumber: number,
) =>
  tmdb.get(`/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}`, {
    params: { language: "ko-KR" },
  });

// 에피소드 출연진
export const getTVEpisodeCredits = (
  id: string,
  seasonNumber: number,
  episodeNumber: number,
) =>
  tmdb.get(
    `/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}/credits`,
    {
      params: { language: "ko-KR" },
    },
  );

// 에피소드 트레일러
export const getTVEpisodeVideos = (
  id: string,
  seasonNumber: number,
  episodeNumber: number,
) =>
  tmdb.get(`/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}/videos`, {
    params: { language: "ko-KR" },
  });
