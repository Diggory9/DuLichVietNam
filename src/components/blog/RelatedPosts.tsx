import PostCard from "@/components/shared/PostCard";
import { getRelatedPosts } from "@/lib/data";

interface RelatedPostsProps {
  slug: string;
}

export default async function RelatedPosts({ slug }: RelatedPostsProps) {
  const posts = await getRelatedPosts(slug);

  if (posts.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-8">
        Bài viết liên quan
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id || post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
