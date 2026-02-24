import { Movie } from "@/dto/data";
import MovieCard from "@/components/MovieCard/MovieCard";

interface Props {
  movies: Movie[];
  type?: "movie" | "tv";
}

export default function MovieGrid({ movies, type = "movie" }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} type={type} />
      ))}
    </div>
  );
}
