"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Container from "@/components/ui/Container";
import BookingDetailView from "@/components/booking/BookingDetailView";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/components/auth/AuthProvider";
import { getBookingByCode } from "@/lib/booking-api";
import type { Booking } from "@/types";

export default function BookingDetailPage() {
  const router = useRouter();
  const { code } = useParams<{ code: string }>();
  const { isAuthenticated } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dang-nhap");
      return;
    }
    if (!code) return;
    setLoading(true);
    getBookingByCode(code)
      .then(setBooking)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [isAuthenticated, code, router]);

  if (!isAuthenticated) return null;

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="max-w-3xl mx-auto">
          {loading && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-3/4 mb-3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl text-center">
              <p className="text-lg font-semibold mb-2">Không tìm thấy đặt chỗ</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!loading && booking && (
            <BookingDetailView booking={booking} />
          )}
        </div>
      </Container>
    </section>
  );
}
