"use client";

import type { ItineraryDay, Destination } from "@/types";

interface CostSummaryProps {
  days: ItineraryDay[];
  destinations: Record<string, Destination>;
  totalBudget?: number;
}

function formatVND(value: number): string {
  if (value === 0) return "0";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}tr`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`;
  return value.toLocaleString("vi-VN");
}

function parseEntryFee(fee?: string): number {
  if (!fee) return 0;
  const lower = fee.toLowerCase();
  if (lower.includes("miễn phí") || lower.includes("free")) return 0;
  const match = fee.match(/([\d.,]+)/);
  if (!match) return 0;
  const num = parseFloat(match[1].replace(/\./g, "").replace(",", "."));
  if (isNaN(num)) return 0;
  if (lower.includes("triệu") || lower.includes("tr")) return num * 1_000_000;
  if (lower.includes("k") || lower.includes("nghìn") || lower.includes("ngàn")) return num * 1_000;
  if (num < 1000) return num * 1_000;
  return num;
}

export default function CostSummary({ days, destinations, totalBudget }: CostSummaryProps) {
  const hasCosts = days.some(
    (d) =>
      (d.accommodationCost || 0) +
      (d.transportCost || 0) +
      (d.mealCost || 0) +
      (d.otherCost || 0) > 0
  );

  if (!hasCosts && !totalBudget) return null;

  const dayData = days.map((day) => {
    const entryFee = day.destinationSlugs.reduce((sum, slug) => {
      const dest = destinations[slug];
      return sum + parseEntryFee(dest?.entryFee);
    }, 0);

    const accommodation = day.accommodationCost || 0;
    const transport = day.transportCost || 0;
    const meal = day.mealCost || 0;
    const other = day.otherCost || 0;
    const dayTotal = entryFee + accommodation + transport + meal + other;

    return { dayNumber: day.dayNumber, entryFee, accommodation, transport, meal, other, dayTotal };
  });

  const totals = dayData.reduce(
    (acc, d) => ({
      entryFee: acc.entryFee + d.entryFee,
      accommodation: acc.accommodation + d.accommodation,
      transport: acc.transport + d.transport,
      meal: acc.meal + d.meal,
      other: acc.other + d.other,
      total: acc.total + d.dayTotal,
    }),
    { entryFee: 0, accommodation: 0, transport: 0, meal: 0, other: 0, total: 0 }
  );

  const budgetPercent = totalBudget ? Math.min(100, (totals.total / totalBudget) * 100) : 0;
  const overBudget = totalBudget ? totals.total > totalBudget : false;

  return (
    <div className="rounded-xl border border-gray-200 p-4 bg-white">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Tổng hợp chi phí
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
              <th className="py-2 pr-2">Ngày</th>
              <th className="py-2 px-2 text-right">Vé vào</th>
              <th className="py-2 px-2 text-right">Lưu trú</th>
              <th className="py-2 px-2 text-right">Di chuyển</th>
              <th className="py-2 px-2 text-right">Ăn uống</th>
              <th className="py-2 px-2 text-right">Khác</th>
              <th className="py-2 pl-2 text-right font-semibold">Tổng</th>
            </tr>
          </thead>
          <tbody>
            {dayData.map((d) => (
              <tr key={d.dayNumber} className="border-b border-gray-50">
                <td className="py-1.5 pr-2 text-gray-700">Ngày {d.dayNumber}</td>
                <td className="py-1.5 px-2 text-right text-gray-600">{d.entryFee ? formatVND(d.entryFee) : "-"}</td>
                <td className="py-1.5 px-2 text-right text-gray-600">{d.accommodation ? formatVND(d.accommodation) : "-"}</td>
                <td className="py-1.5 px-2 text-right text-gray-600">{d.transport ? formatVND(d.transport) : "-"}</td>
                <td className="py-1.5 px-2 text-right text-gray-600">{d.meal ? formatVND(d.meal) : "-"}</td>
                <td className="py-1.5 px-2 text-right text-gray-600">{d.other ? formatVND(d.other) : "-"}</td>
                <td className="py-1.5 pl-2 text-right font-medium text-gray-900">{formatVND(d.dayTotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-200 font-semibold text-gray-900">
              <td className="py-2 pr-2">TỔNG</td>
              <td className="py-2 px-2 text-right">{totals.entryFee ? formatVND(totals.entryFee) : "-"}</td>
              <td className="py-2 px-2 text-right">{totals.accommodation ? formatVND(totals.accommodation) : "-"}</td>
              <td className="py-2 px-2 text-right">{totals.transport ? formatVND(totals.transport) : "-"}</td>
              <td className="py-2 px-2 text-right">{totals.meal ? formatVND(totals.meal) : "-"}</td>
              <td className="py-2 px-2 text-right">{totals.other ? formatVND(totals.other) : "-"}</td>
              <td className="py-2 pl-2 text-right text-primary-600">{formatVND(totals.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Budget progress */}
      {totalBudget !== undefined && totalBudget > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Ngân sách: {formatVND(totalBudget)} VND</span>
            <span className={`font-medium ${overBudget ? "text-red-600" : "text-green-600"}`}>
              {overBudget ? "Vượt ngân sách!" : `Còn lại: ${formatVND(totalBudget - totals.total)}`}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all ${
                overBudget ? "bg-red-500" : budgetPercent > 80 ? "bg-yellow-500" : "bg-green-500"
              }`}
              style={{ width: `${Math.min(100, budgetPercent)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
