"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface CompareContextType {
  compareSlugs: string[];
  addToCompare: (slug: string) => void;
  removeFromCompare: (slug: string) => void;
  isInCompare: (slug: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType>({
  compareSlugs: [],
  addToCompare: () => {},
  removeFromCompare: () => {},
  isInCompare: () => false,
  clearCompare: () => {},
});

const STORAGE_KEY = "dulichvietnam_compare";
const MAX_COMPARE = 3;

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCompareSlugs(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compareSlugs));
    } catch {}
  }, [compareSlugs]);

  const addToCompare = useCallback((slug: string) => {
    setCompareSlugs((prev) => {
      if (prev.includes(slug) || prev.length >= MAX_COMPARE) return prev;
      return [...prev, slug];
    });
  }, []);

  const removeFromCompare = useCallback((slug: string) => {
    setCompareSlugs((prev) => prev.filter((s) => s !== slug));
  }, []);

  const isInCompare = useCallback(
    (slug: string) => compareSlugs.includes(slug),
    [compareSlugs]
  );

  const clearCompare = useCallback(() => {
    setCompareSlugs([]);
  }, []);

  return (
    <CompareContext.Provider
      value={{ compareSlugs, addToCompare, removeFromCompare, isInCompare, clearCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
