import { useQuery } from "@tanstack/react-query";
import {
  getPopularMovies,
  searchMovies,
  getMovieRecommendations,
} from "@/lib/api";

// 인기 영화
export const usePopularMovies = () =>
  useQuery({
    queryKey: ["movies", "popular"],
    queryFn: () => getPopularMovies().then((res) => res.data.results),
  });

// 영화 검색
export const useSearchMovies = (query: string) =>
  useQuery({
    queryKey: ["movies", "search", query],
    queryFn: () => searchMovies(query).then((res) => res.data.results),
    enabled: !!query, // query 있을 때만 실행
  });

// 영화 추천
export const useMovieRecommendations = (id: string) =>
  useQuery({
    queryKey: ["movies", "recommendations", id],
    queryFn: () => getMovieRecommendations(id).then((res) => res.data.results),
    enabled: !!id,
  });
