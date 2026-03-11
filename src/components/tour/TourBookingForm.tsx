"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { createBooking } from "@/lib/booking-api";
import { createPaymentUrl } from "@/lib/payment-api";
import { useToast } from "@/components/ui/ToastProvider";
import type { Tour } from "@/types";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

interface TourBookingFormProps {
  tour: Tour;
}

export default function TourBookingForm({ tour }: TourBookingFormProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [bookingCode, setBookingCode] = useState<string | null>(null);

  const [tourDate, setTourDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const unitPrice = tour.discountPrice || tour.price;
  const totalPrice = unitPrice * guests;

  const handlePayment = async () => {
    if (!bookingCode) return;
    setPaying(true);
    try {
      const { paymentUrl } = await createPaymentUrl(bookingCode);
      window.location.href = paymentUrl;
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi tạo thanh toán.", { variant: "error" });
      setPaying(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!tourDate) newErrors.tourDate = "Vui lòng chọn ngày khởi hành";
    if (guests < 1) newErrors.guests = "Số khách phải từ 1 trở lên";
    if (guests > tour.maxGroupSize)
      newErrors.guests = `Tối đa ${tour.maxGroupSize} khách`;
    if (!fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!email.trim()) newErrors.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Email không hợp lệ";
    if (!phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^[0-9]{9,11}$/.test(phone.replace(/\s/g, "")))
      newErrors.phone = "Số điện thoại không hợp lệ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Check auth
    const token = localStorage.getItem("dulichvietnam_token");
    if (!token) {
      toast("Vui lòng đăng nhập để đặt tour.", { variant: "warning" });
      return;
    }

    setSubmitting(true);
    try {
      const booking = await createBooking({
        type: "tour",
        tourSlug: tour.slug,
        tourDate,
        guests,
        contactInfo: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
        },
        notes: notes.trim() || undefined,
      });

      setBookingCode(booking.bookingCode);
      toast("Đặt tour thành công!", { variant: "success" });
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi đặt tour.",
        { variant: "error" }
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Success state
  if (bookingCode) {
    return (
      <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
        <div className="text-center py-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Đặt tour thành công!
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Mã đặt tour của bạn
          </p>
          <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400 font-mono tracking-wider">
            {bookingCode}
          </p>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Vui lòng lưu lại mã này để tra cứu thông tin đặt tour.
          </p>
          <div className="mt-4 flex flex-col items-center gap-3">
            <button
              onClick={handlePayment}
              disabled={paying}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {paying ? "Đang chuyển..." : "Thanh toán qua VNPay"}
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBookingCode(null);
                setTourDate("");
                setGuests(1);
                setFullName("");
                setEmail("");
                setPhone("");
                setNotes("");
                setErrors({});
              }}
            >
              Đặt tour khác
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
        Đặt tour
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Điền thông tin để đặt tour ngay
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tour date */}
        <div>
          <label
            htmlFor="tourDate"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Ngày khởi hành
          </label>
          <input
            id="tourDate"
            type="date"
            value={tourDate}
            onChange={(e) => {
              setTourDate(e.target.value);
              setErrors((prev) => ({ ...prev, tourDate: "" }));
            }}
            min={new Date().toISOString().split("T")[0]}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />
          {errors.tourDate && (
            <p className="mt-1.5 text-sm text-red-600">{errors.tourDate}</p>
          )}
        </div>

        {/* Number of guests */}
        <div>
          <label
            htmlFor="guests"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Số khách
          </label>
          <input
            id="guests"
            type="number"
            value={guests}
            onChange={(e) => {
              setGuests(parseInt(e.target.value) || 1);
              setErrors((prev) => ({ ...prev, guests: "" }));
            }}
            min={1}
            max={tour.maxGroupSize}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 text-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          />
          {errors.guests && (
            <p className="mt-1.5 text-sm text-red-600">{errors.guests}</p>
          )}
        </div>

        {/* Full name */}
        <Input
          id="fullName"
          label="Họ và tên"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            setErrors((prev) => ({ ...prev, fullName: "" }));
          }}
          placeholder="Nguyễn Văn A"
          error={errors.fullName}
        />

        {/* Email */}
        <Input
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
          placeholder="email@example.com"
          error={errors.email}
        />

        {/* Phone */}
        <Input
          id="phone"
          label="Số điện thoại"
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setErrors((prev) => ({ ...prev, phone: "" }));
          }}
          placeholder="0901234567"
          error={errors.phone}
        />

        {/* Notes */}
        <Textarea
          id="notes"
          label="Ghi chú"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Yêu cầu đặc biệt, dị ứng thực phẩm..."
          rows={3}
        />

        {/* Price summary */}
        <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 p-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Giá mỗi người
            </span>
            <span>{formatPrice(unitPrice)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Số khách</span>
            <span>{guests}</span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-600 pt-2 flex justify-between">
            <span className="text-base font-bold text-gray-900 dark:text-gray-100">
              Tổng cộng
            </span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={submitting}
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <svg
                className="animate-spin w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Đang xử lý...
            </span>
          ) : (
            "Đặt tour ngay"
          )}
        </Button>
      </form>
    </div>
  );
}
