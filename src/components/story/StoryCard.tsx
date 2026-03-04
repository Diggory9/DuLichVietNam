"use client";

import Link from "next/link";
import type { Story } from "@/types";
import ImageWithFallback from "@/components/shared/ImageWithFallback";

interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
  const coverPhoto = story.photos[0]?.src;
  const visitDateStr = story.visitDate
    ? new Date(story.visitDate).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
      })
    : null;

  return (
    <Link
      href={`/cau-chuyen/${story.slug}`}
      className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {coverPhoto ? (
          <ImageWithFallback
            src={coverPhoto}
            alt={story.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
            <svg className="w-12 h-12 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
        {story.status === "pending" && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-xs rounded-full font-medium">
            Chờ duyệt
          </span>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {story.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium">{story.authorName}</span>
          {visitDateStr && (
            <>
              <span>&middot;</span>
              <span>{visitDateStr}</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between">
          {story.rating && (
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < story.rating! ? "text-amber-400 fill-amber-400" : "text-gray-300 fill-gray-300"
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {story.likeCount}
          </div>
        </div>
      </div>
    </Link>
  );
}
