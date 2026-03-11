"use client";

import { useState } from "react";
import type { HotelSearchParams, Province } from "@/types";

interface HotelSearchFiltersProps {
  params: HotelSearchParams;
  provinces: Province[];
  onChange: (params: Partial<HotelSearchParams>) => void;
  onReset: () => void;
}

const sortOptions = [
  { value: "order", label: "Mặc định" },
  { value: "price_asc", label: "Giá thấp đến cao" },
  { value: "price_desc", label: "Giá cao đến thấp" },
  { value: "rating", label: "Đánh giá cao" },
  { value: "stars", label: "Nhiều sao nhất" },
  { value: "newest", label: "Mới nhất" },
];

export default function HotelSearchFilters({
  params,
  provinces,
  onChange,
  onReset,
}: HotelSearchFiltersProps) {
  const [minPriceInput, setMinPriceInput] = useState(params.minPrice || "");
  const [maxPriceInput, setMaxPriceInput] = useState(params.maxPrice || "");

  const currentStars = params.minStars ? parseInt(params.minStars) : 0;

  const activeCount = [
    params.q,
    params.province,
    params.minStars,
    params.minPrice,
    params.maxPrice,
  ].filter(Boolean).length;

  const handlePriceApply = () => {
    onChange({
      minPrice: minPriceInput || undefined,
      maxPrice: maxPriceInput || undefined,
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
          placeholder="Tìm kiếm khách sạn..."
          className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none"
        />
        <button
          onClick={() => onChange({ page: "1" })}
          className="px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Tìm kiếm
        </button>
      </div>

      {/* Star rating filter */}
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-2">
          Hạng sao
        </p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() =>
                onChange({
                  minStars: currentStars === star ? "" : String(star),
                  page: "1",
                })
              }
              className="p-0.5 transition-colors"
              aria-label={`${star} sao trở lên`}
            >
              <svg
                className={`w-6 h-6 ${
                  star <= currentStars
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600"
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
          {currentStars > 0 && (
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              {currentStars}+ sao
            </span>
          )}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-2">
          Khoảng giá (VND)
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            placeholder="Giá tối thiểu"
            className="w-36 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-200 outline-none"
          />
          <span className="text-gray-400 dark:text-gray-500">-</span>
          <input
            type="number"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            placeholder="Giá tối đa"
            className="w-36 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-200 outline-none"
          />
          <button
            onClick={handlePriceApply}
            className="px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
          >
            Áp dụng
          </button>
        </div>
      </div>

      {/* Province + Sort */}
      <div className="flex flex-wrap gap-3 items-center">
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

      {/* Active filter count */}
      {activeCount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-gray-500">
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
