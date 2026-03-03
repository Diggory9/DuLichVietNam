"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchPosts, deletePost, bulkUpdatePosts } from "@/lib/admin-api";
import { POST_CATEGORY_LABELS, type PostCategory } from "@/types";
import { useToast } from "@/components/ui/ToastProvider";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  function toggleSelect(slug: string) {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function toggleSelectAll() {
    if (selected.length === posts.length) {
      setSelected([]);
    } else {
      setSelected(posts.map((p) => p.slug as string));
    }
  }

  async function handleBulkAction(action: string) {
    if (selected.length === 0) return;
    const labels: Record<string, string> = { publish: "xuất bản", unpublish: "ẩn", delete: "xoá" };
    if (!confirm(`${labels[action] || action} ${selected.length} bài viết?`)) return;
    try {
      await bulkUpdatePosts(selected, action);
      if (action === "delete") {
        setPosts((prev) => prev.filter((p) => !selected.includes(p.slug as string)));
      } else {
        setPosts((prev) =>
          prev.map((p) =>
            selected.includes(p.slug as string)
              ? { ...p, published: action === "publish" }
              : p
          )
        );
      }
      setSelected([]);
      toast("Thao tác thành công", { variant: "success" });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi", { variant: "error" });
    }
  }

  useEffect(() => {
    fetchPosts()
      .then((data) => setPosts(data as Record<string, unknown>[]))
      .catch((err) => setError(err instanceof Error ? err.message : "Lỗi"))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(slug: string, title: string) {
    if (!confirm(`Xoá bài viết "${title}"? Hành động này không thể hoàn tác.`))
      return;
    try {
      await deletePost(slug);
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
      toast("Đã xoá bài viết", { variant: "success" });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi xoá", { variant: "error" });
    }
  }

  if (loading) return <div className="text-gray-500">Đang tải...</div>;
  if (error)
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Quản lý bài viết
        </h1>
        <button
          onClick={() => router.push("/admin/posts/new")}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          + Thêm bài viết mới
        </button>
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg px-4 py-3 mb-4 flex items-center gap-3">
          <span className="text-sm text-primary-700 font-medium">
            Đã chọn {selected.length} bài viết
          </span>
          <button onClick={() => handleBulkAction("publish")} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700">
            Xuất bản
          </button>
          <button onClick={() => handleBulkAction("unpublish")} className="text-xs bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700">
            Ẩn
          </button>
          <button onClick={() => handleBulkAction("delete")} className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700">
            Xoá
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
                  checked={posts.length > 0 && selected.length === posts.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">
                Tiêu đề
              </th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">
                Danh mục
              </th>
              <th className="text-center px-6 py-3 font-medium text-gray-500">
                Trạng thái
              </th>
              <th className="text-center px-6 py-3 font-medium text-gray-500">
                Lượt xem
              </th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">
                Ngày
              </th>
              <th className="text-right px-6 py-3 font-medium text-gray-500">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {posts.map((post) => (
              <tr
                key={post.slug as string}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selected.includes(post.slug as string)}
                    onChange={() => toggleSelect(post.slug as string)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {post.title as string}
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    {POST_CATEGORY_LABELS[
                      post.category as PostCategory
                    ] || (post.category as string)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {post.published ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-green-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      Đã xuất bản
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="w-2 h-2 bg-gray-300 rounded-full" />
                      Nháp
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center text-gray-500">
                  {(post.views as number) || 0}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {post.publishedAt
                    ? new Date(
                        post.publishedAt as string
                      ).toLocaleDateString("vi-VN")
                    : post.createdAt
                    ? new Date(
                        post.createdAt as string
                      ).toLocaleDateString("vi-VN")
                    : "—"}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/admin/posts/${post.slug}`}
                    className="text-primary-600 hover:underline"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() =>
                      handleDelete(
                        post.slug as string,
                        post.title as string
                      )
                    }
                    className="text-red-600 hover:underline"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            Chưa có bài viết nào
          </p>
        )}
      </div>
    </div>
  );
}
