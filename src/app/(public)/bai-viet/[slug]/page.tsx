import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Breadcrumb from "@/components/layout/Breadcrumb";
import JsonLd from "@/components/shared/JsonLd";
import PostContent from "@/components/blog/PostContent";
import PostNavigation from "@/components/blog/PostNavigation";
import RelatedPosts from "@/components/blog/RelatedPosts";
import CommentSection from "@/components/blog/CommentSection";
import ShareButtons from "@/components/shared/ShareButtons";
import { getPostBySlug, getPostSlugs, getSiteConfig, getCommentsByPost } from "@/lib/data";
import { POST_CATEGORY_LABELS, type PostCategory } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Không tìm thấy bài viết" };

  const site = await getSiteConfig();

  return {
    title: `${post.title} | ${site.name}`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt || undefined,
      authors: [post.author],
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const site = await getSiteConfig();
  const comments = await getCommentsByPost(slug);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          image: post.coverImage || undefined,
          author: {
            "@type": "Person",
            name: post.author,
          },
          datePublished: post.publishedAt || undefined,
          dateModified: post.updatedAt,
          publisher: {
            "@type": "Organization",
            name: site.name,
          },
        }}
      />

      <section className="py-12 sm:py-16">
        <Container>
          <Breadcrumb
            items={[
              { label: "Bài viết", href: "/bai-viet" },
              {
                label: POST_CATEGORY_LABELS[post.category as PostCategory] || post.category,
                href: `/bai-viet?category=${post.category}`,
              },
              {
                label: post.title.length > 50 ? post.title.slice(0, 50) + "…" : post.title,
              },
            ]}
          />

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              <PostContent post={post} />
              <PostNavigation slug={slug} />
              <CommentSection postSlug={slug} initialComments={comments} />
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-80 shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Author info */}
                <div className="rounded-xl border border-gray-100 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Tác giả</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-600">
                        {post.author.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{post.author}</p>
                      {post.publishedAt && (
                        <p className="text-xs text-gray-400">
                          {new Date(post.publishedAt).toLocaleDateString("vi-VN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="rounded-xl border border-gray-100 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Danh mục</h3>
                  <Link
                    href={`/bai-viet?category=${post.category}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-50 text-primary-700 rounded-full hover:bg-primary-100 transition-colors"
                  >
                    {POST_CATEGORY_LABELS[post.category as PostCategory] || post.category}
                  </Link>
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="rounded-xl border border-gray-100 p-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Thẻ</h3>
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

                {/* Stats */}
                <div className="rounded-xl border border-gray-100 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Thống kê</h3>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-between">
                      <span>Lượt xem</span>
                      <span className="font-medium text-gray-700">{post.views}</span>
                    </div>
                  </div>
                </div>

                {/* Share */}
                <div className="rounded-xl border border-gray-100 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Chia sẻ</h3>
                  <ShareButtons url={`${site.url}/bai-viet/${post.slug}`} title={post.title} />
                </div>
              </div>
            </aside>
          </div>

          <RelatedPosts slug={slug} />
        </Container>
      </section>
    </>
  );
}
