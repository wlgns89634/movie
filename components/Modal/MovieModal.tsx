"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useMovieStore } from "@/store/movieStore";
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

export default function MovieModal() {
  const { isModalOpen, selectedMovieId, selectedType, closeModal } =
    useMovieStore();
  const [detail, setDetail] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonDetail, setSeasonDetail] = useState<SeasonDetail | null>(null);
  const [isSeasonLoading, setIsSeasonLoading] = useState(false);

  const isTV = selectedType === "tv";

  useEffect(() => {
    if (!selectedMovieId) return;

    const fetchAll = async () => {
      try {
        setIsLoading(true);
        setSelectedSeason(1);
        setSeasonDetail(null);
        const id = String(selectedMovieId);

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

        // TV면 첫 시즌 바로 로드
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
  }, [selectedMovieId, selectedType]);

  // 시즌 변경 시 에피소드 로드
  useEffect(() => {
    if (!isTV || !selectedMovieId) return;

    const fetchSeason = async () => {
      try {
        setIsSeasonLoading(true);
        const seasonRes = await getTVSeasonDetail(
          String(selectedMovieId),
          selectedSeason,
        );
        setSeasonDetail(seasonRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSeasonLoading(false);
      }
    };

    fetchSeason();
  }, [selectedSeason]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  const title = detail?.title || detail?.name || "";
  const date = detail?.release_date || detail?.first_air_date || "";
  const runtime = detail?.runtime
    ? `🕐 ${detail.runtime}분`
    : detail?.episode_run_time?.[0]
      ? `🕐 회당 ${detail.episode_run_time[0]}분`
      : null;

  const seasons = detail?.seasons?.filter((s) => s.season_number > 0) ?? [];

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex justify-center items-start overflow-y-auto py-10"
      onClick={closeModal}
    >
      <div
        className="relative bg-zinc-900 rounded-2xl w-full max-w-3xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
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
                alt={title}
                fill
                sizes="(max-width: 640px) 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                {isTV && detail.number_of_seasons && (
                  <p className="text-zinc-400 text-sm mt-1">
                    🎞 {detail.number_of_seasons}시즌 ·{" "}
                    {detail.number_of_episodes}편
                  </p>
                )}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* 장르 */}
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

              {/* 기본 정보 */}
              <div className="flex gap-4 text-sm text-zinc-400">
                <span>⭐ {detail.vote_average.toFixed(1)}</span>
                {runtime && <span>{runtime}</span>}
                <span>📅 {date}</span>
              </div>

              <p className="text-zinc-300 text-sm leading-relaxed">
                {detail.overview}
              </p>

              {/* 시즌 & 에피소드 (TV만) */}
              {isTV && seasons.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-white mb-3">
                    📺 에피소드
                  </h2>

                  {/* 시즌 탭 */}
                  <div className="flex gap-2 flex-wrap mb-4">
                    {seasons.map((s) => (
                      <button
                        key={s.season_number}
                        onClick={() => setSelectedSeason(s.season_number)}
                        className={`px-3 py-1.5 rounded-full text-xs transition ${
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
                    <div className="flex justify-center py-6">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600" />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                      {seasonDetail?.episodes.map((ep) => (
                        <div
                          key={ep.id}
                          className="flex gap-3 bg-zinc-800 rounded-xl p-2.5 hover:bg-zinc-700 transition"
                        >
                          {/* 썸네일 */}
                          <div className="relative w-28 shrink-0 aspect-video rounded-lg overflow-hidden bg-zinc-700">
                            {ep.still_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w300${ep.still_path}`}
                                sizes="100%"
                                alt={ep.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl">
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
                              <h3 className="text-white text-xs font-semibold truncate">
                                {ep.name}
                              </h3>
                            </div>
                            <div className="flex gap-2 text-xs text-zinc-500">
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
                              sizes="(max-width: 640px) 50vw"
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

              {/* 추천 */}
              {recommendations.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-white mb-3">
                    {isTV ? "📺 추천 TV 시리즈" : "🍿 추천 영화"}
                  </h2>
                  <MovieGrid movies={recommendations} type={selectedType} />
                </section>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
