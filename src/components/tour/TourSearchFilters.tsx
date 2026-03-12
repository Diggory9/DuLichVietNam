"use client";

import { useState, useEffect } from "react";
import type { TourSearchParams, Province } from "@/types";
import { TOUR_CATEGORY_LABELS } from "@/types";
import { API_URL } from "@/lib/api-config";

const DIFFICULTY_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "de", label: "Dễ" },
  { value: "trung-binh", label: "Trung bình" },
  { value: "kho", label: "Khó" },
];

const SORT_OPTIONS = [
  { value: "", label: "Mặc định" },
  { value: "price_asc", label: "Giá thấp đến cao" },
  { value: "price_desc", label: "Giá cao đến thấp" },
  { value: "duration", label: "Ngắn nhất" },
  { value: "rating", label: "Đánh giá cao nhất" },
  { value: "newest", label: "Mới nhất" },
];

interface TourSearchFiltersProps {
  filters: TourSearchParams;
  onChange: (filters: TourSearchParams) => void;
}

export default function TourSearchFilters({
  filters,
  onChange,
}: TourSearchFiltersProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);

  useEffect(() => {
    async function loadProvinces() {
      try {
        const res = await fetch(`${API_URL}/api/provinces`);
        if (res.ok) {
          const json = await res.json();
          setProvinces(json.data || []);
        }
      } catch {
        // Ignore fetch errors
      }
    }
    loadProvinces();
  }, []);

  const handleChange = (key: keyof TourSearchParams, value: string) => {
    onChange({ ...filters, [key]: value, page: "1" });
  };

  const selectClass =
    "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 bg-white transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100";

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Bộ lọc tìm kiếm
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Text search */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Tìm kiếm
          </label>
          <input
            type="text"
            value={filters.q || ""}
            onChange={(e) => handleChange("q", e.target.value)}
            placeholder="Nhập tên tour..."
            className={selectClass}
          />
        </div>

        {/* Province select */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Tỉnh thành
          </label>
          <select
            value={filters.province || ""}
            onChange={(e) => handleChange("province", e.target.value)}
            className={selectClass}
          >
            <option value="">Tất cả tỉnh thành</option>
            {provinces.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category select */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Loại tour
          </label>
          <select
            value={filters.category || ""}
            onChange={(e) => handleChange("category", e.target.value)}
            className={selectClass}
          >
            <option value="">Tất cả loại</option>
            {Object.entries(TOUR_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty select */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Độ khó
          </label>
          <select
            value={filters.difficulty || ""}
            onChange={(e) => handleChange("difficulty", e.target.value)}
            className={selectClass}
          >
            {DIFFICULTY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Min price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Giá từ (VND)
          </label>
          <input
            type="number"
            value={filters.minPrice || ""}
            onChange={(e) => handleChange("minPrice", e.target.value)}
            placeholder="0"
            min={0}
            step={100000}
            className={selectClass}
          />
        </div>

        {/* Max price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Giá đến (VND)
          </label>
          <input
            type="number"
            value={filters.maxPrice || ""}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
            placeholder="50.000.000"
            min={0}
            step={100000}
            className={selectClass}
          />
        </div>

        {/* Min duration */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Số ngày từ
          </label>
          <input
            type="number"
            value={filters.minDays || ""}
            onChange={(e) => handleChange("minDays", e.target.value)}
            placeholder="1"
            min={1}
            className={selectClass}
          />
        </div>

        {/* Max duration */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Số ngày đến
          </label>
          <input
            type="number"
            value={filters.maxDays || ""}
            onChange={(e) => handleChange("maxDays", e.target.value)}
            placeholder="30"
            min={1}
            className={selectClass}
          />
        </div>

        {/* Sort */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Sắp xếp
          </label>
          <select
            value={filters.sort || ""}
            onChange={(e) => handleChange("sort", e.target.value)}
            className={selectClass}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear filters */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() =>
            onChange({
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
            })
          }
          className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          Xoá bộ lọc
        </button>
      </div>
    </div>
  );
}
