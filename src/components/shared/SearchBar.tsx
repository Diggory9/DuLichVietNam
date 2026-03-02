"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { QuickSearchResult } from "@/types";
import { CATEGORY_LABELS, type Category } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QuickSearchResult | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(null);
      setOpen(false);
      return;
    }
    try {
      const res = await fetch(
        `${API_URL}/api/destinations/quick-search?q=${encodeURIComponent(q)}`,
        { cache: "no-store" }
      );
      if (!res.ok) return;
      const json = await res.json();
      setResults(json.data);
      setOpen(true);
    } catch {
      // ignore
    }
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(value), 300);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/kham-pha?q=${encodeURIComponent(query.trim())}`);
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasResults =
    results &&
    (results.destinations.length > 0 || results.provinces.length > 0);

  return (
    <div ref={wrapperRef} className={`relative ${className || ""}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Tìm kiếm địa danh..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
        />
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </form>

      {open && hasResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
          {results!.destinations.length > 0 && (
            <div>
              <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">
                Địa danh
              </p>
              {results!.destinations.map((d) => (
                <Link
                  key={d.slug}
                  href={`/dia-danh/${d.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">
                    {CATEGORY_LABELS[d.category as Category] || d.category}
                  </span>
                  <span className="text-sm text-gray-700">{d.name}</span>
                </Link>
              ))}
            </div>
          )}

          {results!.provinces.length > 0 && (
            <div className="border-t border-gray-50">
              <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">
                Tỉnh thành
              </p>
              {results!.provinces.map((p) => (
                <Link
                  key={p.slug}
                  href={`/tinh/${p.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-xs bg-accent-50 text-accent-600 px-2 py-0.5 rounded-full">
                    Tỉnh
                  </span>
                  <span className="text-sm text-gray-700">{p.name}</span>
                </Link>
              ))}
            </div>
          )}

          <Link
            href={`/kham-pha?q=${encodeURIComponent(query)}`}
            onClick={() => setOpen(false)}
            className="block px-3 py-2.5 text-center text-sm text-primary-600 font-medium hover:bg-primary-50 border-t transition-colors"
          >
            Xem tất cả kết quả
          </Link>
        </div>
      )}
    </div>
  );
}
