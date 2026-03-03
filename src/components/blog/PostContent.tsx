"use client";

import Link from "next/link";
import Markdown from "react-markdown";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import Badge from "@/components/ui/Badge";
import type { Post } from "@/types";
import { POST_CATEGORY_LABELS, type PostCategory } from "@/types";
import { calculateReadingTime } from "@/lib/utils";

interface PostContentProps {
  post: Post;
}

export default function PostContent({ post }: PostContentProps) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;
  const readingTime = calculateReadingTime(post.content);

  return (
    <article>
      {/* Back link */}
      <Link
        href="/bai-viet"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
        </svg>
        Quay lại danh sách bài viết
      </Link>

      {/* Cover image */}
      {post.coverImage && (
        <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden mb-8">
          <ImageWithFallback
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
          />
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Badge variant="primary">
          {POST_CATEGORY_LABELS[post.category as PostCategory] || post.category}
        </Badge>
        {date && <span className="text-sm text-gray-400">{date}</span>}
        <span className="text-sm text-gray-400">&middot;</span>
        <span className="text-sm text-gray-400">{readingTime} phút đọc</span>
        <span className="text-sm text-gray-400">&middot;</span>
        <span className="text-sm text-gray-400">{post.views} lượt xem</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
        {post.title}
      </h1>

      <p className="mt-2 text-sm text-gray-400">
        Bởi <span className="font-medium text-gray-600">{post.author}</span>
      </p>

      {/* Content */}
      <div className="mt-8 prose prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-img:rounded-xl">
        <Markdown>{post.content}</Markdown>
      </div>

    </article>
  );
}
