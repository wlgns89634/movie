"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { useMovieStore } from "@/store/movieStore";
import { useLenisStore } from "@/store/lenisStore";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function MovieModal() {
  const { isModalOpen, selectedMovieId, selectedType, closeModal } =
    useMovieStore();
  const { lenis } = useLenisStore();
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

  // Lenis stop/start
  useEffect(() => {
    if (isModalOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden"; // 추가
    } else {
      lenis?.start();
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset"; // 추가
    }

    return () => {
      lenis?.start();
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, lenis]);

  if (!isModalOpen) return null;

  const title = detail?.title || detail?.name || "";
  const date = detail?.release_date || detail?.first_air_date || "";
  const runtime = detail?.runtime
    ? ` ${detail.runtime}분`
    : detail?.episode_run_time?.[0]
      ? ` 회당 ${detail.episode_run_time[0]}분`
      : null;

  const seasons = detail?.seasons?.filter((s) => s.season_number > 0) ?? [];

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex justify-center items-start overflow-y-auto py-10"
      onClick={closeModal}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <div
        className="relative bg-zinc-900 rounded-2xl w-[86%] max-w-4xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-4 text-white right-4 z-10 bg-zinc-800 rounded-full w-8 h-8 flex items-center justify-center hover:bg-zinc-700 transition"
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
              {detail.backdrop_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/original${detail.backdrop_path}`}
                  alt={title}
                  fill
                  sizes="(max-width: 640px) 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                  <Image
                    src={`/images/noimg.svg`}
                    alt={title}
                    width={100}
                    height={100}
                    sizes="(max-width: 640px) 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <h1 className="text-2xl font-bold text-white">{title}</h1>
                {isTV && detail.number_of_seasons && (
                  <p className="text-zinc-400 text-sm mt-1">
                    🎞 {detail.number_of_seasons}시즌 ·{" "}
                    {detail.number_of_episodes}편
                  </p>
                )}
              </div>
            </div>

            <div className="p-6 space-y-10">
              {/* 장르 */}
              <div className="flex flex-col gap-5 flex-wrap">
                <div className="flex gap-3 flex-wrap">
                  {detail.genres.map((g) => (
                    <span
                      key={g.id}
                      className="px-4 py-2 bg-zinc-800 rounded-full text-xs text-white"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
                {/* 기본 정보 */}
                <div className="flex gap-2 text-sm text-zinc-400 flex-col md:flex-row md:gap-4">
                  <span>평점 : ⭐{detail.vote_average.toFixed(1)} / 10</span>
                  {runtime && <span>시간 : {runtime}</span>}
                  <span>개봉 : {date}</span>
                </div>

                <p className="text-zinc-300 text-sm leading-relaxed">
                  {detail.overview
                    ? `${detail.overview}`
                    : "줄거리가 없습니다."}
                </p>
              </div>

              {/* 시즌 & 에피소드 (TV만) */}
              {isTV && seasons.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">에피소드</h2>
                    <Select
                      value={String(selectedSeason)}
                      onValueChange={(val) => setSelectedSeason(Number(val))}
                    >
                      <SelectTrigger className="w-26 bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="시즌 선택" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                        {seasons.map((s) => (
                          <SelectItem
                            key={s.season_number}
                            value={String(s.season_number)}
                            className="text-white focus:bg-zinc-700 focus:text-white"
                          >
                            시즌 {s.season_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {isSeasonLoading ? (
                    <div className="flex justify-center py-6">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-600" />
                    </div>
                  ) : (
                    <div className="scrollbar flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                      {seasonDetail?.episodes.map((ep) => (
                        <div
                          key={ep.id}
                          className="flex gap-3 border-b border-zinc-800 py-4 px-2.5 hover:bg-zinc-700 transition"
                        >
                          <div className="relative w-29 shrink-0 aspect-video rounded-sm overflow-hidden ">
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
                                <Image
                                  src={`/images/noimg.svg`}
                                  alt={title}
                                  width={30}
                                  height={30}
                                  sizes="100%"
                                  className="object-cover"
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col justify-center gap-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-zinc-100 text-[14px] shrink-0">
                                E{ep.episode_number}
                              </span>
                              <h3 className="text-zinc-300 text-[14px] font-semibold truncate">
                                {ep.name}
                              </h3>
                            </div>
                            <div className="flex gap-1 mb-2 text-[14px] text-zinc-400 md:flex-row flex-col md:gap-2">
                              {ep.air_date && (
                                <span>방영일 : {ep.air_date}</span>
                              )}
                              {ep.runtime && <span> {ep.runtime}분</span>}
                              {ep.vote_average > 0 && (
                                <span>
                                  평점 : ⭐ {ep.vote_average.toFixed(1)}
                                </span>
                              )}
                            </div>
                            {ep.overview && (
                              <p className="text-[14px] line-clamp-2 text-zinc-300">
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
                  <h2 className="text-lg font-bold text-white mb-3">출연진</h2>
                  <div
                    className="scrollbar flex gap-4 overflow-x-auto pb-2"
                    style={{
                      msOverflowStyle: "none",
                      WebkitOverflowScrolling: "touch",
                    }}
                  >
                    {cast.map((actor) => (
                      <div
                        key={actor.id}
                        className="text-center shrink-0 w-24 md:w-28"
                      >
                        <div className="relative w-full aspect-[3/4] rounded-md overflow-hidden bg-zinc-800 mb-2">
                          {actor.profile_path ? (
                            <Image
                              src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                              alt={actor.name}
                              fill
                              sizes="(max-width: 640px) 50vw"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Image
                                src={"/images/human.svg"}
                                alt={"이미지 없음"}
                                width={100}
                                height={100}
                                sizes="100%"
                                className="w-25"
                              />
                            </div>
                          )}
                        </div>
                        <p className="mt-3 text-[14px] font-semibold text-white truncate">
                          {actor.name}
                        </p>
                        <p className="text-[14px] text-zinc-400 truncate">
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
                    {isTV ? "추천 TV 시리즈" : "추천 영화"}
                  </h2>
                  <MovieGrid
                    movies={recommendations}
                    type={selectedType}
                    scroll
                  />
                </section>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
