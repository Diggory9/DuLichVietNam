"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import type { MapDestination } from "@/components/shared/MapView";
import type { Destination, ItineraryDay } from "@/types";

const MapView = dynamic(() => import("@/components/shared/MapView"), { ssr: false });

const DAY_COLORS = ["#3b82f6", "#f97316", "#22c55e", "#a855f7", "#ec4899", "#14b8a6", "#ef4444"];

interface ItineraryMapPreviewProps {
  days: ItineraryDay[];
  destinations: Record<string, Destination>;
  className?: string;
}

export default function ItineraryMapPreview({
  days,
  destinations,
  className = "h-[400px] w-full",
}: ItineraryMapPreviewProps) {
  const mapDestinations: MapDestination[] = useMemo(() => {
    const result: MapDestination[] = [];
    for (const day of days) {
      for (const slug of day.destinationSlugs) {
        const dest = destinations[slug];
        if (dest?.coordinates) {
          result.push({
            slug: dest.slug,
            name: `Ngày ${day.dayNumber}: ${dest.name}`,
            nameVi: `Ngày ${day.dayNumber}: ${dest.name}`,
            coordinates: dest.coordinates,
            category: dest.category,
            image: dest.images[0]?.src || null,
          });
        }
      }
    }
    return result;
  }, [days, destinations]);

  if (mapDestinations.length === 0) {
    return (
      <div className={`${className} bg-gray-100 rounded-2xl flex items-center justify-center`}>
        <p className="text-gray-400 text-sm">Thêm địa danh để xem bản đồ</p>
      </div>
    );
  }

  return <MapView destinations={mapDestinations} className={className} />;
}
