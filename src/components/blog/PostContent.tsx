"use client";

import Markdown from "react-markdown";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import Badge from "@/components/ui/Badge";
import type { Post } from "@/types";
import { POST_CATEGORY_LABELS, type PostCategory } from "@/types";

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

  return (
    <article>
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
        <span className="text-sm text-gray-400">{post.views} lượt xem</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
        {post.title}
      </h1>

      <p className="mt-2 text-sm text-gray-400">
        Bởi <span className="font-medium text-gray-600">{post.author}</span>
      </p>

      {/* Content */}
      <div className="mt-8 prose prose-gray max-w-none prose-headings:font-bold prose-a:text-primary-600 prose-img:rounded-xl">
        <Markdown>{post.content}</Markdown>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
