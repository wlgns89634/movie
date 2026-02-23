"use client";

import Image from "next/image";
import { Movie } from "@/dto/data";
import { useMovieStore } from "@/store/movieStore";

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  const openModal = useMovieStore((state) => state.openModal);

  return (
    <div
      onClick={() => openModal(movie.id)}
      className="relative group cursor-pointer rounded-md overflow-hidden bg-zinc-900 transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-black/80"
    >
      <div className="relative aspect-[2/3]">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* 호버 정보 */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-bold text-sm truncate">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-yellow-400 text-xs">
              ⭐ {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-zinc-400 text-xs">
              {movie.release_date.slice(0, 4)}
            </span>
          </div>
          <p className="text-zinc-300 text-xs line-clamp-2 mt-1">
            {movie.overview}
          </p>
        </div>
      </div>
    </div>
  );
}
