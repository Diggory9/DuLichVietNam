import Link from "next/link";
import { getAdjacentPosts } from "@/lib/data";

interface PostNavigationProps {
  slug: string;
}

export default async function PostNavigation({ slug }: PostNavigationProps) {
  const { prev, next } = await getAdjacentPosts(slug);

  if (!prev && !next) return null;

  return (
    <nav aria-label="Điều hướng bài viết" className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {prev ? (
        <Link
          href={`/bai-viet/${prev.slug}`}
          className="group flex items-center gap-3 rounded-xl border border-gray-100 p-4 hover:border-primary-200 hover:bg-primary-50/50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0 text-gray-400 group-hover:text-primary-500 transition-colors">
            <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
          </svg>
          <div className="min-w-0">
            <span className="block text-xs text-gray-400 mb-0.5">Bài trước</span>
            <span className="block text-sm font-medium text-gray-700 group-hover:text-primary-700 transition-colors truncate">
              {prev.title}
            </span>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/bai-viet/${next.slug}`}
          className="group flex items-center justify-end gap-3 rounded-xl border border-gray-100 p-4 hover:border-primary-200 hover:bg-primary-50/50 transition-colors text-right"
        >
          <div className="min-w-0">
            <span className="block text-xs text-gray-400 mb-0.5">Tiếp theo</span>
            <span className="block text-sm font-medium text-gray-700 group-hover:text-primary-700 transition-colors truncate">
              {next.title}
            </span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0 text-gray-400 group-hover:text-primary-500 transition-colors">
            <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638l-4.158-3.96a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
          </svg>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
