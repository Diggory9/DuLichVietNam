import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import TourSearchContent from "@/components/tour/TourSearchContent";

export const metadata: Metadata = {
  title: "Tour du lịch",
  description: "Khám phá các tour du lịch hấp dẫn trên khắp Việt Nam",
};

export default function ToursPage() {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Tour du lịch
          </h1>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Trải nghiệm những tour du lịch tuyệt vời tại Việt Nam
          </p>
        </div>
        <TourSearchContent />
      </Container>
    </section>
  );
}
