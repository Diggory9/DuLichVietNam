"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { API_URL } from "@/lib/api-config";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
  favoritesCount: 0,
});

const STORAGE_KEY = "dulichvietnam_favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const syncedRef = useRef(false);

  // Load favorites: from server if authenticated, else localStorage
  useEffect(() => {
    if (isAuthenticated && token) {
      // Sync localStorage → server on first login
      const localFavs = getLocalFavorites();
      if (localFavs.length > 0 && !syncedRef.current) {
        syncedRef.current = true;
        fetch(`${API_URL}/api/users/me/favorites/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ slugs: localFavs }),
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.success) {
              setFavorites(json.data);
              localStorage.removeItem(STORAGE_KEY);
            }
          })
          .catch(() => {});
      } else {
        // Just fetch from server
        fetch(`${API_URL}/api/users/me/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.success) setFavorites(json.data);
          })
          .catch(() => {});
      }
    } else {
      // Not authenticated: use localStorage
      syncedRef.current = false;
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setFavorites(JSON.parse(stored));
        else setFavorites([]);
      } catch {
        setFavorites([]);
      }
    }
  }, [isAuthenticated, token]);

  // Save to localStorage when not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch {}
    }
  }, [favorites, isAuthenticated]);

  function getLocalFavorites(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  const toggleFavorite = useCallback((slug: string) => {
    if (isAuthenticated && token) {
      // Toggle on server
      fetch(`${API_URL}/api/users/me/favorites/${slug}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) setFavorites(json.data);
        })
        .catch(() => {});
      // Optimistic update
      setFavorites((prev) =>
        prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
      );
    } else {
      // localStorage only
      setFavorites((prev) =>
        prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
      );
    }
  }, [isAuthenticated, token]);

  const isFavorite = useCallback(
    (slug: string) => favorites.includes(slug),
    [favorites]
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, favoritesCount: favorites.length }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
