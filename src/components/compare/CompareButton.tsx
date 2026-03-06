"use client";

import { useCompare } from "./CompareProvider";

interface CompareButtonProps {
  slug: string;
  size?: "sm" | "md";
}

export default function CompareButton({ slug, size = "sm" }: CompareButtonProps) {
  const { addToCompare, removeFromCompare, isInCompare, compareSlugs } = useCompare();
  const active = isInCompare(slug);
  const disabled = !active && compareSlugs.length >= 3;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (active) {
      removeFromCompare(slug);
    } else if (!disabled) {
      addToCompare(slug);
    }
  };

  const sizeClasses = size === "sm"
    ? "w-8 h-8 text-sm"
    : "w-10 h-10 text-base";

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      title={
        active
          ? "Bỏ so sánh"
          : disabled
            ? "Tối đa 3 địa danh"
            : "Thêm vào so sánh"
      }
      className={`${sizeClasses} rounded-full flex items-center justify-center transition-all ${
        active
          ? "bg-primary-600 text-white shadow-md"
          : disabled
            ? "bg-white/70 text-gray-300 cursor-not-allowed"
            : "bg-white/90 text-gray-600 hover:bg-primary-100 hover:text-primary-600"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={size === "sm" ? "w-4 h-4" : "w-5 h-5"}
      >
        <path d="M16 3 L21 8 L16 13" />
        <path d="M21 8 L9 8" />
        <path d="M8 21 L3 16 L8 11" />
        <path d="M3 16 L15 16" />
      </svg>
    </button>
  );
}
