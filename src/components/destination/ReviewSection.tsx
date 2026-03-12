"use client";

import { useState, useEffect } from "react";
import StarRating from "@/components/shared/StarRating";
import StarRatingInput from "@/components/shared/StarRatingInput";
import type { Review } from "@/types";
import { API_URL } from "@/lib/api-config";

interface ReviewSectionProps {
  destinationSlug: string;
  initialReviews: Review[];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

export default function ReviewSection({ destinationSlug, initialReviews }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dulichvietnam_reviewer");
      if (saved) {
        const { name: n, email: e } = JSON.parse(saved);
        if (n) setName(n);
        if (e) setEmail(e);
      }
    } catch {}
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !rating) {
      setError("Vui lòng nhập tên, email và chọn số sao");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationSlug,
          name: name.trim(),
          email: email.trim(),
          rating,
          content: content.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gửi thất bại");
      }
      const { data } = await res.json();
      setReviews((prev) => [data, ...prev]);
      setContent("");
      setRating(0);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      localStorage.setItem("dulichvietnam_reviewer", JSON.stringify({ name, email }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  const avgRating =
    reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

  return (
    <div className="mt-12 border-t border-gray-100 pt-10">
      <div className="flex items-center gap-4 flex-wrap">
        <h2 className="text-xl font-bold text-gray-900">
          Đánh giá ({reviews.length})
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={avgRating} size="md" />
            <span className="text-lg font-semibold text-gray-700">{avgRating}</span>
          </div>
        )}
      </div>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4 bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900">Viết đánh giá</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Họ tên *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          />
          <input
            type="email"
            placeholder="Email * (không hiển thị công khai)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Đánh giá *</label>
          <StarRatingInput value={rating} onChange={setRating} />
        </div>
        <textarea
          placeholder="Chia sẻ trải nghiệm của bạn (không bắt buộc)"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-emerald-600 text-sm">Đánh giá đã được gửi!</p>}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </form>

      {/* Review List */}
      <div className="mt-8 space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-amber-600">
                {review.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-900">{review.name}</span>
                <StarRating rating={review.rating} size="sm" />
                <span className="text-xs text-gray-400">{timeAgo(review.createdAt)}</span>
              </div>
              {review.content && (
                <p className="mt-1 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {review.content}
                </p>
              )}
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">
            Chưa có đánh giá nào. Hãy là người đầu tiên!
          </p>
        )}
      </div>
    </div>
  );
}
