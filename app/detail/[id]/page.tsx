"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";

import {
  getMovieDetail,
  getMovieCredits,
  getMovieVideos,
  getMovieRecommendations,
  getTVDetail,
  getTVCredits,
  getTVVideos,
  getTVRecommendations,
  getTVSeasonDetail,
} from "@/lib/api";
import { MovieDetail, Cast, Video, Movie, SeasonDetail } from "@/dto/data";
import { MovieDetailSkeleton } from "@/components/Skeleton/Skeleton";
import MovieGrid from "@/components/MovieGrid/MovieGrid";

export default function DetailPage() {
  const { id } = useParams() as { id: string };
  const searchParams = useSearchParams();
  const type = searchParams.get("type") === "tv" ? "tv" : "movie";
  const isTV = type === "tv";

  const [detail, setDetail] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonDetail, setSeasonDetail] = useState<SeasonDetail | null>(null);
  const [isSeasonLoading, setIsSeasonLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const [detailRes, creditsRes, videosRes, recommendRes] =
          await Promise.all([
            isTV ? getTVDetail(id) : getMovieDetail(id),
            isTV ? getTVCredits(id) : getMovieCredits(id),
            isTV ? getTVVideos(id) : getMovieVideos(id),
            isTV ? getTVRecommendations(id) : getMovieRecommendations(id),
          ]);

        setDetail(detailRes.data);
        setCast(creditsRes.data.cast.slice(0, 10));
        setRecommendations(recommendRes.data.results.slice(0, 10));

        const videos: Video[] = videosRes.data.results;
        const found =
          videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ??
          null;
        setTrailer(found);

        // TV면 첫 시즌 에피소드 바로 로드
        if (isTV) {
          const seasonRes = await getTVSeasonDetail(id, 1);
          setSeasonDetail(seasonRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, [id, isTV]);

  // 시즌 변경 시 에피소드 로드
  useEffect(() => {
    if (!isTV || !detail) return;

    const fetchSeason = async () => {
      try {
        setIsSeasonLoading(true);
        const seasonRes = await getTVSeasonDetail(id, selectedSeason);
        setSeasonDetail(seasonRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSeasonLoading(false);
      }
    };

    fetchSeason();
  }, [selectedSeason, isTV, id, detail]);

  if (isLoading)
    return (
      <main className="min-h-screen bg-zinc-950 text-white p-6">
        <MovieDetailSkeleton />
      </main>
    );

  if (!detail) return null;

  const title = detail.title || detail.name || "";
  const date = detail.release_date || detail.first_air_date || "";
  const runtime = detail.runtime
    ? `${detail.runtime}분`
    : detail.episode_run_time?.[0]
      ? `회당 ${detail.episode_run_time[0]}분`
      : null;

  // 시즌 목록 (season_number > 0 인것만, 스페셜 제외)
  const seasons = detail.seasons?.filter((s) => s.season_number > 0) ?? [];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* 백드롭 배너 */}
      <div className="relative h-[400px] w-full">
        <Image
          src={`https://image.tmdb.org/t/p/original${detail.backdrop_path}`}
          alt={title}
          sizes="100%"
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
              alt={title}
              sizes="100%"
              fill
              className="object-cover"
            />
          </div>

          {/* 기본 정보 */}
          <div className="flex flex-col justify-end gap-2">
            <h1 className="text-3xl font-bold">{title}</h1>
            {isTV && detail.number_of_seasons && (
              <p className="text-zinc-400 text-sm">
                🎞 {detail.number_of_seasons}시즌 · {detail.number_of_episodes}
                편
              </p>
            )}
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
              {runtime && <span>🕐 {runtime}</span>}
              <span>📅 {date}</span>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed max-w-xl">
              {detail.overview}
            </p>
          </div>
        </div>

        {/* 시즌 & 에피소드 (TV만) */}
        {isTV && seasons.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">📺 에피소드</h2>

            {/* 시즌 탭 */}
            <div className="flex gap-2 flex-wrap mb-6">
              {seasons.map((s) => (
                <button
                  key={s.season_number}
                  onClick={() => setSelectedSeason(s.season_number)}
                  className={`px-4 py-1.5 rounded-full text-sm transition ${
                    selectedSeason === s.season_number
                      ? "bg-red-600 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  시즌 {s.season_number}
                </button>
              ))}
            </div>

            {/* 에피소드 목록 */}
            {isSeasonLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600" />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {seasonDetail?.episodes.map((ep) => (
                  <div
                    key={ep.id}
                    className="flex gap-4 bg-zinc-900 rounded-xl p-3 hover:bg-zinc-800 transition"
                  >
                    {/* 썸네일 */}
                    <div className="relative w-36 shrink-0 aspect-video rounded-lg overflow-hidden bg-zinc-800">
                      {ep.still_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w300${ep.still_path}`}
                          alt={ep.name}
                          sizes="100%"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          🎬
                        </div>
                      )}
                    </div>

                    {/* 에피소드 정보 */}
                    <div className="flex flex-col justify-center gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500 text-xs shrink-0">
                          E{ep.episode_number}
                        </span>
                        <h3 className="text-white text-sm font-semibold truncate">
                          {ep.name}
                        </h3>
                      </div>
                      <div className="flex gap-3 text-xs text-zinc-500">
                        {ep.air_date && <span>📅 {ep.air_date}</span>}
                        {ep.runtime && <span>🕐 {ep.runtime}분</span>}
                        {ep.vote_average > 0 && (
                          <span>⭐ {ep.vote_average.toFixed(1)}</span>
                        )}
                      </div>
                      {ep.overview && (
                        <p className="text-zinc-400 text-xs line-clamp-2">
                          {ep.overview}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

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
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
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

        {/* 추천 */}
        {recommendations.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">
              {isTV ? "📺 추천 TV 시리즈" : "🍿 추천 영화"}
            </h2>
            <MovieGrid movies={recommendations} type={isTV ? "tv" : "movie"} />
          </section>
        )}
      </div>
    </main>
  );
}
