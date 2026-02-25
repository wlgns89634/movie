import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 mt-20 py-12 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* 로고 & 설명 */}
        <div className="mb-8">
          <span className="text-red-600 font-black text-2xl tracking-tight">
            MOVIEFLIX
          </span>
          <p className="text-zinc-500 text-sm mt-2 max-w-sm">
            TMDB API를 활용한 영화 & TV 시리즈 정보 서비스입니다.
          </p>
        </div>

        {/* 링크 */}
        <div className="flex flex-wrap gap-10 mb-10 text-sm text-zinc-400">
          <div className="flex flex-col gap-2">
            <p className="text-white font-semibold mb-1">서비스</p>
            <Link href="/" className="hover:text-white transition">
              홈
            </Link>
            <Link href="/list" className="hover:text-white transition">
              영화
            </Link>
            <Link href="/search" className="hover:text-white transition">
              검색
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-white font-semibold mb-1">정보</p>
            <Link
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              TMDB
            </Link>
            <Link
              href="https://developer.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              API 문서
            </Link>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-zinc-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-zinc-600 text-xs">
            © 2026 MOVIEFLIX. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 text-xs font-bold">TMDB</span>
            <p className="text-zinc-600 text-xs">
              This product uses the TMDB API but is not endorsed or certified by
              TMDB.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
