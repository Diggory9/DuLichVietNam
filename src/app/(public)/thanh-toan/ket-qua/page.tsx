"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { API_URL } from "@/lib/api-config";

interface PaymentResult {
  isValid: boolean;
  responseCode: string;
  message: string;
  transactionId?: string;
  orderInfo?: string;
  amount?: number;
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyPayment() {
      try {
        const params = new URLSearchParams();
        searchParams.forEach((value, key) => {
          params.set(key, value);
        });

        const res = await fetch(
          `${API_URL}/api/payments/vnpay-return?${params.toString()}`
        );
        const json = await res.json();
        if (json.success) {
          setResult(json.data);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    verifyPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
      </div>
    );
  }

  const isSuccess = result?.isValid && result?.responseCode === "00";

  return (
    <div className="max-w-lg mx-auto text-center">
      {/* Icon */}
      <div
        className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
          isSuccess
            ? "bg-emerald-100 dark:bg-emerald-900/50"
            : "bg-red-100 dark:bg-red-900/50"
        }`}
      >
        {isSuccess ? (
          <svg
            className="w-10 h-10 text-emerald-600 dark:text-emerald-400"
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
        ) : (
          <svg
            className="w-10 h-10 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </div>

      {/* Title */}
      <h1
        className={`mt-6 text-2xl font-extrabold ${
          isSuccess
            ? "text-emerald-700 dark:text-emerald-400"
            : "text-red-700 dark:text-red-400"
        }`}
      >
        {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
      </h1>

      <p className="mt-3 text-gray-500 dark:text-gray-400">
        {isSuccess
          ? "Đặt chỗ của bạn đã được xác nhận và thanh toán thành công."
          : "Giao dịch không thành công. Vui lòng thử lại hoặc liên hệ hỗ trợ."}
      </p>

      {/* Details */}
      {result && (
        <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 text-left space-y-3">
          {result.transactionId && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Mã giao dịch
              </span>
              <span className="font-mono font-semibold text-gray-900 dark:text-white">
                {result.transactionId}
              </span>
            </div>
          )}
          {result.amount && result.amount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Số tiền
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {formatVND(result.amount)}
              </span>
            </div>
          )}
          {result.orderInfo && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Nội dung
              </span>
              <span className="text-gray-900 dark:text-white text-right max-w-[200px]">
                {result.orderInfo}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/dat-phong"
          className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          Xem đặt chỗ của tôi
        </Link>
        <Link
          href="/"
          className="px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
            </div>
          }
        >
          <PaymentResultContent />
        </Suspense>
      </Container>
    </section>
  );
}
