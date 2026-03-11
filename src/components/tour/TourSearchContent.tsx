"use client";

import { useState, useEffect, useCallback } from "react";
import TourSearchFilters from "@/components/tour/TourSearchFilters";
import TourCard from "@/components/tour/TourCard";
import TourCardSkeleton from "@/components/tour/TourCardSkeleton";
import type { Tour, TourSearchParams, PaginationInfo } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function TourSearchContent() {
  const [filters, setFilters] = useState<TourSearchParams>({
    q: "",
    province: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minDays: "",
    maxDays: "",
    difficulty: "",
    sort: "",
    page: "1",
    limit: "12",
  });
  const [tours, setTours] = useState<Tour[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchTours = useCallback(async (params: TourSearchParams) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v) query.set(k, v);
      });
      const res = await fetch(`${API_URL}/api/tours/search?${query}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setTours(json.data || []);
      setPagination(
        json.pagination || {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 0,
        }
      );
    } catch {
      setTours([]);
      setPagination({ page: 1, limit: 12, total: 0, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchTours(filters);
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters, fetchTours]);

  const handleFiltersChange = (newFilters: TourSearchParams) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page: String(page) }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <TourSearchFilters filters={filters} onChange={handleFiltersChange} />

      {/* Results count */}
      {!loading && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tìm thấy{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {pagination.total}
            </span>{" "}
            tour
          </p>
        </div>
      )}

      {/* Tour grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, i) => (
            <TourCardSkeleton key={i} />
          ))}
        </div>
      ) : tours.length === 0 ? (
        <div className="text-center py-16">
          <svg
            className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Không tìm thấy tour nào
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Hãy thử thay đổi bộ lọc để tìm tour phù hợp.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter((page) => {
              const current = pagination.page;
              return (
                page === 1 ||
                page === pagination.totalPages ||
                Math.abs(page - current) <= 2
              );
            })
            .reduce<(number | "ellipsis")[]>((acc, page, idx, arr) => {
              if (idx > 0 && page - (arr[idx - 1] as number) > 1) {
                acc.push("ellipsis");
              }
              acc.push(page);
              return acc;
            }, [])
            .map((item, idx) =>
              item === "ellipsis" ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-gray-400 dark:text-gray-500"
                >
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => handlePageChange(item)}
                  className={`min-w-[40px] px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                    item === pagination.page
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-500/25"
                      : "border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750"
                  }`}
                >
                  {item}
                </button>
              )
            )}

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
