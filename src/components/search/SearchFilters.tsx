"use client";

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
];

export default function SearchFilters({
  params,
  provinces,
  onChange,
  onReset,
}: SearchFiltersProps) {
  const activeCount = [params.q, params.category, params.region, params.province].filter(
    Boolean
  ).length;

  return (
    <div className="space-y-5">
      {/* Search input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={params.q || ""}
          onChange={(e) => onChange({ q: e.target.value, page: "1" })}
          placeholder="Tìm kiếm địa danh..."
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none"
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
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Province + Sort selects */}
      <div className="flex flex-wrap gap-3">
        <select
          value={params.province || ""}
          onChange={(e) => onChange({ province: e.target.value, page: "1" })}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 outline-none"
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
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-200 outline-none"
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
