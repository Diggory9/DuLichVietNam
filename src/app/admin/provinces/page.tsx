"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchProvinces, deleteProvince } from "@/lib/admin-api";

const REGION_LABELS: Record<string, string> = {
  "mien-bac": "Miền Bắc",
  "mien-trung": "Miền Trung",
  "mien-nam": "Miền Nam",
};

export default function AdminProvincesPage() {
  const [provinces, setProvinces] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await fetchProvinces();
      setProvinces(data as Record<string, unknown>[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(slug: string, name: string) {
    if (!confirm(`Xoá tỉnh "${name}"? Hành động này không thể hoàn tác.`)) return;
    try {
      await deleteProvince(slug);
      setProvinces((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi xoá tỉnh");
    }
  }

  if (loading) return <div className="text-gray-500">Đang tải...</div>;
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý tỉnh thành</h1>
        <button
          onClick={() => router.push("/admin/provinces/new")}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          + Thêm tỉnh mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Tên</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Slug</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Vùng</th>
              <th className="text-center px-6 py-3 font-medium text-gray-500">Nổi bật</th>
              <th className="text-center px-6 py-3 font-medium text-gray-500">Thứ tự</th>
              <th className="text-right px-6 py-3 font-medium text-gray-500">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {provinces.map((province) => (
              <tr key={province.slug as string} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{province.name as string}</td>
                <td className="px-6 py-4 text-gray-500">{province.slug as string}</td>
                <td className="px-6 py-4 text-gray-500">{REGION_LABELS[province.region as string] || province.region as string}</td>
                <td className="px-6 py-4 text-center">
                  {province.featured ? (
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                  ) : (
                    <span className="inline-block w-2 h-2 bg-gray-300 rounded-full" />
                  )}
                </td>
                <td className="px-6 py-4 text-center text-gray-500">{province.order as number}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/admin/provinces/${province.slug}`}
                    className="text-primary-600 hover:underline"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(province.slug as string, province.name as string)}
                    className="text-red-600 hover:underline"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {provinces.length === 0 && (
          <p className="text-center text-gray-500 py-8">Chưa có tỉnh nào</p>
        )}
      </div>
    </div>
  );
}
