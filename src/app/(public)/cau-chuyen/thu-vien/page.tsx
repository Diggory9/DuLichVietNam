import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Thư viện ảnh cộng đồng | Du Lịch Việt Nam",
  description: "Bộ sưu tập ảnh du lịch Việt Nam từ cộng đồng",
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10">
      <Container>
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Thư viện ảnh cộng đồng
          </h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Những khoảnh khắc đẹp được chia sẻ bởi cộng đồng du lịch
          </p>
        </div>
        <GalleryClient />
      </Container>
    </div>
  );
}
