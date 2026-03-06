"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ItineraryMapPreview from "@/components/itinerary/ItineraryMapPreview";
import CostSummary from "@/components/itinerary/CostSummary";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Itinerary, Destination } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const DAY_COLORS = ["text-blue-600", "text-orange-600", "text-green-600", "text-purple-600", "text-pink-600", "text-teal-600", "text-red-600"];
const DAY_BG = ["bg-blue-50", "bg-orange-50", "bg-green-50", "bg-purple-50", "bg-pink-50", "bg-teal-50", "bg-red-50"];

interface Props {
  itinerary: Itinerary;
  destinations: Record<string, Destination>;
}

export default function ItineraryDetailClient({ itinerary, destinations }: Props) {
  const { isAuthenticated, token, user } = useAuth();
  const router = useRouter();
  const [copying, setCopying] = useState(false);

  const isOwner = user?.id === itinerary.userId;
  const totalDest = itinerary.days.reduce((sum, d) => sum + d.destinationSlugs.length, 0);

  async function handleCopy() {
    if (!isAuthenticated) {
      router.push("/dang-nhap");
      return;
    }
    setCopying(true);
    try {
      const res = await fetch(`${API_URL}/api/itineraries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: `${itinerary.title} (bản sao)`,
          description: itinerary.description,
          days: itinerary.days,
        }),
      });
      const json = await res.json();
      if (res.ok) router.push(`/lo-trinh/${json.data.slug}`);
    } catch {}
    setCopying(false);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {itinerary.title}
          </h1>
          {itinerary.description && (
            <p className="mt-2 text-gray-500">{itinerary.description}</p>
          )}
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
            <span>{itinerary.days.length} ngày</span>
            <span>{totalDest} điểm đến</span>
            <span>
              {new Date(itinerary.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOwner && (
            <Link
              href={`/lo-trinh/${itinerary.slug}/chinh-sua`}
              className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Chỉnh sửa
            </Link>
          )}
          {!isOwner && (
            <button
              onClick={handleCopy}
              disabled={copying}
              className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {copying ? "Đang sao chép..." : "Sao chép lộ trình"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Days detail */}
        <div className="space-y-4">
          {itinerary.days.map((day) => {
            const colorIdx = (day.dayNumber - 1) % DAY_COLORS.length;
            return (
              <div
                key={day.dayNumber}
                className={`rounded-xl p-5 ${DAY_BG[colorIdx]}`}
              >
                <h3 className={`font-bold ${DAY_COLORS[colorIdx]} mb-3`}>
                  Ngày {day.dayNumber}
                </h3>
                <div className="space-y-2">
                  {day.destinationSlugs.map((slug, idx) => {
                    const dest = destinations[slug];
                    return (
                      <Link
                        key={slug}
                        href={`/dia-danh/${slug}`}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-sm transition-all"
                      >
                        <span className="text-sm text-gray-400 font-medium w-6">
                          {idx + 1}.
                        </span>
                        {dest?.images?.[0]?.src && (
                          <img
                            src={dest.images[0].src}
                            alt={dest.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {dest?.name || slug}
                          </p>
                          {dest?.address && (
                            <p className="text-xs text-gray-400">{dest.address}</p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                  {day.destinationSlugs.length === 0 && (
                    <p className="text-sm text-gray-400">Chưa có địa danh</p>
                  )}
                </div>
                {day.notes && (
                  <p className="mt-3 text-sm text-gray-600 italic">
                    {day.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Map + Cost */}
        <div className="lg:sticky lg:top-24 lg:self-start space-y-4">
          <ItineraryMapPreview
            days={itinerary.days}
            destinations={destinations}
            className="h-[400px] lg:h-[500px] w-full"
          />
          <CostSummary
            days={itinerary.days}
            destinations={destinations}
            totalBudget={itinerary.totalBudget}
          />
        </div>
      </div>
    </div>
  );
}
