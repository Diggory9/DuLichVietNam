import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { getFeaturedDestinations } from "@/lib/data";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import Card from "@/components/ui/Card";
import NotFoundClient from "./not-found-client";

const quickLinks = [
  { href: "/", label: "Trang chủ", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/kham-pha", label: "Khám phá", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { href: "/bai-viet", label: "Bài viết", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
  { href: "/ban-do", label: "Bản đồ", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
];

export default async function NotFound() {
  let destinations: { name: string; slug: string; images: { src: string; alt?: string }[]; description: string }[] = [];
  try {
    const data = await getFeaturedDestinations();
    destinations = data.slice(0, 3);
  } catch {}

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Container className="py-16 sm:py-24">
        <div className="text-center">
          {/* Animated 404 */}
          <NotFoundClient />

          <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Trang không tồn tại
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
            Hãy thử tìm kiếm hoặc quay lại trang chủ.
          </p>

          {/* Quick links */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                </svg>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <Button href="/" size="lg">
              Quay lại trang chủ
            </Button>
          </div>
        </div>

        {/* Featured destinations */}
        {destinations.length > 0 && (
          <div className="mt-16">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-6">
              Có thể bạn quan tâm
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {destinations.map((d) => (
                <Link key={d.slug} href={`/dia-danh/${d.slug}`} className="group block">
                  <Card>
                    <div className="relative h-40">
                      <ImageWithFallback
                        src={d.images[0]?.src || ""}
                        alt={d.images[0]?.alt || d.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-sm">
                        {d.name}
                      </h4>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                        {d.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
