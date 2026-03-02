import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ImageWithFallback from "./ImageWithFallback";
import type { Post } from "@/types";
import { POST_CATEGORY_LABELS, type PostCategory } from "@/types";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <Link href={`/bai-viet/${post.slug}`} className="group block">
      <Card>
        <div className="relative h-48 sm:h-52">
          <ImageWithFallback
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute top-3 left-3">
            <Badge variant="primary">
              {POST_CATEGORY_LABELS[post.category as PostCategory] ||
                post.category}
            </Badge>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-base font-bold text-gray-900 tracking-tight group-hover:text-primary-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="mt-2 text-gray-500 text-sm leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
            {date && <span>{date}</span>}
            <span>&middot;</span>
            <span>{post.author}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
