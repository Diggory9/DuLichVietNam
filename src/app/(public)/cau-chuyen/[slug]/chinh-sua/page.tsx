import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStoryBySlug, getAllDestinations } from "@/lib/data";
import Container from "@/components/ui/Container";
import StoryForm from "@/components/story/StoryForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) return { title: "Không tìm thấy" };
  return { title: `Chỉnh sửa: ${story.title}` };
}

export default async function EditStoryPage({ params }: Props) {
  const { slug } = await params;
  const [story, destinations] = await Promise.all([
    getStoryBySlug(slug),
    getAllDestinations(),
  ]);

  if (!story) notFound();

  const destOptions = destinations.map((d) => ({ name: d.name, slug: d.slug }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10">
      <Container>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Chỉnh sửa câu chuyện
          </h1>
        </div>
        <StoryForm initialData={story} destinations={destOptions} />
      </Container>
    </div>
  );
}
