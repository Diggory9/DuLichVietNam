"use client";

import Link from "next/link";
import type { Booking } from "@/types";
import BookingStatusBadge from "./BookingStatusBadge";

interface BookingCardProps {
  booking: Booking;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function BookingCard({ booking }: BookingCardProps) {
  const isHotel = booking.type === "hotel";
  const typeIcon = isHotel ? "\u{1F3E8}" : "\u{1F5FA}\uFE0F";
  const itemName = isHotel ? booking.hotelSlug : booking.tourSlug;

  return (
    <Link
      href={`/dat-phong/${booking.bookingCode}`}
      className="block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl" role="img" aria-label={isHotel ? "hotel" : "tour"}>
              {typeIcon}
            </span>
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
              {booking.bookingCode}
            </span>
          </div>

          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
            {itemName || (isHotel ? "Kh\u00e1ch s\u1ea1n" : "Tour du l\u1ecbch")}
          </h3>

          {isHotel && booking.roomName && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Ph\u00f2ng: {booking.roomName}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-300">
            {isHotel && booking.checkIn && booking.checkOut && (
              <span>
                {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
              </span>
            )}
            {!isHotel && booking.tourDate && (
              <span>Ng\u00e0y kh\u1edfi h\u00e0nh: {formatDate(booking.tourDate)}</span>
            )}
            <span>{booking.guests} kh\u00e1ch</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <BookingStatusBadge status={booking.status} />
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
            {formatPrice(booking.totalPrice)}
          </span>
        </div>
      </div>
    </Link>
  );
}
