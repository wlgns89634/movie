"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useMovieStore } from "@/store/movieStore";
import {
  getMovieDetail,
  getMovieCredits,
  getMovieVideos,
  getMovieRecommendations,
} from "@/lib/api";
import { MovieDetail, Cast, Video, Movie } from "@/dto/data";
import { MovieDetailSkeleton } from "@/components/Skeleton/Skeleton";
import MovieGrid from "@/components/MovieGrid/MovieGrid";

export default function MovieModal() {
  const { isModalOpen, selectedMovieId, closeModal } = useMovieStore();
  const [detail, setDetail] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedMovieId) return;

    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const [detailRes, creditsRes, videosRes, recommendRes] =
          await Promise.all([
            getMovieDetail(String(selectedMovieId)),
            getMovieCredits(String(selectedMovieId)),
            getMovieVideos(String(selectedMovieId)),
            getMovieRecommendations(String(selectedMovieId)),
          ]);

        setDetail(detailRes.data);
        setCast(creditsRes.data.cast.slice(0, 10));
        setRecommendations(recommendRes.data.results.slice(0, 10));

        const videos: Video[] = videosRes.data.results;
        const found =
          videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ??
          null;
        setTrailer(found);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [selectedMovieId]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal]);

  // 모달 열릴 때 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  return (
    // 배경 오버레이
    <div
      className="fixed inset-0 bg-black/70 z-50 flex justify-center items-start overflow-y-auto py-10"
      onClick={closeModal}
    >
      {/* 모달 컨텐츠 */}
      <div
        className="relative bg-zinc-900 rounded-2xl w-full max-w-3xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-10 bg-zinc-800 rounded-full w-8 h-8 flex items-center justify-center hover:bg-zinc-700 transition"
        >
          ✕
        </button>

        {isLoading || !detail ? (
          <div className="p-6">
            <MovieDetailSkeleton />
          </div>
        ) : (
          <>
            {/* 백드롭 */}
            <div className="relative h-64 rounded-t-2xl overflow-hidden">
              <Image
                src={`https://image.tmdb.org/t/p/original${detail.backdrop_path}`}
                alt={detail.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h1 className="text-2xl font-bold text-white">
                  {detail.title}
                </h1>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* 기본 정보 */}
              <div className="flex gap-3 flex-wrap">
                {detail.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-2 py-1 bg-zinc-800 rounded-full text-xs text-white"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 text-sm text-zinc-400">
                <span>⭐ {detail.vote_average.toFixed(1)}</span>
                <span>🕐 {detail.runtime}분</span>
                <span>📅 {detail.release_date}</span>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed">
                {detail.overview}
              </p>

              {/* 트레일러 */}
              {trailer && (
                <section>
                  <h2 className="text-lg font-bold text-white mb-3">
                    🎬 트레일러
                  </h2>
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${trailer.key}`}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </section>
              )}

              {/* 출연진 */}
              {cast.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-white mb-3">
                    🎭 출연진
                  </h2>
                  <div className="grid grid-cols-5 gap-3">
                    {cast.map((actor) => (
                      <div key={actor.id} className="text-center">
                        <div className="relative w-full aspect-square rounded-full overflow-hidden bg-zinc-800 mb-1">
                          {actor.profile_path ? (
                            <Image
                              src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                              alt={actor.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              👤
                            </div>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-white truncate">
                          {actor.name}
                        </p>
                        <p className="text-xs text-zinc-400 truncate">
                          {actor.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 추천 영화 */}
              {recommendations.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-white mb-3">
                    🍿 추천 영화
                  </h2>
                  <MovieGrid movies={recommendations} />
                </section>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
