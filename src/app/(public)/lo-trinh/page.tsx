"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Itinerary } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ItineraryListPage() {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dang-nhap");
      return;
    }
    fetch(`${API_URL}/api/itineraries`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => setItineraries(json.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, token, router]);

  if (!isAuthenticated) return null;

  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Breadcrumb items={[{ label: "Lộ trình" }]} />
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Lộ trình của tôi
            </h1>
            <p className="mt-2 text-gray-500">
              Lên kế hoạch cho chuyến đi của bạn
            </p>
          </div>
          <Link
            href="/lo-trinh/tao-moi"
            className="bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            + Tạo lộ trình mới
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400">Đang tải...</div>
        ) : itineraries.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Bạn chưa có lộ trình nào</p>
            <p className="text-gray-300 text-sm mt-2">
              Tạo lộ trình đầu tiên để bắt đầu lên kế hoạch du lịch
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((it) => {
              const totalDest = it.days.reduce((sum, d) => sum + d.destinationSlugs.length, 0);
              return (
                <Link
                  key={it.id}
                  href={`/lo-trinh/${it.slug}`}
                  className="block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="font-bold text-gray-900">{it.title}</h2>
                    {it.isPublic ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Công khai
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        Riêng tư
                      </span>
                    )}
                  </div>
                  {it.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{it.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{it.days.length} ngày</span>
                    <span>{totalDest} điểm đến</span>
                    <span>
                      {new Date(it.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
