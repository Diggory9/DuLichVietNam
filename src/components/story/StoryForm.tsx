"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Story, Destination } from "@/types";
import { useToast } from "@/components/ui/ToastProvider";
import { API_URL } from "@/lib/api-config";

interface StoryFormProps {
  initialData?: Story;
  destinations: Pick<Destination, "name" | "slug">[];
}

function getToken(): string {
  return localStorage.getItem("dulichvietnam_token") || localStorage.getItem("admin_token") || "";
}

async function uploadStoryImages(files: File[]): Promise<{ url: string }[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const res = await fetch(`${API_URL}/api/upload/user/multiple`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Lỗi tải ảnh");
  return data.data;
}

export default function StoryForm({ initialData, destinations }: StoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = !!initialData;
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    setIsAuthenticated(!!getToken());
  }, []);

  if (isAuthenticated === null) return null;

  if (!isAuthenticated && !isEdit) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Bạn cần đăng nhập để viết câu chuyện
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Đăng nhập để chia sẻ trải nghiệm du lịch của bạn với cộng đồng.
        </p>
        <Link
          href="/dang-nhap"
          className="inline-flex items-center px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Đăng nhập
        </Link>
      </div>
    );
  }

  const [form, setForm] = useState({
    title: initialData?.title || "",
    destinationSlug: initialData?.destinationSlug || "",
    content: initialData?.content || "",
    visitDate: initialData?.visitDate
      ? new Date(initialData.visitDate).toISOString().split("T")[0]
      : "",
    rating: initialData?.rating || 0,
  });

  const [photos, setPhotos] = useState<{ src: string; caption?: string }[]>(
    initialData?.photos || []
  );
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const results = await uploadStoryImages(Array.from(files));
      const newPhotos = results.map((r) => ({ src: r.url }));
      setPhotos((prev) => [...prev, ...newPhotos]);
      toast("Tải ảnh thành công!", { variant: "success" });
    } catch {
      toast("Lỗi tải ảnh", { variant: "error" });
    }
    setUploading(false);
    e.target.value = "";
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast("Vui lòng nhập tiêu đề và nội dung", { variant: "warning" });
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        title: form.title,
        content: form.content,
        destinationSlug: form.destinationSlug || undefined,
        photos,
        visitDate: form.visitDate || undefined,
        rating: form.rating || undefined,
      };

      const url = isEdit
        ? `${API_URL}/api/stories/${initialData!.slug}`
        : `${API_URL}/api/stories`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi");

      toast(
        isEdit ? "Đã cập nhật câu chuyện!" : "Đã gửi câu chuyện! Chờ admin duyệt.",
        { variant: "success" }
      );
      router.push("/cau-chuyen");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Lỗi gửi câu chuyện", {
        variant: "error",
      });
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tiêu đề *
        </label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-200 outline-none"
          placeholder="Hành trình khám phá..."
          required
        />
      </div>

      {/* Destination */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Địa danh liên quan
        </label>
        <select
          name="destinationSlug"
          value={form.destinationSlug}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-200 outline-none"
        >
          <option value="">Không chọn</option>
          {destinations.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nội dung *
        </label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          rows={12}
          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-200 outline-none resize-y"
          placeholder="Chia sẻ câu chuyện du lịch của bạn... (hỗ trợ Markdown)"
          required
        />
      </div>

      {/* Photos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Hình ảnh
        </label>
        <div className="space-y-3">
          {photos.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {photos.map((photo, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img src={photo.src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {uploading ? "Đang tải..." : "Thêm ảnh"}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Visit date & Rating */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Ngày đi
          </label>
          <input
            type="date"
            name="visitDate"
            value={form.visitDate}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-200 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Đánh giá
          </label>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, rating: prev.rating === star ? 0 : star }))}
                className="p-0.5"
              >
                <svg
                  className={`w-7 h-7 ${
                    star <= form.rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600"
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {submitting
            ? "Đang gửi..."
            : isEdit
            ? "Cập nhật"
            : "Gửi câu chuyện"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Huỷ
        </button>
      </div>
    </form>
  );
}
