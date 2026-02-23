"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  getMovieDetail,
  getMovieCredits,
  getMovieVideos,
  getMovieRecommendations,
} from "@/lib/api";
import { MovieDetail, Cast, Video, Movie } from "@/dto/data";
import { MovieDetailSkeleton } from "@/components/Skeleton/Skeleton";
import MovieGrid from "@/components/MovieGrid/MovieGrid";

export default function DetailPage() {
  const { id } = useParams() as { id: string };
  const [detail, setDetail] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const [detailRes, creditsRes, videosRes, recommendRes] =
          await Promise.all([
            getMovieDetail(id),
            getMovieCredits(id),
            getMovieVideos(id),
            getMovieRecommendations(id),
          ]);

        setDetail(detailRes.data);
        setCast(creditsRes.data.cast.slice(0, 10));
        setRecommendations(recommendRes.data.results.slice(0, 10));

        // 한국어 트레일러 없으면 영어 트레일러
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
  }, [id]);

  if (isLoading)
    return (
      <main className="min-h-screen bg-zinc-950 text-white p-6">
        <MovieDetailSkeleton />
      </main>
    );

  if (!detail) return null;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* 백드롭 배너 */}
      <div className="relative h-[400px] w-full">
        <Image
          src={`https://image.tmdb.org/t/p/original${detail.backdrop_path}`}
          alt={detail.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
      </div>

      <div className="p-6 max-w-5xl mx-auto -mt-32 relative">
        <div className="flex gap-6">
          {/* 포스터 */}
          <div className="relative w-40 h-60 shrink-0 rounded-xl overflow-hidden shadow-xl">
            <Image
              src={`https://image.tmdb.org/t/p/w500${detail.poster_path}`}
              alt={detail.title}
              fill
              className="object-cover"
            />
          </div>

          {/* 기본 정보 */}
          <div className="flex flex-col justify-end gap-2">
            <h1 className="text-3xl font-bold">{detail.title}</h1>
            <div className="flex gap-2 flex-wrap">
              {detail.genres.map((g) => (
                <span
                  key={g.id}
                  className="px-2 py-1 bg-zinc-800 rounded-full text-xs"
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
            <p className="text-zinc-300 text-sm leading-relaxed max-w-xl">
              {detail.overview}
            </p>
          </div>
        </div>

        {/* 트레일러 */}
        {trailer && (
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">🎬 트레일러</h2>
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
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">🎭 출연진</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {cast.map((actor) => (
                <div key={actor.id} className="text-center">
                  <div className="relative w-full aspect-square rounded-full overflow-hidden bg-zinc-800 mb-2">
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
                  <p className="text-sm font-semibold truncate">{actor.name}</p>
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
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">🍿 추천 영화</h2>
            <MovieGrid movies={recommendations} />
          </section>
        )}
      </div>
    </main>
  );
}
