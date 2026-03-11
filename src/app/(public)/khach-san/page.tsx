import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import HotelSearchContent from "@/components/hotel/HotelSearchContent";

export const metadata: Metadata = {
  title: "Khách sạn",
  description: "Tìm kiếm và đặt phòng khách sạn tốt nhất tại Việt Nam",
};

export default function HotelsPage() {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Khách sạn
          </h1>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Khám phá và đặt phòng khách sạn chất lượng trên khắp Việt Nam
          </p>
        </div>
        <HotelSearchContent />
      </Container>
    </section>
  );
}
