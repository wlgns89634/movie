import { Movie } from "@/dto/data";
import MovieCard from "@/components/MovieCard/MovieCard";

interface Props {
  movies: Movie[];
  type?: "movie" | "tv";
  className?: string;
  scroll?: boolean;
}

export default function MovieGrid({ movies, type = "movie", scroll }: Props) {
  if (scroll) {
    return (
      <div
        className={`scrollbar flex gap-4 overflow-x-auto pb-2`}
        style={{
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="shrink-0 w-36">
            <MovieCard movie={movie} type={type} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 $`}
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} type={type} />
      ))}
    </div>
  );
}
