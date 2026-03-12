"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { GalleryPhoto, PaginationInfo } from "@/types";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { API_URL } from "@/lib/api-config";

export default function GalleryClient() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 24,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/stories/gallery?limit=24`)
      .then((r) => r.json())
      .then((json) => {
        setPhotos(json.data || []);
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
    fetch(`${API_URL}/api/stories/gallery?page=${nextPage}&limit=24`)
      .then((r) => r.json())
      .then((json) => {
        setPhotos((prev) => [...prev, ...(json.data || [])]);
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg">Chưa có ảnh nào</p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
        {photos.map((photo, i) => (
          <Link
            key={i}
            href={`/cau-chuyen/${photo.storySlug}`}
            className="block break-inside-avoid rounded-xl overflow-hidden group relative"
          >
            <img
              src={photo.src}
              alt={photo.caption || photo.storyTitle}
              className="w-full group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm font-medium line-clamp-1">{photo.storyTitle}</p>
                <p className="text-white/70 text-xs">{photo.authorName}</p>
              </div>
            </div>
          </Link>
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
  );
}
