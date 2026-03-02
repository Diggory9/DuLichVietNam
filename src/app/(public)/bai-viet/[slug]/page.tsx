import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/shared/JsonLd";
import PostContent from "@/components/blog/PostContent";
import RelatedPosts from "@/components/blog/RelatedPosts";
import { getPostBySlug, getPostSlugs, getSiteConfig } from "@/lib/data";

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
          <div className="max-w-3xl mx-auto">
            <PostContent post={post} />
          </div>

          <div className="max-w-5xl mx-auto">
            <RelatedPosts slug={slug} />
          </div>
        </Container>
      </section>
    </>
  );
}
