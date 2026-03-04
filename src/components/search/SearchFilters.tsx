"use client";

import { useState } from "react";
import type { SearchParams, Province } from "@/types";
import { CATEGORY_LABELS, REGION_LABELS, type Category, type Region } from "@/types";

interface SearchFiltersProps {
  params: SearchParams;
  provinces: Province[];
  onChange: (params: Partial<SearchParams>) => void;
  onReset: () => void;
}

const categories = Object.entries(CATEGORY_LABELS) as [Category, string][];
const regions = Object.entries(REGION_LABELS) as [Region, string][];

const sortOptions = [
  { value: "order", label: "Mặc định" },
  { value: "name", label: "Tên A-Z" },
  { value: "newest", label: "Mới nhất" },
  { value: "featured", label: "Nổi bật" },
  { value: "rating", label: "Đánh giá cao" },
];

const priceRanges = [
  { value: "free", label: "Miễn phí" },
  { value: "under100k", label: "< 100k" },
  { value: "100k-500k", label: "100k-500k" },
  { value: "over500k", label: "> 500k" },
];

const distanceOptions = [
  { value: "10", label: "10 km" },
  { value: "25", label: "25 km" },
  { value: "50", label: "50 km" },
  { value: "100", label: "100 km" },
];

export default function SearchFilters({
  params,
  provinces,
  onChange,
  onReset,
}: SearchFiltersProps) {
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");

  const activeCount = [
    params.q,
    params.category,
    params.region,
    params.province,
    params.minRating,
    params.priceRange,
    params.nearLat,
  ].filter(Boolean).length;

  const currentRating = params.minRating ? parseInt(params.minRating) : 0;

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      setGeoError("Trình duyệt không hỗ trợ định vị");
      return;
    }
    setGeoLoading(true);
    setGeoError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({
          nearLat: String(pos.coords.latitude),
          nearLng: String(pos.coords.longitude),
          maxDistance: params.maxDistance || "50",
          sort: "distance",
          page: "1",
        });
        setGeoLoading(false);
      },
      () => {
        setGeoError("Không thể xác định vị trí");
        setGeoLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const clearNearMe = () => {
    onChange({
      nearLat: "",
      nearLng: "",
      maxDistance: "",
      sort: params.sort === "distance" ? "order" : params.sort,
      page: "1",
    });
  };

  return (
    <div className="space-y-5">
      {/* Search input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={params.q || ""}
          onChange={(e) => onChange({ q: e.target.value, page: "1" })}
          placeholder="Tìm kiếm địa danh..."
          className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none"
        />
        <button
          onClick={() => onChange({ page: "1" })}
          className="px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Tìm kiếm
        </button>
      </div>

      {/* Category chips */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
          Danh mục
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map(([value, label]) => (
            <button
              key={value}
              onClick={() =>
                onChange({
                  category: params.category === value ? "" : value,
                  page: "1",
                })
              }
              className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${
                params.category === value
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Region chips */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
          Vùng miền
        </p>
        <div className="flex flex-wrap gap-2">
          {regions.map(([value, label]) => (
            <button
              key={value}
              onClick={() =>
                onChange({
                  region: params.region === value ? "" : value,
                  page: "1",
                })
              }
              className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${
                params.region === value
                  ? "bg-accent-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating filter */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
          Đánh giá tối thiểu
        </p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() =>
                onChange({
                  minRating: currentRating === star ? "" : String(star),
                  page: "1",
                })
              }
              className="p-0.5 transition-colors"
              aria-label={`${star} sao trở lên`}
            >
              <svg
                className={`w-6 h-6 ${
                  star <= currentRating
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600"
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
          {currentRating > 0 && (
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              {currentRating}+ sao
            </span>
          )}
        </div>
      </div>

      {/* Price range chips */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
          Giá vé
        </p>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((pr) => (
            <button
              key={pr.value}
              onClick={() =>
                onChange({
                  priceRange: params.priceRange === pr.value ? "" : pr.value,
                  page: "1",
                })
              }
              className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${
                params.priceRange === pr.value
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {pr.label}
            </button>
          ))}
        </div>
      </div>

      {/* Near me + Province + Sort */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Near me button */}
        {params.nearLat ? (
          <div className="flex items-center gap-2">
            <span className="px-3 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-lg font-medium">
              Gần tôi
            </span>
            <select
              value={params.maxDistance || "50"}
              onChange={(e) =>
                onChange({ maxDistance: e.target.value, sort: "distance", page: "1" })
              }
              className="px-2 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-200 outline-none"
            >
              {distanceOptions.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            <button
              onClick={clearNearMe}
              className="text-xs text-red-500 hover:text-red-600 font-medium"
            >
              Tắt
            </button>
          </div>
        ) : (
          <button
            onClick={handleNearMe}
            disabled={geoLoading}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {geoLoading ? "Đang định vị..." : "Gần tôi"}
          </button>
        )}
        {geoError && (
          <span className="text-xs text-red-500">{geoError}</span>
        )}

        <select
          value={params.province || ""}
          onChange={(e) => onChange({ province: e.target.value, page: "1" })}
          className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-200 outline-none"
        >
          <option value="">Tất cả tỉnh thành</option>
          {provinces.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={params.sort || "order"}
          onChange={(e) => onChange({ sort: e.target.value })}
          className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-200 outline-none"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Active filters */}
      {activeCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            {activeCount} bộ lọc đang áp dụng
          </span>
          <button
            onClick={onReset}
            className="text-xs text-red-500 hover:text-red-600 font-medium"
          >
            Xóa tất cả
          </button>
        </div>
      )}
    </div>
  );
}
