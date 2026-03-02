import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import AnimatedSection from "@/components/shared/AnimatedSection";
import PostCard from "@/components/shared/PostCard";
import { getLatestPosts } from "@/lib/data";
import Link from "next/link";

export default async function LatestPosts() {
  const posts = await getLatestPosts();

  if (posts.length === 0) return null;

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          title="Bài viết mới nhất"
          subtitle="Kinh nghiệm, tips du lịch và những câu chuyện thú vị từ khắp Việt Nam"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, i) => (
            <AnimatedSection key={post.id || post.slug} delay={i * 0.1}>
              <PostCard post={post} />
            </AnimatedSection>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/bai-viet"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            Xem tất cả bài viết
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  );
}
