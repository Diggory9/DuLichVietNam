"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Props {
  storySlug: string;
  initialLikeCount: number;
  initialLikes: string[];
}

export default function StoryDetailClient({ storySlug, initialLikeCount }: Props) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
    const token = localStorage.getItem("dulichvietnam_token") || localStorage.getItem("admin_token");
    if (!token) {
      toast("Vui lòng đăng nhập để thích câu chuyện", { variant: "warning" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/stories/${storySlug}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setLiked(data.data.liked);
      setLikeCount(data.data.likeCount);
    } catch {
      toast("Lỗi khi thích câu chuyện", { variant: "error" });
    }
    setLoading(false);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
      <button
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          liked
            ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        } disabled:opacity-50`}
      >
        <svg
          className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : ""}`}
          fill={liked ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        {likeCount} thích
      </button>
    </div>
  );
}
