"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import BookingCard from "@/components/booking/BookingCard";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/components/auth/AuthProvider";
import { getMyBookings } from "@/lib/booking-api";
import type { Booking } from "@/types";

export default function MyBookingsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dang-nhap");
      return;
    }
    setLoading(true);
    getMyBookings(page)
      .then((res) => {
        setBookings(res.data);
        setTotalPages(res.pagination.totalPages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, page, router]);

  if (!isAuthenticated) return null;

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">
            Đặt chỗ của tôi
          </h1>

          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <Skeleton className="h-5 w-40 mb-3" />
                  <Skeleton className="h-4 w-60 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          )}

          {!loading && bookings.length === 0 && (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">📋</p>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Bạn chưa có đặt chỗ nào
              </p>
              <div className="flex gap-3 justify-center">
                <Link
                  href="/khach-san"
                  className="px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Tìm khách sạn
                </Link>
                <Link
                  href="/tour"
                  className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Khám phá tour
                </Link>
              </div>
            </div>
          )}

          {!loading && bookings.length > 0 && (
            <>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        page === i + 1
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
