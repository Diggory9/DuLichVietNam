"use client";

import { useEffect, useState } from "react";
import { fetchReviews, deleteReview } from "@/lib/admin-api";
import { useToast } from "@/components/ui/ToastProvider";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews()
      .then((data) => setReviews(data as Record<string, unknown>[]))
      .catch((err) => setError(err instanceof Error ? err.message : "Lỗi"))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Xoá đánh giá này?")) return;
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast("Đã xoá đánh giá", { variant: "success" });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi xoá", { variant: "error" });
    }
  }

  if (loading) return <div className="text-gray-500">Đang tải...</div>;
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản lý đánh giá</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Địa danh</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Tên</th>
              <th className="text-center px-6 py-3 font-medium text-gray-500">Rating</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Nội dung</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Ngày</th>
              <th className="text-right px-6 py-3 font-medium text-gray-500">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {reviews.map((r) => (
              <tr key={r.id as string} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700 font-medium">{r.destinationSlug as string}</td>
                <td className="px-6 py-4 text-gray-700">{r.name as string}</td>
                <td className="px-6 py-4 text-center">
                  <span className="text-amber-500 font-semibold">{"★".repeat(r.rating as number)}</span>
                  <span className="text-gray-300">{"★".repeat(5 - (r.rating as number))}</span>
                </td>
                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{(r.content as string) || "—"}</td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(r.createdAt as string).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(r.id as string)}
                    className="text-red-600 hover:underline"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reviews.length === 0 && (
          <p className="text-center text-gray-500 py-8">Chưa có đánh giá nào</p>
        )}
      </div>
    </div>
  );
}
