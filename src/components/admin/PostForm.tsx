"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

const POST_CATEGORIES = [
  { value: "du-lich", label: "Du lịch" },
  { value: "am-thuc", label: "Ẩm thực" },
  { value: "van-hoa", label: "Văn hoá" },
  { value: "meo-vat", label: "Mẹo vặt" },
  { value: "trai-nghiem", label: "Trải nghiệm" },
  { value: "tin-tuc", label: "Tin tức" },
];

interface PostFormProps {
  initialData?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<unknown>;
  isEdit?: boolean;
}

export default function PostForm({ initialData, onSubmit, isEdit }: PostFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: (initialData?.title as string) || "",
    slug: (initialData?.slug as string) || "",
    category: (initialData?.category as string) || "du-lich",
    excerpt: (initialData?.excerpt as string) || "",
    content: (initialData?.content as string) || "",
    coverImage: (initialData?.coverImage as string) || "",
    author: (initialData?.author as string) || "Admin",
    tags: ((initialData?.tags as string[]) || []).join(", "),
    published: (initialData?.published as boolean) || false,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const target = e.target;
    const value =
      target.type === "checkbox"
        ? (target as HTMLInputElement).checked
        : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const data = {
        ...form,
        tags: form.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      await onSubmit(data);
      router.push("/admin/posts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi lưu dữ liệu");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-semibold border-b pb-3">
          Thông tin cơ bản
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tiêu đề
          </label>
          <input
            name="title"
            value={form.title}
            onChange={(e) => {
              handleChange(e);
              if (!isEdit)
                setForm((prev) => ({
                  ...prev,
                  title: e.target.value,
                  slug: generateSlug(e.target.value),
                }));
            }}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none"
              required
              readOnly={isEdit}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            >
              {POST_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tóm tắt
          </label>
          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            required
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-semibold border-b pb-3">Ảnh bìa</h2>
        <ImageUploader
          value={form.coverImage}
          onChange={(url) => setForm((prev) => ({ ...prev, coverImage: url }))}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-semibold border-b pb-3">Nội dung</h2>
        <div>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={20}
            className="w-full px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-primary-500 outline-none"
            required
          />
          <p className="text-xs text-gray-400 mt-1">Hỗ trợ Markdown</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-semibold border-b pb-3">Cài đặt</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tác giả
            </label>
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (phân cách bằng dấu phẩy)
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            name="published"
            type="checkbox"
            checked={form.published}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">
            Xuất bản bài viết
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo mới"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/posts")}
          className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
        >
          Huỷ
        </button>
      </div>
    </form>
  );
}
