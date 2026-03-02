import { Suspense } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import PostCard from "@/components/shared/PostCard";
import CategoryFilter from "@/components/blog/CategoryFilter";
import BlogPagination from "@/components/blog/Pagination";
import { getAllPosts } from "@/lib/data";

export const metadata = {
  title: "Bài viết | Du Lịch Việt Nam",
  description:
    "Kinh nghiệm du lịch, mẹo vặt, ẩm thực và văn hoá Việt Nam từ những người yêu du lịch.",
};

interface Props {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function BaiVietPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const category = params.category || undefined;
  const result = await getAllPosts(page, category);

  return (
    <>
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16 sm:py-20">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Bài viết
            </h1>
            <p className="mt-4 text-white/70 text-base sm:text-lg max-w-xl mx-auto">
              Kinh nghiệm, tips du lịch và những câu chuyện thú vị từ khắp Việt Nam
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <Suspense>
            <CategoryFilter />
          </Suspense>

          {result.data.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">Chưa có bài viết nào</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {result.data.map((post) => (
                  <PostCard key={post.id || post.slug} post={post} />
                ))}
              </div>

              <Suspense>
                <BlogPagination pagination={result.pagination} />
              </Suspense>
            </>
          )}
        </Container>
      </section>
    </>
  );
}
