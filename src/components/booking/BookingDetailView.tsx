"use client";

import { useState } from "react";
import type { Booking } from "@/types";
import { cancelBooking } from "@/lib/booking-api";
import { createPaymentUrl } from "@/lib/payment-api";
import BookingStatusBadge from "./BookingStatusBadge";
import CancelBookingModal from "./CancelBookingModal";

interface BookingDetailViewProps {
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

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BookingDetailView({ booking: initialBooking }: BookingDetailViewProps) {
  const [booking, setBooking] = useState<Booking>(initialBooking);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const isHotel = booking.type === "hotel";
  const canCancel = booking.status !== "cancelled";
  const canPay = booking.status !== "cancelled" && (!booking.paymentStatus || booking.paymentStatus === "unpaid");

  async function handlePayment() {
    setPaying(true);
    setError("");
    try {
      const { paymentUrl } = await createPaymentUrl(booking.bookingCode);
      window.location.href = paymentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tạo thanh toán");
      setPaying(false);
    }
  }

  async function handleCancel(reason: string) {
    setCancelling(true);
    setError("");
    try {
      const updated = await cancelBooking(booking.bookingCode, reason);
      setBooking(updated);
      setShowCancelModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "L\u1ed7i hu\u1ef7 \u0111\u1eb7t ch\u1ed7");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl" role="img" aria-label={isHotel ? "hotel" : "tour"}>
                {isHotel ? "\u{1F3E8}" : "\u{1F5FA}\uFE0F"}
              </span>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {isHotel ? booking.hotelSlug : booking.tourSlug}
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
              M\u00e3 \u0111\u1eb7t ch\u1ed7: {booking.bookingCode}
            </p>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>
      </div>

      {/* Booking details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
          Chi ti\u1ebft \u0111\u1eb7t ch\u1ed7
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow label="Lo\u1ea1i" value={isHotel ? "Kh\u00e1ch s\u1ea1n" : "Tour du l\u1ecbch"} />

          {isHotel && booking.roomName && (
            <InfoRow label="Lo\u1ea1i ph\u00f2ng" value={booking.roomName} />
          )}

          {isHotel && booking.checkIn && (
            <InfoRow label="Ng\u00e0y nh\u1eadn ph\u00f2ng" value={formatDate(booking.checkIn)} />
          )}
          {isHotel && booking.checkOut && (
            <InfoRow label="Ng\u00e0y tr\u1ea3 ph\u00f2ng" value={formatDate(booking.checkOut)} />
          )}

          {!isHotel && booking.tourDate && (
            <InfoRow label="Ng\u00e0y kh\u1edfi h\u00e0nh" value={formatDate(booking.tourDate)} />
          )}

          <InfoRow label="S\u1ed1 kh\u00e1ch" value={`${booking.guests} ng\u01b0\u1eddi`} />

          <div className="sm:col-span-2">
            <InfoRow label="Tổng tiền" value={formatPrice(booking.totalPrice)} highlight />
          </div>

          {booking.paymentStatus && (
            <InfoRow
              label="Thanh toán"
              value={
                booking.paymentStatus === "paid"
                  ? "Đã thanh toán"
                  : booking.paymentStatus === "pending"
                  ? "Đang xử lý"
                  : booking.paymentStatus === "refunded"
                  ? "Đã hoàn tiền"
                  : "Chưa thanh toán"
              }
            />
          )}
          {booking.paymentMethod && (
            <InfoRow
              label="Phương thức"
              value={
                booking.paymentMethod === "vnpay"
                  ? "VNPay"
                  : booking.paymentMethod === "bank_transfer"
                  ? "Chuyển khoản"
                  : "Tiền mặt"
              }
            />
          )}
        </div>

        {booking.notes && (
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Ghi ch\u00fa
            </span>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {booking.notes}
            </p>
          </div>
        )}
      </div>

      {/* Contact info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
          Th\u00f4ng tin li\u00ean h\u1ec7
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow label="H\u1ecd t\u00ean" value={booking.contactInfo.fullName} />
          <InfoRow label="Email" value={booking.contactInfo.email} />
          <InfoRow label="S\u1ed1 \u0111i\u1ec7n tho\u1ea1i" value={booking.contactInfo.phone} />
        </div>
      </div>

      {/* Cancellation info */}
      {booking.status === "cancelled" && booking.cancellationReason && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-6 space-y-2">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-400">
            Th\u00f4ng tin hu\u1ef7
          </h2>
          <p className="text-sm text-red-700 dark:text-red-300">
            <span className="font-medium">L\u00fd do:</span> {booking.cancellationReason}
          </p>
        </div>
      )}

      {/* Timestamps */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Ng\u00e0y t\u1ea1o: {formatDateTime(booking.createdAt)}</span>
          <span>C\u1eadp nh\u1eadt: {formatDateTime(booking.updatedAt)}</span>
        </div>
      </div>

      {/* Actions */}
      {(canCancel || canPay) && (
        <div className="flex gap-3">
          {canPay && (
            <button
              type="button"
              onClick={handlePayment}
              disabled={paying}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {paying ? "Đang chuyển..." : "Thanh toán qua VNPay"}
            </button>
          )}
          {canCancel && (
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              disabled={cancelling}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {cancelling ? "Đang huỷ..." : "Huỷ đặt chỗ"}
            </button>
          )}
        </div>
      )}

      <CancelBookingModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancel}
      />
    </div>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <p
        className={`mt-0.5 text-sm ${
          highlight
            ? "text-lg font-bold text-primary-600 dark:text-primary-400"
            : "text-gray-900 dark:text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
