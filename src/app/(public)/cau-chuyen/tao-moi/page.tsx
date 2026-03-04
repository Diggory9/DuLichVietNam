import type { Metadata } from "next";
import { getAllDestinations } from "@/lib/data";
import Container from "@/components/ui/Container";
import StoryForm from "@/components/story/StoryForm";

export const metadata: Metadata = {
  title: "Viết câu chuyện | Du Lịch Việt Nam",
  description: "Chia sẻ câu chuyện du lịch của bạn với cộng đồng",
};

export default async function CreateStoryPage() {
  const destinations = await getAllDestinations();
  const destOptions = destinations.map((d) => ({ name: d.name, slug: d.slug }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10">
      <Container>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Viết câu chuyện
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Chia sẻ trải nghiệm du lịch của bạn
          </p>
        </div>
        <StoryForm destinations={destOptions} />
      </Container>
    </div>
  );
}
