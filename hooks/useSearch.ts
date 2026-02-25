import { useState, useEffect } from "react";
import { searchMulti } from "@/lib/api";
import { Movie } from "@/dto/data";

export interface SearchResult extends Movie {
  media_type: "movie" | "tv" | "person";
}

export function useSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const res = await searchMulti(query);

        // person 제외, 영화 + TV만
        const filtered = res.data.results.filter(
          (item: SearchResult) =>
            item.media_type === "movie" || item.media_type === "tv",
        );
        setResults(filtered);
        setTotalResults(res.data.total_results);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return { results, isLoading, totalResults };
}
