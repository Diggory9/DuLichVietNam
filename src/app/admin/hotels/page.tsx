"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchHotels, deleteHotel } from "@/lib/admin-api";

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHotels()
      .then((data) => setHotels(data as Record<string, unknown>[]))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(slug: string) {
    if (!confirm("Bạn có chắc muốn xoá khách sạn này?")) return;
    try {
      await deleteHotel(slug);
      setHotels((prev) => prev.filter((h) => h.slug !== slug));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi xoá");
    }
  }

  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Khách sạn</h1>
        <Link
          href="/admin/hotels/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          + Thêm khách sạn
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          Đang tải...
        </div>
      ) : hotels.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          Chưa có khách sạn nào
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Tên</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Tỉnh</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">Sao</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">Phòng</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">Nổi bật</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">Trạng thái</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {hotels.map((hotel) => (
                <tr key={hotel.slug as string} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/hotels/${hotel.slug}`} className="font-medium text-gray-900 hover:text-primary-600">
                      {hotel.name as string}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{hotel.provinceSlug as string}</td>
                  <td className="px-4 py-3 text-center text-yellow-500">
                    {"★".repeat(hotel.stars as number)}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500">
                    {(hotel.rooms as unknown[])?.length || 0}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {hotel.featured ? (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Nổi bật</span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {hotel.active ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Hoạt động</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Ẩn</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/hotels/${hotel.slug}`} className="text-primary-600 hover:underline mr-3">
                      Sửa
                    </Link>
                    <button onClick={() => handleDelete(hotel.slug as string)} className="text-red-500 hover:underline">
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
