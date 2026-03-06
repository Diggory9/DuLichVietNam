"use client";

import { useCallback, useEffect, useState } from "react";

interface HistoryItem {
  slug: string;
  category: string;
  provinceSlug: string;
  viewedAt: number;
}

const STORAGE_KEY = "dulichvietnam_view_history";
const MAX_ITEMS = 50;

function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveHistory(items: HistoryItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function useViewHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addToHistory = useCallback(
    (destination: { slug: string; category: string; provinceSlug: string }) => {
      const current = loadHistory();
      const filtered = current.filter((h) => h.slug !== destination.slug);
      const updated = [
        { ...destination, viewedAt: Date.now() },
        ...filtered,
      ].slice(0, MAX_ITEMS);
      saveHistory(updated);
      setHistory(updated);
    },
    []
  );

  const getHistory = useCallback(() => history, [history]);

  const getTopCategories = useCallback(
    (n: number): string[] => {
      const counts: Record<string, number> = {};
      history.forEach((h) => {
        counts[h.category] = (counts[h.category] || 0) + 1;
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(([cat]) => cat);
    },
    [history]
  );

  const getTopProvinces = useCallback(
    (n: number): string[] => {
      const counts: Record<string, number> = {};
      history.forEach((h) => {
        counts[h.provinceSlug] = (counts[h.provinceSlug] || 0) + 1;
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(([prov]) => prov);
    },
    [history]
  );

  const getViewedSlugs = useCallback(
    (): string[] => history.map((h) => h.slug),
    [history]
  );

  return { addToHistory, getHistory, getTopCategories, getTopProvinces, getViewedSlugs };
}
