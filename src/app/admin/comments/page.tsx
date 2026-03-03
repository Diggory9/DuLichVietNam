"use client";

import { useEffect, useState } from "react";
import { fetchComments, deleteComment, bulkDeleteComments } from "@/lib/admin-api";
import { useToast } from "@/components/ui/ToastProvider";

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const { toast } = useToast();

  function toggleSelect(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function toggleSelectAll() {
    if (selected.length === comments.length) {
      setSelected([]);
    } else {
      setSelected(comments.map((c) => c.id as string));
    }
  }

  async function handleBulkDelete() {
    if (selected.length === 0) return;
    if (!confirm(`Xoá ${selected.length} bình luận?`)) return;
    try {
      await bulkDeleteComments(selected);
      setComments((prev) => prev.filter((c) => !selected.includes(c.id as string)));
      setSelected([]);
      toast("Đã xoá bình luận", { variant: "success" });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi", { variant: "error" });
    }
  }

  useEffect(() => {
    fetchComments()
      .then((data) => setComments(data as Record<string, unknown>[]))
      .catch((err) => setError(err instanceof Error ? err.message : "Lỗi"))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Xoá bình luận này?")) return;
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
      toast("Đã xoá bình luận", { variant: "success" });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi xoá", { variant: "error" });
    }
  }

  if (loading) return <div className="text-gray-500">Đang tải...</div>;
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản lý bình luận</h1>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 flex items-center gap-3">
          <span className="text-sm text-red-700 font-medium">
            Đã chọn {selected.length} bình luận
          </span>
          <button onClick={handleBulkDelete} className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700">
            Xoá tất cả
          </button>
          <button onClick={() => setSelected([])} className="text-xs text-gray-500 hover:text-gray-700 ml-auto">
            Bỏ chọn
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={comments.length > 0 && selected.length === comments.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Bài viết</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Tên</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Nội dung</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Ngày</th>
              <th className="text-right px-6 py-3 font-medium text-gray-500">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {comments.map((c) => (
              <tr key={c.id as string} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selected.includes(c.id as string)}
                    onChange={() => toggleSelect(c.id as string)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-6 py-4 text-gray-700 font-medium">{c.postSlug as string}</td>
                <td className="px-6 py-4 text-gray-700">{c.name as string}</td>
                <td className="px-6 py-4 text-gray-500">{c.email as string}</td>
                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{c.content as string}</td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(c.createdAt as string).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(c.id as string)}
                    className="text-red-600 hover:underline"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {comments.length === 0 && (
          <p className="text-center text-gray-500 py-8">Chưa có bình luận nào</p>
        )}
      </div>
    </div>
  );
}
