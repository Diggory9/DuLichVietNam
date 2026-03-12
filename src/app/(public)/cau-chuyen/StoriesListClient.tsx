"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Story, PaginationInfo } from "@/types";
import StoryCard from "@/components/story/StoryCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { API_URL } from "@/lib/api-config";

export default function StoriesListClient() {
  const [stories, setStories] = useState<Story[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/stories?page=1&limit=12`)
      .then((r) => r.json())
      .then((json) => {
        setStories(json.data || []);
        setPagination(json.pagination || pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = useCallback(() => {
    if (loadingMore) return;
    setLoadingMore(true);
    const nextPage = pagination.page + 1;
    fetch(`${API_URL}/api/stories?page=${nextPage}&limit=12`)
      .then((r) => r.json())
      .then((json) => {
        setStories((prev) => [...prev, ...(json.data || [])]);
        setPagination(json.pagination);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }, [pagination.page, loadingMore]);

  const hasMore = pagination.page < pagination.totalPages;
  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isLoading: loading || loadingMore,
    onLoadMore: loadMore,
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[16/14] rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-6">
        <Link
          href="/cau-chuyen/tao-moi"
          className="px-5 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          Viết câu chuyện
        </Link>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">Chưa có câu chuyện nào</p>
          <p className="text-gray-300 text-sm mt-2">
            Hãy là người đầu tiên chia sẻ trải nghiệm!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((s) => (
              <StoryCard key={s.id} story={s} />
            ))}
          </div>

          <div ref={sentinelRef} className="h-1" />

          {loadingMore && (
            <div className="flex justify-center py-6">
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-sm">Đang tải thêm...</span>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
