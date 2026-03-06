"use client";

import Image from "next/image";
import Link from "next/link";
import StarRating from "@/components/shared/StarRating";
import Badge from "@/components/ui/Badge";
import type { Destination } from "@/types";
import { CATEGORY_LABELS } from "@/types";

interface ComparisonTableProps {
  destinations: Destination[];
}

interface RowDef {
  label: string;
  render: (d: Destination) => React.ReactNode;
  highlight?: "max" | "min";
  getValue?: (d: Destination) => number | null;
}

export default function ComparisonTable({ destinations }: ComparisonTableProps) {
  const rows: RowDef[] = [
    {
      label: "Ảnh",
      render: (d) => (
        <Link href={`/dia-danh/${d.slug}`} className="block relative w-full h-36 rounded-xl overflow-hidden">
          <Image
            src={d.images[0]?.src || "/placeholder.jpg"}
            alt={d.images[0]?.alt || d.name}
            fill
            className="object-cover"
            sizes="300px"
          />
        </Link>
      ),
    },
    {
      label: "Tên",
      render: (d) => (
        <Link href={`/dia-danh/${d.slug}`} className="font-bold text-primary-600 hover:underline">
          {d.name}
        </Link>
      ),
    },
    {
      label: "Danh mục",
      render: (d) => <Badge variant="accent">{CATEGORY_LABELS[d.category]}</Badge>,
    },
    {
      label: "Đánh giá",
      render: (d) =>
        (d.reviewCount ?? 0) > 0 ? (
          <div className="flex items-center gap-1.5">
            <StarRating rating={d.averageRating ?? 0} size="sm" showValue />
            <span className="text-xs text-gray-500">({d.reviewCount})</span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">Chưa có</span>
        ),
      highlight: "max",
      getValue: (d) => d.averageRating ?? null,
    },
    {
      label: "Giá vé",
      render: (d) => (
        <span className="font-semibold">{d.entryFee || "Miễn phí"}</span>
      ),
    },
    {
      label: "Giờ mở cửa",
      render: (d) => <span>{d.openingHours || "—"}</span>,
    },
    {
      label: "Thời gian tốt nhất",
      render: (d) => <span>{d.bestTimeToVisit || "—"}</span>,
    },
    {
      label: "Địa chỉ",
      render: (d) => <span className="text-sm">{d.address || "—"}</span>,
    },
  ];

  // Calculate highlights
  const getHighlightIndex = (row: RowDef): number | null => {
    if (!row.highlight || !row.getValue) return null;
    let bestIdx: number | null = null;
    let bestVal: number | null = null;
    destinations.forEach((d, i) => {
      const val = row.getValue!(d);
      if (val === null) return;
      if (bestVal === null || (row.highlight === "max" ? val > bestVal : val < bestVal)) {
        bestVal = val;
        bestIdx = i;
      }
    });
    return bestIdx;
  };

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr>
            <th className="text-left py-3 pr-4 text-sm font-semibold text-gray-500 dark:text-gray-400 w-32" />
            {destinations.map((d) => (
              <th key={d.slug} className="py-3 px-3 text-center" />
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const highlightIdx = getHighlightIndex(row);
            return (
              <tr key={row.label} className="border-t border-gray-100 dark:border-gray-700/50">
                <td className="py-4 pr-4 text-sm font-medium text-gray-500 dark:text-gray-400 align-top whitespace-nowrap">
                  {row.label}
                </td>
                {destinations.map((d, i) => (
                  <td
                    key={d.slug}
                    className={`py-4 px-3 text-center align-top text-gray-900 dark:text-gray-100 ${
                      highlightIdx === i
                        ? "bg-emerald-50 dark:bg-emerald-900/20 rounded-lg"
                        : ""
                    }`}
                  >
                    {row.render(d)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
