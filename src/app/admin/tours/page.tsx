"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchTours, deleteTour } from "@/lib/admin-api";

const CATEGORY_LABELS: Record<string, string> = {
  "van-hoa": "Văn hoá",
  "thien-nhien": "Thiên nhiên",
  "phieu-luu": "Phiêu lưu",
  "am-thuc": "Ẩm thực",
  "lich-su": "Lịch sử",
  "ket-hop": "Kết hợp",
};

export default function AdminToursPage() {
  const [tours, setTours] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTours()
      .then((data) => setTours(data as Record<string, unknown>[]))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(slug: string) {
    if (!confirm("Bạn có chắc muốn xoá tour này?")) return;
    try {
      await deleteTour(slug);
      setTours((prev) => prev.filter((t) => t.slug !== slug));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi xoá");
    }
  }

  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tour du lịch</h1>
        <Link
          href="/admin/tours/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          + Thêm tour
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          Đang tải...
        </div>
      ) : tours.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
          Chưa có tour nào
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Tên</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Tỉnh</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Danh mục</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">Thời gian</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">Giá</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500">Nổi bật</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tours.map((tour) => {
                const duration = tour.duration as { days: number; nights: number } | undefined;
                return (
                  <tr key={tour.slug as string} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/tours/${tour.slug}`} className="font-medium text-gray-900 hover:text-primary-600">
                        {tour.name as string}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{tour.provinceSlug as string}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {CATEGORY_LABELS[tour.category as string] || (tour.category as string)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500">
                      {duration ? `${duration.days}N${duration.nights}Đ` : "—"}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500">
                      {((tour.price as number) || 0).toLocaleString("vi-VN")}₫
                    </td>
                    <td className="px-4 py-3 text-center">
                      {tour.featured ? (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Nổi bật</span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/tours/${tour.slug}`} className="text-primary-600 hover:underline mr-3">
                        Sửa
                      </Link>
                      <button onClick={() => handleDelete(tour.slug as string)} className="text-red-500 hover:underline">
                        Xoá
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
