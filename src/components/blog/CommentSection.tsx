"use client";

import { useState, useEffect } from "react";
import type { Comment } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface CommentSectionProps {
  postSlug: string;
  initialComments: Comment[];
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

export default function CommentSection({ postSlug, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dulichvietnam_commenter");
      if (saved) {
        const { name: n, email: e } = JSON.parse(saved);
        if (n) setName(n);
        if (e) setEmail(e);
      }
    } catch {}
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !content.trim()) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postSlug, name: name.trim(), email: email.trim(), content: content.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gửi thất bại");
      }
      const { data } = await res.json();
      setComments((prev) => [data, ...prev]);
      setContent("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      localStorage.setItem("dulichvietnam_commenter", JSON.stringify({ name, email }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-12 border-t border-gray-100 pt-10">
      <h2 className="text-xl font-bold text-gray-900">
        Bình luận ({comments.length})
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Họ tên *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <input
            type="email"
            placeholder="Email * (không hiển thị công khai)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <textarea
          placeholder="Viết bình luận..."
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-emerald-600 text-sm">Bình luận đã được gửi!</p>}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Đang gửi..." : "Gửi bình luận"}
        </button>
      </form>

      {/* Comment List */}
      <div className="mt-8 space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary-600">
                {comment.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">{comment.name}</span>
                <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
              </div>
              <p className="mt-1 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </p>
        )}
      </div>
    </div>
  );
}
