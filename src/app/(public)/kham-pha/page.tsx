import { Suspense } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import SearchPageContent from "@/components/search/SearchPageContent";

export const metadata = {
  title: "Khám phá địa danh | Du Lịch Việt Nam",
  description:
    "Tìm kiếm và khám phá các địa danh du lịch trên khắp Việt Nam theo danh mục, vùng miền và tỉnh thành.",
};

export default function KhamPhaPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-16 sm:py-20">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Khám phá Việt Nam
            </h1>
            <p className="mt-4 text-white/70 text-base sm:text-lg max-w-xl mx-auto">
              Tìm kiếm và lọc những điểm đến tuyệt vời trên khắp ba miền đất nước
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <Suspense fallback={<div className="text-center py-16 text-gray-400">Đang tải...</div>}>
            <SearchPageContent />
          </Suspense>
        </Container>
      </section>
    </>
  );
}
