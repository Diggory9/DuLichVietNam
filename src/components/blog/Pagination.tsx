"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { PaginationInfo } from "@/types";

interface PaginationProps {
  pagination: PaginationInfo;
}

export default function BlogPagination({ pagination }: PaginationProps) {
  const searchParams = useSearchParams();
  const { page, totalPages } = pagination;

  if (totalPages <= 1) return null;

  function buildHref(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (p > 1) {
      params.set("page", String(p));
    } else {
      params.delete("page");
    }
    return `/bai-viet?${params.toString()}`;
  }

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
    <div className="flex items-center justify-center gap-2 mt-12">
      {page > 1 ? (
        <Link
          href={buildHref(page - 1)}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Trước
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm rounded-lg border border-gray-200 opacity-40 cursor-not-allowed">
          Trước
        </span>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={`w-10 h-10 flex items-center justify-center text-sm rounded-lg transition-colors ${
              p === page
                ? "bg-primary-600 text-white"
                : "border border-gray-200 hover:bg-gray-50 text-gray-700"
            }`}
          >
            {p}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link
          href={buildHref(page + 1)}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Sau
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm rounded-lg border border-gray-200 opacity-40 cursor-not-allowed">
          Sau
        </span>
      )}
    </div>
  );
}
