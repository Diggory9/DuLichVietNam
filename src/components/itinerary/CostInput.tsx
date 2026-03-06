"use client";

import { useState } from "react";
import type { ItineraryDay } from "@/types";

interface CostInputProps {
  day: ItineraryDay;
  onChange: (day: ItineraryDay) => void;
}

function formatVND(value: number | undefined): string {
  if (!value) return "";
  return value.toLocaleString("vi-VN");
}

function parseVND(value: string): number | undefined {
  const num = parseInt(value.replace(/\D/g, ""), 10);
  return isNaN(num) ? undefined : num;
}

const COST_FIELDS = [
  { key: "accommodationCost" as const, label: "Lưu trú" },
  { key: "transportCost" as const, label: "Di chuyển" },
  { key: "mealCost" as const, label: "Ăn uống" },
  { key: "otherCost" as const, label: "Khác" },
];

export default function CostInput({ day, onChange }: CostInputProps) {
  const [open, setOpen] = useState(false);

  const total =
    (day.accommodationCost || 0) +
    (day.transportCost || 0) +
    (day.mealCost || 0) +
    (day.otherCost || 0);

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        Chi phí
        {total > 0 && (
          <span className="text-primary-600 font-medium">
            ({formatVND(total)} VND)
          </span>
        )}
      </button>

      {open && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {COST_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs text-gray-500 mb-1">{label}</label>
              <input
                type="text"
                value={formatVND(day[key])}
                onChange={(e) =>
                  onChange({ ...day, [key]: parseVND(e.target.value) })
                }
                placeholder="0"
                className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          ))}
          {total > 0 && (
            <div className="col-span-2 text-right text-sm font-medium text-gray-700">
              Tổng ngày: {formatVND(total)} VND
            </div>
          )}
        </div>
      )}
    </div>
  );
}
