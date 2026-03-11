"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchStats, fetchProvinces, fetchDestinations, fetchPosts, fetchDetailedStats } from "@/lib/admin-api";
import Skeleton from "@/components/ui/Skeleton";
import StatsCharts from "@/components/admin/StatsCharts";

interface Stats {
  provinces: number;
  destinations: number;
  posts: number;
  categories: number;
  regions: number;
  unreadContacts: number;
  comments: number;
  reviews: number;
  hotels: number;
  tours: number;
  bookings: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentProvinces, setRecentProvinces] = useState<Record<string, unknown>[]>([]);
  const [recentDestinations, setRecentDestinations] = useState<Record<string, unknown>[]>([]);
  const [recentPosts, setRecentPosts] = useState<Record<string, unknown>[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [detailedStats, setDetailedStats] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetchStats(), fetchProvinces(), fetchDestinations(), fetchPosts()])
      .then(([s, p, d, posts]) => {
        setStats(s);
        setRecentProvinces((p as Record<string, unknown>[]).slice(0, 5));
        setRecentDestinations((d as Record<string, unknown>[]).slice(0, 5));
        setRecentPosts((posts as Record<string, unknown>[]).slice(0, 5));
      })
      .catch((err) => setError(err.message));

    // Fetch detailed stats for charts
    fetchDetailedStats()
      .then((d) => setDetailedStats(d))
      .catch(() => {}); // Non-critical
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        <p className="font-semibold">Lỗi kết nối API</p>
        <p className="text-sm mt-1">{error}</p>
        <p className="text-sm mt-2">Hãy chắc chắn backend đang chạy tại {process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats */}
      {!stats && !error && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
              <Skeleton className="h-4 w-20 mb-3" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      )}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Tỉnh thành", value: stats.provinces, icon: "🗺️", href: "/admin/provinces" },
            { label: "Địa danh", value: stats.destinations, icon: "📍", href: "/admin/destinations" },
            { label: "Bài viết", value: stats.posts, icon: "📝", href: "/admin/posts" },
            { label: "Liên hệ chưa đọc", value: stats.unreadContacts, icon: "📬", href: "/admin/contacts" },
            { label: "Bình luận", value: stats.comments, icon: "💬", href: "/admin/comments" },
            { label: "Đánh giá", value: stats.reviews, icon: "⭐", href: "/admin/reviews" },
            { label: "Khách sạn", value: stats.hotels, icon: "🏨", href: "/admin/hotels" },
            { label: "Tour", value: stats.tours, icon: "🗺️", href: "/admin/tours" },
            { label: "Đặt chỗ", value: stats.bookings, icon: "📋", href: "/admin/bookings" },
            { label: "Vùng miền", value: stats.regions, icon: "🌏" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{item.value}</p>
                </div>
                <span className="text-3xl">{item.icon}</span>
              </div>
              {item.href && (
                <Link href={item.href} className="text-xs text-primary-600 hover:underline mt-3 inline-block">
                  Quản lý &rarr;
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tỉnh thành</h2>
            <Link href="/admin/provinces/new" className="text-sm bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700">
              + Thêm mới
            </Link>
          </div>
          <div className="space-y-3">
            {recentProvinces.map((p) => (
              <Link key={p.slug as string} href={`/admin/provinces/${p.slug}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{p.name as string}</p>
                  <p className="text-xs text-gray-500">{p.region as string}</p>
                </div>
                {Boolean(p.featured) && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Nổi bật</span>}
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Địa danh</h2>
            <Link href="/admin/destinations/new" className="text-sm bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700">
              + Thêm mới
            </Link>
          </div>
          <div className="space-y-3">
            {recentDestinations.map((d) => (
              <Link key={d.slug as string} href={`/admin/destinations/${d.slug}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{d.name as string}</p>
                  <p className="text-xs text-gray-500">{d.provinceSlug as string} &middot; {d.category as string}</p>
                </div>
                {Boolean(d.featured) && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Nổi bật</span>}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      {detailedStats && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê chi tiết</h2>
          <StatsCharts data={detailedStats} />
        </div>
      )}

      {/* Recent Posts */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Bài viết gần đây</h2>
          <Link href="/admin/posts/new" className="text-sm bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700">
            + Thêm mới
          </Link>
        </div>
        <div className="space-y-3">
          {recentPosts.map((post) => (
            <Link key={post.slug as string} href={`/admin/posts/${post.slug}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium text-gray-900 text-sm">{post.title as string}</p>
                <p className="text-xs text-gray-500">{post.category as string} &middot; {(post.views as number) || 0} lượt xem</p>
              </div>
              {post.published ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Đã xuất bản</span>
              ) : (
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Nháp</span>
              )}
            </Link>
          ))}
          {recentPosts.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-3">Chưa có bài viết nào</p>
          )}
        </div>
      </div>
    </div>
  );
}
