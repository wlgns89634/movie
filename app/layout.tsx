import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/context/QueryProvider";
import MovieModal from "@/components/Modal/MovieModal";
import Navbar from "@/components/Navbar/Navbar";

export const metadata: Metadata = {
  title: "MOVIEFLIX",
  description: "영화 스트리밍 서비스",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-zinc-950">
        <QueryProvider>
          <Navbar />
          {children}
          <MovieModal />
        </QueryProvider>
      </body>
    </html>
  );
}
