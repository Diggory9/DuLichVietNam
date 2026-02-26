"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchDestinations, deleteDestination } from "@/lib/admin-api";

const CATEGORY_LABELS: Record<string, string> = {
  "thien-nhien": "Thiên nhiên",
  "lich-su": "Lịch sử",
  "van-hoa": "Văn hoá",
  "am-thuc": "Ẩm thực",
  "giai-tri": "Giải trí",
  "tam-linh": "Tâm linh",
};

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchDestinations()
      .then((data) => setDestinations(data as Record<string, unknown>[]))
      .catch((err) => setError(err instanceof Error ? err.message : "Lỗi"))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(slug: string, name: string) {
    if (!confirm(`Xoá địa danh "${name}"? Hành động này không thể hoàn tác.`)) return;
    try {
      await deleteDestination(slug);
      setDestinations((prev) => prev.filter((d) => d.slug !== slug));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi xoá");
    }
  }

  if (loading) return <div className="text-gray-500">Đang tải...</div>;
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý địa danh</h1>
        <button
          onClick={() => router.push("/admin/destinations/new")}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          + Thêm địa danh mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Tên</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Tỉnh</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Danh mục</th>
              <th className="text-center px-6 py-3 font-medium text-gray-500">Nổi bật</th>
              <th className="text-center px-6 py-3 font-medium text-gray-500">Thứ tự</th>
              <th className="text-right px-6 py-3 font-medium text-gray-500">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {destinations.map((dest) => (
              <tr key={dest.slug as string} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{dest.name as string}</td>
                <td className="px-6 py-4 text-gray-500">{dest.provinceSlug as string}</td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    {CATEGORY_LABELS[dest.category as string] || dest.category as string}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {dest.featured ? (
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                  ) : (
                    <span className="inline-block w-2 h-2 bg-gray-300 rounded-full" />
                  )}
                </td>
                <td className="px-6 py-4 text-center text-gray-500">{dest.order as number}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link href={`/admin/destinations/${dest.slug}`} className="text-primary-600 hover:underline">
                    Sửa
                  </Link>
                  <button onClick={() => handleDelete(dest.slug as string, dest.name as string)} className="text-red-600 hover:underline">
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {destinations.length === 0 && (
          <p className="text-center text-gray-500 py-8">Chưa có địa danh nào</p>
        )}
      </div>
    </div>
  );
}
