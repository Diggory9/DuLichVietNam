"use client";

import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Container from "@/components/ui/Container";
import type { HotelRoom, Hotel } from "@/types";

interface RoomListProps {
  hotel: Hotel;
}

const ROOM_TYPE_LABELS: Record<string, string> = {
  standard: "Tiêu chuẩn",
  deluxe: "Cao cấp",
  suite: "Suite",
  family: "Gia đình",
};

const ROOM_TYPE_VARIANTS: Record<string, "default" | "primary" | "accent" | "emerald"> = {
  standard: "default",
  deluxe: "primary",
  suite: "accent",
  family: "emerald",
};

function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export default function RoomList({ hotel }: RoomListProps) {
  const router = useRouter();

  if (hotel.rooms.length === 0) return null;

  const handleBookRoom = (room: HotelRoom) => {
    const params = new URLSearchParams({
      room: room.name,
    });
    router.push(`/khach-san/${hotel.slug}/dat-phong?${params.toString()}`);
  };

  return (
    <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
      <Container>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Danh sách phòng
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {hotel.rooms.length} loại phòng có sẵn
        </p>

        <div className="mt-8 space-y-6">
          {hotel.rooms.map((room, index) => (
            <div
              key={`${room.name}-${index}`}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm"
            >
              <div className="p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Room info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {room.name}
                      </h3>
                      <Badge variant={ROOM_TYPE_VARIANTS[room.type] || "default"}>
                        {ROOM_TYPE_LABELS[room.type] || room.type}
                      </Badge>
                      {!room.available && (
                        <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/50 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:text-red-300">
                          Hết phòng
                        </span>
                      )}
                    </div>

                    {/* Max guests */}
                    <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Tối đa {room.maxGuests} khách
                    </div>

                    {/* Room amenities */}
                    {room.amenities.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {room.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-1 text-xs text-gray-600 dark:text-gray-300"
                          >
                            <svg
                              className="w-3 h-3 text-emerald-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price + booking button */}
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatVND(room.price)}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        / đêm
                      </p>
                    </div>

                    <button
                      onClick={() => handleBookRoom(room)}
                      disabled={!room.available}
                      className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                        room.available
                          ? "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {room.available ? "Đặt phòng" : "Hết phòng"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
