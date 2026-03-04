import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStoryBySlug } from "@/lib/data";
import Container from "@/components/ui/Container";
import ShareButtons from "@/components/shared/ShareButtons";
import StoryDetailClient from "./StoryDetailClient";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) return { title: "Không tìm thấy câu chuyện" };
  return {
    title: `${story.title} | Câu chuyện du lịch`,
    description: story.content.slice(0, 160),
  };
}

export default async function StoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-10">
      <Container>
        <article className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {story.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {story.authorName}
                </span>
                {story.visitDate && (
                  <>
                    <span>&middot;</span>
                    <span>
                      {new Date(story.visitDate).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </>
                )}
                {story.rating && (
                  <>
                    <span>&middot;</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < story.rating!
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-300 fill-gray-300"
                          }`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <ShareButtons
                url={`${siteUrl}/cau-chuyen/${story.slug}`}
                title={story.title}
                description={story.content.slice(0, 200)}
              />
            </div>
          </header>

          {/* Photos */}
          {story.photos.length > 0 && (
            <div className={`mb-8 grid gap-3 ${
              story.photos.length === 1
                ? "grid-cols-1"
                : story.photos.length === 2
                ? "grid-cols-2"
                : "grid-cols-2 sm:grid-cols-3"
            }`}>
              {story.photos.map((photo, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <img
                    src={photo.src}
                    alt={photo.caption || story.title}
                    className="w-full h-full object-cover"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                  {photo.caption && (
                    <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2">
                      {photo.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            {story.content.split("\n").map((p, i) =>
              p.trim() ? <p key={i}>{p}</p> : null
            )}
          </div>

          {/* Like button (client component) */}
          <StoryDetailClient storySlug={story.slug} initialLikeCount={story.likeCount} initialLikes={story.likes} />
        </article>
      </Container>
    </div>
  );
}
