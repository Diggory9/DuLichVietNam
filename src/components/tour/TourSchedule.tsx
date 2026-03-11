"use client";

import { useState } from "react";
import Link from "next/link";
import type { TourScheduleDay } from "@/types";

interface TourScheduleProps {
  schedule: TourScheduleDay[];
}

export default function TourSchedule({ schedule }: TourScheduleProps) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(() => {
    // Expand the first day by default
    return new Set(schedule.length > 0 ? [schedule[0].dayNumber] : []);
  });

  const toggleDay = (dayNumber: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayNumber)) {
        next.delete(dayNumber);
      } else {
        next.add(dayNumber);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedDays(new Set(schedule.map((d) => d.dayNumber)));
  };

  const collapseAll = () => {
    setExpandedDays(new Set());
  };

  if (schedule.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Lịch trình
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            Mở tất cả
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={collapseAll}
            className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            Thu gọn
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-4">
          {schedule.map((day) => {
            const isExpanded = expandedDays.has(day.dayNumber);

            return (
              <div key={day.dayNumber} className="relative pl-14">
                {/* Timeline dot */}
                <div
                  className={`absolute left-3 top-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isExpanded
                      ? "bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {isExpanded && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                {/* Day card */}
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                  {/* Header - clickable */}
                  <button
                    onClick={() => toggleDay(day.dayNumber)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-sm font-bold">
                        {day.dayNumber}
                      </span>
                      <div>
                        <p className="text-xs font-medium text-primary-600 dark:text-primary-400">
                          Ngày {day.dayNumber}
                        </p>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          {day.title}
                        </h3>
                      </div>
                    </div>

                    <svg
                      className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {day.description}
                      </p>

                      {/* Linked destinations */}
                      {day.destinationSlugs.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Điểm đến
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {day.destinationSlugs.map((slug) => (
                              <Link
                                key={slug}
                                href={`/dia-danh/${slug}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                                  />
                                </svg>
                                {slug}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
