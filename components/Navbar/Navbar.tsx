"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-zinc-950"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-16 py-4">
        <div className="flex items-center gap-8">
          <span className="text-red-600 font-black text-2xl tracking-tight">
            MOVIEFLIX
          </span>
          <div className="hidden md:flex gap-6 text-sm text-zinc-300">
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
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/search"
            className="text-white text-xl hover:text-zinc-300 transition"
          >
            🔍
          </Link>
        </div>
      </div>
    </nav>
  );
}
