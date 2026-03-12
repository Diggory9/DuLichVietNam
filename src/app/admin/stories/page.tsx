"use client";

import { useState, useEffect } from "react";
import type { Story, PaginationInfo } from "@/types";
import { useToast } from "@/components/ui/ToastProvider";
import { useAuth } from "@/components/admin/AuthProvider";
import Link from "next/link";
import { API_URL } from "@/lib/api-config";

const statusLabels: Record<string, string> = {
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { token } = useAuth();

  function getAuthHeaders() {
    const t = token || localStorage.getItem("admin_token") || "";
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${t}`,
    };
  }

  const loadStories = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (filter) params.set("status", filter);
      const res = await fetch(`${API_URL}/api/admin/stories?${params}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStories(data.data as Story[]);
      setPagination(data.pagination);
    } catch {
      toast("Lỗi tải danh sách câu chuyện", { variant: "error" });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) loadStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, token]);

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected" | "pending") => {
    try {
      const res = await fetch(`${API_URL}/api/admin/stories/${id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      const msgs: Record<string, string> = {
        approved: "Đã duyệt câu chuyện",
        rejected: "Đã từ chối câu chuyện",
        pending: "Đã hủy duyệt câu chuyện",
      };
      toast(msgs[status] || "Đã cập nhật", { variant: "success" });
      loadStories(pagination.page);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi cập nhật trạng thái", { variant: "error" });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Quản lý câu chuyện
        </h1>
        <div className="flex gap-2">
          {["", "pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${
                filter === s
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              {s === "" ? "Tất cả" : statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg" />
          ))}
        </div>
      ) : stories.length === 0 ? (
        <p className="text-center text-gray-400 py-10">Không có câu chuyện nào</p>
      ) : (
        <div className="space-y-3">
          {stories.map((story) => (
            <div
              key={story.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="flex-1 min-w-0">
                <Link
                  href={`/cau-chuyen/${story.slug}`}
                  className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 line-clamp-1"
                >
                  {story.title}
                </Link>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span>{story.authorName}</span>
                  <span>{new Date(story.createdAt).toLocaleDateString("vi-VN")}</span>
                  <span>{story.photos.length} ảnh</span>
                  <span>{story.likeCount} thích</span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <span
                  className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                    statusColors[story.status]
                  }`}
                >
                  {statusLabels[story.status]}
                </span>
                {story.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(story.id, "approved")}
                      className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Duyệt
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(story.id, "rejected")}
                      className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Từ chối
                    </button>
                  </>
                )}
                {story.status === "approved" && (
                  <button
                    onClick={() => handleStatusUpdate(story.id, "pending")}
                    className="px-3 py-1.5 text-xs bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    Hủy duyệt
                  </button>
                )}
                {story.status === "rejected" && (
                  <button
                    onClick={() => handleStatusUpdate(story.id, "approved")}
                    className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Duyệt lại
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => loadStories(p)}
                    className={`w-8 h-8 text-xs rounded-lg font-medium ${
                      p === pagination.page
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
