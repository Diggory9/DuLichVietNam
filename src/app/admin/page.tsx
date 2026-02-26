"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchStats, fetchProvinces, fetchDestinations } from "@/lib/admin-api";

interface Stats {
  provinces: number;
  destinations: number;
  categories: number;
  regions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentProvinces, setRecentProvinces] = useState<Record<string, unknown>[]>([]);
  const [recentDestinations, setRecentDestinations] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetchStats(), fetchProvinces(), fetchDestinations()])
      .then(([s, p, d]) => {
        setStats(s);
        setRecentProvinces((p as Record<string, unknown>[]).slice(0, 5));
        setRecentDestinations((d as Record<string, unknown>[]).slice(0, 5));
      })
      .catch((err) => setError(err.message));
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
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Tỉnh thành", value: stats.provinces, icon: "🗺️", href: "/admin/provinces" },
            { label: "Địa danh", value: stats.destinations, icon: "📍", href: "/admin/destinations" },
            { label: "Danh mục", value: stats.categories, icon: "🏷️" },
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
    </div>
  );
}
