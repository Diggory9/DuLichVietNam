"use client";

import type { PaginationInfo } from "@/types";

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages } = pagination;

  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Trước
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-10 h-10 text-sm rounded-lg transition-colors ${
              p === page
                ? "bg-primary-600 text-white"
                : "border border-gray-200 hover:bg-gray-50 text-gray-700"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Sau
      </button>
    </div>
  );
}
