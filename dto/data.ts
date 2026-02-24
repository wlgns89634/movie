//  리스트 데이터
export interface Movie {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  genre_ids: number[];
}

export interface MovieResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

// 상세 데이터
export interface MovieDetail {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number; // 추가
  number_of_episodes?: number; // 추가
  seasons?: {
    // 추가
    season_number: number;
    name: string;
    episode_count: number;
    poster_path: string | null;
    air_date: string;
  }[];
  backdrop_path: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  genres: { id: number; name: string }[];
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  type: string;
  site: string;
}

export interface Genre {
  id: number;
  name: string;
}

// 에피소드
export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  episode_number: number;
  season_number: number;
  vote_average: number;
  runtime: number | null;
}

// 시즌 상세 (에피소드 목록 포함)
export interface SeasonDetail {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
  season_number: number;
  episodes: Episode[];
}
