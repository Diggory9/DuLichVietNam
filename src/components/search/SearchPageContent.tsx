"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Destination, SearchParams, PaginationInfo, Province } from "@/types";
import SearchFilters from "./SearchFilters";
import DestinationCardClient from "./DestinationCardClient";
import Pagination from "./Pagination";

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

  const params: SearchParams = {
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    region: searchParams.get("region") || "",
    province: searchParams.get("province") || "",
    sort: searchParams.get("sort") || "order",
    page: searchParams.get("page") || "1",
  };

  const updateURL = useCallback(
    (newParams: Partial<SearchParams>) => {
      const merged = { ...params, ...newParams };
      const query = new URLSearchParams();
      Object.entries(merged).forEach(([k, v]) => {
        if (v && v !== "order" && v !== "1") query.set(k, v);
        else if (k === "sort" && v && v !== "order") query.set(k, v);
        else if (k === "page" && v && v !== "1") query.set(k, v);
        else if (k === "q" && v) query.set(k, v);
        else if (k === "category" && v) query.set(k, v);
        else if (k === "region" && v) query.set(k, v);
        else if (k === "province" && v) query.set(k, v);
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

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) query.set(k, v);
    });
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
        <div className="text-center py-16 text-gray-400">Đang tìm kiếm...</div>
      ) : destinations.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">Không tìm thấy kết quả</p>
          <p className="text-gray-300 text-sm mt-2">
            Thử thay đổi từ khóa hoặc bộ lọc
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Tìm thấy <span className="font-semibold text-gray-700">{pagination.total}</span> kết quả
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d) => (
              <DestinationCardClient key={d.id || d.slug} destination={d} />
            ))}
          </div>

          <Pagination
            pagination={pagination}
            onPageChange={(p) => updateURL({ page: String(p) })}
          />
        </>
      )}
    </div>
  );
}
