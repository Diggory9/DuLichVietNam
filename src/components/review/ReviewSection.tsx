"use client";

import { useState, useEffect, useCallback } from "react";
import StarRating from "./StarRating";
import { getReviews, createReview } from "@/lib/review-api";
import type { Review, ReviewTargetType } from "@/types";

interface ReviewSectionProps {
  targetType: ReviewTargetType;
  targetSlug: string;
  averageRating?: number;
  reviewCount?: number;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function ReviewSection({
  targetType,
  targetSlug,
  averageRating = 0,
  reviewCount = 0,
}: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentAvg, setCurrentAvg] = useState(averageRating);
  const [currentCount, setCurrentCount] = useState(reviewCount);

  const loadReviews = useCallback(async () => {
    try {
      const data = await getReviews(targetType, targetSlug);
      setReviews(data);
      if (data.length > 0) {
        const avg =
          data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setCurrentAvg(Math.round(avg * 10) / 10);
        setCurrentCount(data.length);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [targetType, targetSlug]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (rating === 0) {
      setError("Vui lòng chọn số sao.");
      return;
    }

    const token = localStorage.getItem("dulichvietnam_token");
    if (!token) {
      setError("Vui lòng đăng nhập để đánh giá.");
      return;
    }

    setSubmitting(true);
    try {
      await createReview({
        targetType,
        targetSlug,
        rating,
        content: content.trim() || undefined,
      });
      setSuccess("Cảm ơn bạn đã đánh giá!");
      setRating(0);
      setContent("");
      loadReviews();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Có lỗi xảy ra khi gửi đánh giá."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Đánh giá
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <StarRating value={Math.round(currentAvg)} readonly size="sm" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {currentAvg > 0 ? currentAvg.toFixed(1) : "—"}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({currentCount} đánh giá)
          </span>
        </div>
      </div>

      {/* Review form */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Viết đánh giá
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Đánh giá của bạn
            </label>
            <StarRating value={rating} onChange={setRating} size="lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Nhận xét (không bắt buộc)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="Chia sẻ trải nghiệm của bạn..."
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary-200 focus:border-primary-400 outline-none resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          {success && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </form>
      </div>

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl p-5 h-24"
            />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          Chưa có đánh giá nào. Hãy là người đầu tiên!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                      {review.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {review.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                <StarRating value={review.rating} readonly size="sm" />
              </div>
              {review.content && (
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-2">
                  {review.content}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
