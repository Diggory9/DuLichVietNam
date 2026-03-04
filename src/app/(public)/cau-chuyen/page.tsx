import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import StoriesListClient from "./StoriesListClient";

export const metadata: Metadata = {
  title: "Câu chuyện du lịch | Du Lịch Việt Nam",
  description: "Đọc và chia sẻ những câu chuyện du lịch Việt Nam từ cộng đồng",
};

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10">
      <Container>
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Câu chuyện du lịch
          </h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Những trải nghiệm thực tế từ cộng đồng yêu du lịch Việt Nam
          </p>
        </div>
        <StoriesListClient />
      </Container>
    </div>
  );
}
