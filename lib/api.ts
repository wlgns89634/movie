import tmdb from "./tmdb";

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
export const getMoviesByGenre = (genreId: number, page: number = 1) =>
  tmdb.get("/discover/movie", {
    params: { with_genres: genreId, language: "ko-KR", page },
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
