"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Movie } from "@/dto/data";
import MovieCard from "@/components/MovieCard/MovieCard";
import Image from "next/image";
interface Props {
  title: string;
  movies: Movie[];
  category?: string;
  type?: "movie" | "tv"; // 추가
}

export default function MovieRow({
  title,
  movies,
  category,
  type = "movie",
}: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scroll = (dir: "left" | "right") => {
    if (rowRef.current) {
      rowRef.current.scrollBy({
        left: dir === "left" ? -600 : 600,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between px-6 mb-3">
        <h2 className="text-white text-[26px] font-[600]">{title}</h2>
        {category && (
          <button
            onClick={() =>
              router.push(`/list?category=${category}&type=${type}`)
            }
            className="bg-[#181919] px-3 py-1 rounded-[12px] text-zinc-400 text-[14px] cursor-pointer hover:text-white transition flex items-center gap-1"
          >
            더보기 ›
          </button>
        )}
      </div>

      <div className="relative group/row">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-black/50 backdrop-blur-sm text-white text-[60px] opacity-0 group-hover/row:opacity-100 transition-opacity cursor-pointer flex items-center justify-center hover:bg-black/80"
        >
          <Image
            src="/images/arrow.svg"
            alt="더보기"
            width={12}
            height={12}
            className="rotate-180"
          />
        </button>
        <div
          ref={rowRef}
          className="flex gap-[16px] overflow-x-hidden px-6 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="shrink-0 w-38 sm:w-44 md:w-60">
              <MovieCard movie={movie} type={type} />
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-black/50 backdrop-blur-sm text-white text-[60px] opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/80"
        >
          <Image src="/images/arrow.svg" alt="더보기" width={12} height={12} />
        </button>
      </div>
    </section>
  );
}
