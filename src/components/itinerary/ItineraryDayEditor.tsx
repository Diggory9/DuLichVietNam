"use client";

import { useState } from "react";
import type { ItineraryDay, Destination } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ItineraryDayEditorProps {
  day: ItineraryDay;
  destinations: Record<string, Destination>;
  onChange: (day: ItineraryDay) => void;
  onRemove: () => void;
}

export default function ItineraryDayEditor({
  day,
  destinations,
  onChange,
  onRemove,
}: ItineraryDayEditorProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<{ name: string; slug: string }[]>([]);
  const [searching, setSearching] = useState(false);

  const DAY_COLORS = ["bg-blue-500", "bg-orange-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-teal-500", "bg-red-500"];
  const color = DAY_COLORS[(day.dayNumber - 1) % DAY_COLORS.length];

  async function handleSearch(q: string) {
    setSearch(q);
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`${API_URL}/api/destinations/quick-search?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      setResults(
        (json.data?.destinations || []).filter(
          (d: { slug: string }) => !day.destinationSlugs.includes(d.slug)
        )
      );
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  function addDestination(slug: string) {
    onChange({
      ...day,
      destinationSlugs: [...day.destinationSlugs, slug],
    });
    setSearch("");
    setResults([]);
  }

  function removeDestination(slug: string) {
    onChange({
      ...day,
      destinationSlugs: day.destinationSlugs.filter((s) => s !== slug),
    });
  }

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${color}`} />
          <h3 className="font-semibold text-gray-900">Ngày {day.dayNumber}</h3>
        </div>
        <button
          onClick={onRemove}
          className="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Xoá ngày
        </button>
      </div>

      {/* Search destination */}
      <div className="relative mb-3">
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Tìm địa danh..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        {(results.length > 0 || searching) && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1 max-h-48 overflow-auto">
            {searching && (
              <div className="px-3 py-2 text-sm text-gray-400">Đang tìm...</div>
            )}
            {results.map((r) => (
              <button
                key={r.slug}
                onClick={() => addDestination(r.slug)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                {r.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected destinations */}
      <div className="space-y-2 mb-3">
        {day.destinationSlugs.map((slug, idx) => (
          <div
            key={slug}
            className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
          >
            <span className="text-sm text-gray-700">
              <span className="text-gray-400 mr-2">{idx + 1}.</span>
              {destinations[slug]?.name || slug}
            </span>
            <button
              onClick={() => removeDestination(slug)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        {day.destinationSlugs.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-2">
            Chưa có địa danh nào
          </p>
        )}
      </div>

      {/* Notes */}
      <textarea
        value={day.notes || ""}
        onChange={(e) => onChange({ ...day, notes: e.target.value })}
        placeholder="Ghi chú cho ngày này..."
        rows={2}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
      />
    </div>
  );
}
