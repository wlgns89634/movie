"use client";

import { useState, useEffect, useRef, Suspense } from "react";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/list?type=movie", label: "영화" },
  { href: "/list?type=tv", label: "TV 시리즈" },
];

function NavbarContent() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setSearchOpen(false);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setQuery("");
      setSearchOpen(false);
    }
  };

  const isActive = (href: string) => {
    const [hrefPath, hrefQuery] = href.split("?");
    if (pathname !== hrefPath) return false;
    if (!hrefQuery) return true;
    const hrefParams = new URLSearchParams(hrefQuery);
    for (const [key, value] of hrefParams.entries()) {
      if (searchParams.get(key) !== value) return false;
    }
    return true;
  };

  return (
    <>
      <nav className="sticky top-0 left-0 right-0 z-40 bg-zinc-950">
        {/* 메인 헤더 */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* 왼쪽: 로고 + 데스크탑 메뉴 */}
          <div className="flex items-center gap-8">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              <span className="text-red-600 font-black text-2xl tracking-tight cursor-pointer">
                MOVIEFLIX
              </span>
            </Link>

            <div className="hidden md:flex gap-6 text-sm">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition border-b-2 pb-0.5 ${
                    isActive(link.href)
                      ? "text-white font-semibold border-red-600"
                      : "text-zinc-400 border-transparent hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 오른쪽: 검색 아이콘 + 햄버거 */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              className="flex items-center justify-center h-8 transition text-white hover:text-zinc-300"
            >
              {searchOpen ? (
                <span className="text-zinc-400 hover:text-white text-lg font-medium transition">
                  ✕
                </span>
              ) : (
                <Image
                  src="/images/search.svg"
                  alt="검색 아이콘"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              )}
            </button>

            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
              aria-label="메뉴"
            >
              <span
                className={`block h-0.5 w-5 bg-white rounded transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-white rounded transition-all duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-white rounded transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* 검색바 슬라이드 다운 */}
        <div
          className={`overflow-hidden transition-all duration-300 absolute top-full left-0 right-0 bg-zinc-950 bg-transparent ${
            searchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <form
            onSubmit={handleSearch}
            className="px-6 py-4 flex items-center justify-end gap-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="영화, TV 시리즈 검색..."
              className="flex-1 md:flex-none md:w-72 bg-zinc-800 text-white text-sm rounded-lg px-4 py-2 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition whitespace-nowrap"
            >
              검색
            </button>
          </form>
        </div>
      </nav>

      {/* 오버레이 */}
      <div
        className={`fixed inset-0 z-30 bg-black/60 transition-opacity duration-300 md:hidden ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* 드로어 패널 */}
      <div
        className={`fixed top-0 right-0 z-40 h-full w-64 bg-zinc-900 shadow-2xl transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end px-6 py-4 border-b border-zinc-800">
          <button
            onClick={() => setMenuOpen(false)}
            className="text-zinc-400 hover:text-white transition text-lg"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col px-4 py-6 gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition ${
                isActive(link.href)
                  ? "bg-red-600/20 text-white border border-red-600/40"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}
