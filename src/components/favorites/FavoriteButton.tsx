"use client";

import { useFavorites } from "./FavoritesProvider";

interface FavoriteButtonProps {
  slug: string;
  size?: "sm" | "md";
}

export default function FavoriteButton({ slug, size = "sm" }: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const active = isFavorite(slug);
  const px = size === "md" ? 28 : 22;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(slug);
      }}
      className="transition-transform active:scale-125"
      aria-label={active ? "Bỏ yêu thích" : "Thêm yêu thích"}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill={active ? "#ef4444" : "none"}
        stroke={active ? "#ef4444" : "white"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: active ? "none" : "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
