"use client";

import Image from "next/image";
import { Movie } from "@/dto/data";
import { useMovieStore } from "@/store/movieStore";

interface Props {
  movie: Movie;
}

const HeroBanner = ({ movie }: Props) => {
  const openModal = useMovieStore((state) => state.openModal);

  return (
    <div className="relative w-full h-[70vh] mb-8">
      <Image
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        alt={movie.title}
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      {/* 그라디언트 */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

      {/* 텍스트 */}
      <div className="absolute bottom-20 left-6 md:left-16 max-w-lg">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
          {movie.title}
        </h1>
        <p className="text-zinc-300 text-sm md:text-base line-clamp-3 mb-6">
          {movie.overview}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => openModal(movie.id)}
            className="px-6 py-2 bg-white text-black font-bold rounded-md hover:bg-zinc-200 transition flex items-center gap-2"
          >
            ▶ 재생
          </button>
          <button
            onClick={() => openModal(movie.id)}
            className="px-6 py-2 bg-zinc-600/80 text-white font-bold rounded-md hover:bg-zinc-600 transition flex items-center gap-2"
          >
            ℹ 상세정보
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
