"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 검색창 열릴 때 자동 포커스
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setSearchOpen(false);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setSearchOpen(false);
      setQuery("");
    }
  };

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-zinc-950"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-16 py-4">
        <div className="flex items-center gap-8">
          <Link href="/">
            <span className="text-red-600 font-black text-2xl tracking-tight cursor-pointer">
              MOVIEFLIX
            </span>
          </Link>

          {/* 검색창 열렸을 때 링크 숨기기 */}
          {!searchOpen && (
            <div className="hidden md:flex gap-6 text-sm text-zinc-300">
              <Link href="/list" className="hover:text-white transition">
                영화
              </Link>
              <Link href="/search" className="hover:text-white transition">
                검색
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* 인라인 검색창 */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="영화, TV 시리즈 검색..."
                className="w-48 md:w-72 bg-zinc-800 text-white text-sm rounded-lg px-4 py-2 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
              />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setQuery("");
                }}
                className="text-zinc-400 hover:text-white transition text-sm"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="text-white text-xl hover:text-zinc-300 transition"
            >
              🔍
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
