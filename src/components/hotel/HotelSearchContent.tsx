"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Hotel, HotelSearchParams, PaginationInfo, Province } from "@/types";
import HotelSearchFilters from "./HotelSearchFilters";
import HotelCard from "./HotelCard";
import HotelCardSkeleton from "./HotelCardSkeleton";
import Pagination from "@/components/search/Pagination";
import { API_URL } from "@/lib/api-config";

export default function HotelSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);

  const params: HotelSearchParams = {
    q: searchParams.get("q") || "",
    province: searchParams.get("province") || "",
    minStars: searchParams.get("minStars") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    amenities: searchParams.get("amenities") || "",
    sort: searchParams.get("sort") || "order",
    page: searchParams.get("page") || "1",
    limit: searchParams.get("limit") || "12",
  };

  const updateURL = useCallback(
    (newParams: Partial<HotelSearchParams>) => {
      const merged = { ...params, ...newParams };
      const query = new URLSearchParams();
      Object.entries(merged).forEach(([k, v]) => {
        if (v && v !== "order" && k !== "limit") query.set(k, v as string);
      });
      router.push(`/khach-san?${query.toString()}`, { scroll: false });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams.toString()]
  );

  // Fetch provinces list
  useEffect(() => {
    fetch(`${API_URL}/api/provinces`)
      .then((r) => r.json())
      .then((json) => setProvinces(json.data || []))
      .catch(() => {});
  }, []);

  // Fetch hotels on filter changes
  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) query.set(k, v as string);
    });

    fetch(`${API_URL}/api/hotels/search?${query}`)
      .then((r) => r.json())
      .then((json) => {
        setHotels(json.data || []);
        setPagination(
          json.pagination || {
            page: 1,
            limit: 12,
            total: 0,
            totalPages: 0,
          }
        );
      })
      .catch(() => {
        setHotels([]);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  function handleReset() {
    router.push("/khach-san");
  }

  function handlePageChange(page: number) {
    updateURL({ page: String(page) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="space-y-8">
      <HotelSearchFilters
        params={params}
        provinces={provinces}
        onChange={updateURL}
        onReset={handleReset}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <HotelCardSkeleton key={i} />
          ))}
        </div>
      ) : hotels.length === 0 ? (
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p className="mt-4 text-gray-400 dark:text-gray-500 text-lg">
            Không tìm thấy khách sạn
          </p>
          <p className="text-gray-300 dark:text-gray-600 text-sm mt-2">
            Thử thay đổi từ khóa hoặc bộ lọc
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tìm thấy{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {pagination.total}
              </span>{" "}
              khách sạn
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.slug} hotel={hotel} />
            ))}
          </div>

          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
