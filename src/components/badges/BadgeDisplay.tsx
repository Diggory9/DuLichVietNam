"use client";

import { getBadgeInfo } from "@/lib/badges";

interface BadgeDisplayProps {
  badges: string[];
}

export default function BadgeDisplay({ badges }: BadgeDisplayProps) {
  if (badges.length === 0) {
    return (
      <p className="text-sm text-gray-400">Chưa có huy hiệu nào.</p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {badges.map((id) => {
        const info = getBadgeInfo(id);
        return (
          <div
            key={id}
            className="group relative flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-full hover:scale-105 transition-transform cursor-default"
          >
            <span className="text-lg">{info.icon}</span>
            <span className="text-sm font-medium text-amber-800">{info.name}</span>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              {info.description}
            </div>
          </div>
        );
      })}
    </div>
  );
}
