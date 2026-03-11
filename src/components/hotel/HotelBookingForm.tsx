"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { createBooking } from "@/lib/booking-api";
import { createPaymentUrl, checkRoomAvailability } from "@/lib/payment-api";
import Container from "@/components/ui/Container";
import type { Hotel } from "@/types";

interface HotelBookingFormProps {
  hotel: Hotel;
  initialRoom?: string;
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function daysBetween(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  const diff = e.getTime() - s.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getTomorrowStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function getDayAfterTomorrowStr(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().split("T")[0];
}

export default function HotelBookingForm({ hotel, initialRoom }: HotelBookingFormProps) {
  const { user, isAuthenticated } = useAuth();

  const availableRooms = hotel.rooms.filter((r) => r.available);

  const [selectedRoomName, setSelectedRoomName] = useState(
    initialRoom || availableRooms[0]?.name || ""
  );
  const [checkIn, setCheckIn] = useState(getTomorrowStr());
  const [checkOut, setCheckOut] = useState(getDayAfterTomorrowStr());
  const [guests, setGuests] = useState(1);
  const [fullName, setFullName] = useState(user?.displayName || "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [bookingCode, setBookingCode] = useState("");
  const [roomAvailable, setRoomAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const selectedRoom = useMemo(
    () => hotel.rooms.find((r) => r.name === selectedRoomName),
    [hotel.rooms, selectedRoomName]
  );

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    return daysBetween(checkIn, checkOut);
  }, [checkIn, checkOut]);

  const totalPrice = useMemo(() => {
    if (!selectedRoom) return 0;
    return selectedRoom.price * nights;
  }, [selectedRoom, nights]);

  // Check room availability when room/dates change
  useEffect(() => {
    if (!selectedRoomName || !checkIn || !checkOut) {
      setRoomAvailable(null);
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) return;

    const controller = new AbortController();
    setCheckingAvailability(true);
    checkRoomAvailability(hotel.slug, selectedRoomName, checkIn, checkOut)
      .then((result) => {
        if (!controller.signal.aborted) {
          setRoomAvailable(result.available);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setRoomAvailable(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setCheckingAvailability(false);
      });

    return () => controller.abort();
  }, [hotel.slug, selectedRoomName, checkIn, checkOut]);

  const handlePayment = async () => {
    if (!bookingCode) return;
    setPaying(true);
    try {
      const { paymentUrl } = await createPaymentUrl(bookingCode);
      window.location.href = paymentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tạo thanh toán.");
      setPaying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated) {
      setError("Vui lòng đăng nhập để đặt phòng.");
      return;
    }

    if (!selectedRoomName) {
      setError("Vui lòng chọn phòng.");
      return;
    }

    if (!checkIn || !checkOut) {
      setError("Vui lòng chọn ngày nhận và trả phòng.");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setError("Ngày trả phòng phải sau ngày nhận phòng.");
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError("Vui lòng điền đầy đủ thông tin liên hệ.");
      return;
    }

    if (selectedRoom && guests > selectedRoom.maxGuests) {
      setError(`Phòng này tối đa ${selectedRoom.maxGuests} khách.`);
      return;
    }

    setSubmitting(true);
    try {
      const booking = await createBooking({
        type: "hotel",
        hotelSlug: hotel.slug,
        roomName: selectedRoomName,
        checkIn,
        checkOut,
        guests,
        contactInfo: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
        },
        notes: notes.trim() || undefined,
      });
      setBookingCode(booking.bookingCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi đặt phòng.");
    } finally {
      setSubmitting(false);
    }
  };

  // Success state
  if (bookingCode) {
    return (
      <section className="py-16 sm:py-20">
        <Container>
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-extrabold text-gray-900 dark:text-white">
              Đặt phòng thành công!
            </h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Cảm ơn bạn đã đặt phòng tại <strong>{hotel.name}</strong>.
            </p>
            <div className="mt-6 inline-block bg-primary-50 dark:bg-primary-900/30 rounded-xl px-6 py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Mã đặt phòng</p>
              <p className="mt-1 text-2xl font-mono font-bold text-primary-600 dark:text-primary-400">
                {bookingCode}
              </p>
            </div>
            <p className="mt-4 text-sm text-gray-400 dark:text-gray-500">
              Vui lòng lưu lại mã đặt phòng. Chúng tôi sẽ liên hệ để xác nhận sớm nhất.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handlePayment}
                disabled={paying}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {paying ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Đang chuyển...
                  </>
                ) : (
                  "Thanh toán ngay qua VNPay"
                )}
              </button>
              <a
                href="/dat-phong"
                className="px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Thanh toán sau
              </a>
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20" id="dat-phong">
      <Container>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Đặt phòng
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Điền thông tin bên dưới để đặt phòng tại {hotel.name}
          </p>

          {!isAuthenticated && (
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl">
              <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                Bạn cần đăng nhập để đặt phòng. Vui lòng{" "}
                <a href="/dang-nhap" className="underline font-semibold">
                  đăng nhập
                </a>{" "}
                hoặc{" "}
                <a href="/dang-ky" className="underline font-semibold">
                  đăng ký
                </a>
                .
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Room selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Chọn phòng <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedRoomName}
                onChange={(e) => setSelectedRoomName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none"
                required
              >
                <option value="">-- Chọn phòng --</option>
                {availableRooms.map((room, i) => (
                  <option key={`${room.name}-${i}`} value={room.name}>
                    {room.name} - {formatVND(room.price)}/đêm (tối đa {room.maxGuests} khách)
                  </option>
                ))}
              </select>
            </div>

            {/* Date range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Ngày nhận phòng <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    // Auto-adjust checkout if needed
                    if (e.target.value >= checkOut) {
                      const nextDay = new Date(e.target.value);
                      nextDay.setDate(nextDay.getDate() + 1);
                      setCheckOut(nextDay.toISOString().split("T")[0]);
                    }
                  }}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Ngày trả phòng <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none"
                  required
                />
              </div>
            </div>

            {/* Availability indicator */}
            {selectedRoomName && checkIn && checkOut && new Date(checkOut) > new Date(checkIn) && (
              <div className={`p-3 rounded-lg text-sm font-medium ${
                checkingAvailability
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  : roomAvailable === true
                  ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                  : roomAvailable === false
                  ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
              }`}>
                {checkingAvailability
                  ? "Đang kiểm tra phòng trống..."
                  : roomAvailable === true
                  ? "Phòng còn trống cho ngày bạn chọn"
                  : roomAvailable === false
                  ? "Phòng đã hết cho ngày bạn chọn. Vui lòng chọn ngày khác."
                  : ""}
              </div>
            )}

            {/* Number of guests */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Số khách <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={guests}
                onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                max={selectedRoom?.maxGuests || 10}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none"
                required
              />
              {selectedRoom && (
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  Tối đa {selectedRoom.maxGuests} khách cho phòng này
                </p>
              )}
            </div>

            {/* Contact info */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Thông tin liên hệ
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0912 345 678"
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Ghi chú
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Yêu cầu đặc biệt, giờ đến dự kiến..."
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none resize-none"
              />
            </div>

            {/* Price summary */}
            {selectedRoom && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Chi tiết giá
                </h4>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span>
                    {selectedRoom.name} x {nights} đêm
                  </span>
                  <span>{formatVND(selectedRoom.price)} x {nights}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900 dark:text-white">
                    Tổng cộng
                  </span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatVND(totalPrice)}
                  </span>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !isAuthenticated || roomAvailable === false}
              className="w-full px-6 py-3 bg-primary-600 text-white rounded-xl text-base font-semibold hover:bg-primary-700 active:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                "Xác nhận đặt phòng"
              )}
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}
