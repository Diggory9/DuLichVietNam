"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Itinerary } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface AddToItineraryButtonProps {
  destinationSlug: string;
  size?: "sm" | "md";
}

export default function AddToItineraryButton({
  destinationSlug,
  size = "sm",
}: AddToItineraryButtonProps) {
  const { isAuthenticated, token } = useAuth();
  const [open, setOpen] = useState(false);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const px = size === "md" ? 28 : 22;

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!isAuthenticated) return null;

  async function handleOpen() {
    setOpen(!open);
    if (!open && itineraries.length === 0) {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/itineraries`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        setItineraries(json.data || []);
      } catch {}
      setLoading(false);
    }
  }

  async function handleAdd(itinerary: Itinerary) {
    // Add destination to the last day, or create day 1
    const days = [...itinerary.days];
    if (days.length === 0) {
      days.push({ dayNumber: 1, destinationSlugs: [destinationSlug] });
    } else {
      const lastDay = { ...days[days.length - 1] };
      if (!lastDay.destinationSlugs.includes(destinationSlug)) {
        lastDay.destinationSlugs = [...lastDay.destinationSlugs, destinationSlug];
      }
      days[days.length - 1] = lastDay;
    }

    try {
      await fetch(`${API_URL}/api/itineraries/${itinerary.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ days }),
      });
      setAdded(itinerary.slug);
      setTimeout(() => {
        setAdded("");
        setOpen(false);
      }, 1200);
    } catch {}
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleOpen();
        }}
        className="transition-transform active:scale-125"
        aria-label="Thêm vào lộ trình"
        title="Thêm vào lộ trình"
      >
        <svg
          width={px}
          height={px}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      {open && (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden"
        >
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-700">Thêm vào lộ trình</p>
          </div>
          <div className="max-h-48 overflow-auto">
            {loading && (
              <div className="px-3 py-3 text-xs text-gray-400 text-center">Đang tải...</div>
            )}
            {!loading && itineraries.length === 0 && (
              <div className="px-3 py-3 text-xs text-gray-400 text-center">
                Chưa có lộ trình.{" "}
                <a href="/lo-trinh/tao-moi" className="text-primary-600 hover:underline">
                  Tạo mới
                </a>
              </div>
            )}
            {itineraries.map((it) => (
              <button
                key={it.id}
                onClick={() => handleAdd(it)}
                disabled={added === it.slug}
                className="w-full text-left px-3 py-2.5 text-sm hover:bg-primary-50 transition-colors flex items-center justify-between"
              >
                <span className="truncate text-gray-700">{it.title}</span>
                {added === it.slug ? (
                  <span className="text-xs text-green-600 flex-shrink-0">Da them!</span>
                ) : (
                  <span className="text-xs text-gray-400 flex-shrink-0">{it.days.length} ngay</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
