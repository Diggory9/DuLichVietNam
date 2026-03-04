"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Destination, SearchParams, PaginationInfo, Province } from "@/types";
import SearchFilters from "./SearchFilters";
import DestinationCardClient from "./DestinationCardClient";
import DestinationCardSkeleton from "@/components/skeletons/DestinationCardSkeleton";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageRef = useRef(1);

  const params: SearchParams = {
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    region: searchParams.get("region") || "",
    province: searchParams.get("province") || "",
    sort: searchParams.get("sort") || "order",
    minRating: searchParams.get("minRating") || "",
    priceRange: searchParams.get("priceRange") || "",
    nearLat: searchParams.get("nearLat") || "",
    nearLng: searchParams.get("nearLng") || "",
    maxDistance: searchParams.get("maxDistance") || "",
  };

  const updateURL = useCallback(
    (newParams: Partial<SearchParams>) => {
      const merged = { ...params, ...newParams };
      const query = new URLSearchParams();
      Object.entries(merged).forEach(([k, v]) => {
        if (v && k !== "page") query.set(k, v as string);
      });
      router.push(`/kham-pha?${query.toString()}`, { scroll: false });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams.toString()]
  );

  useEffect(() => {
    fetch(`${API_URL}/api/provinces`)
      .then((r) => r.json())
      .then((json) => setProvinces(json.data || []))
      .catch(() => {});
  }, []);

  // Initial load & filter changes
  useEffect(() => {
    pageRef.current = 1;
    setLoading(true);
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) query.set(k, v as string);
    });
    query.set("page", "1");
    fetch(`${API_URL}/api/destinations/search?${query}`)
      .then((r) => r.json())
      .then((json) => {
        setDestinations(json.data || []);
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
        setDestinations([]);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const loadMore = useCallback(() => {
    if (loadingMore) return;
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    setLoadingMore(true);

    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) query.set(k, v as string);
    });
    query.set("page", String(nextPage));

    fetch(`${API_URL}/api/destinations/search?${query}`)
      .then((r) => r.json())
      .then((json) => {
        setDestinations((prev) => [...prev, ...(json.data || [])]);
        setPagination(
          json.pagination || pagination
        );
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString(), loadingMore]);

  const hasMore = pagination.page < pagination.totalPages;
  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isLoading: loading || loadingMore,
    onLoadMore: loadMore,
  });

  function handleReset() {
    router.push("/kham-pha");
  }

  return (
    <div className="space-y-8">
      <SearchFilters
        params={params}
        provinces={provinces}
        onChange={updateURL}
        onReset={handleReset}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <DestinationCardSkeleton key={i} />
          ))}
        </div>
      ) : destinations.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 dark:text-gray-500 text-lg">Không tìm thấy kết quả</p>
          <p className="text-gray-300 dark:text-gray-600 text-sm mt-2">
            Thử thay đổi từ khóa hoặc bộ lọc
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tìm thấy <span className="font-semibold text-gray-700 dark:text-gray-200">{pagination.total}</span> kết quả
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d) => (
              <DestinationCardClient key={d.id || d.slug} destination={d} />
            ))}
          </div>

          {/* Sentinel for infinite scroll */}
          <div ref={sentinelRef} className="h-1" />

          {loadingMore && (
            <div className="flex justify-center py-6">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-sm">Đang tải thêm...</span>
              </div>
            </div>
          )}

          {!hasMore && destinations.length > 0 && (
            <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">
              Đã hiển thị tất cả {pagination.total} kết quả
            </p>
          )}
        </>
      )}
    </div>
  );
}
