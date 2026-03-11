import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/shared/JsonLd";
import HotelHero from "@/components/hotel/HotelHero";
import HotelInfo from "@/components/hotel/HotelInfo";
import RoomList from "@/components/hotel/RoomList";
import HotelBookingForm from "@/components/hotel/HotelBookingForm";
import RelatedHotels from "@/components/hotel/RelatedHotels";
import ReviewSection from "@/components/review/ReviewSection";
import {
  getHotelBySlug,
  getHotelSlugs,
  getHotelsByProvince,
  getSiteConfig,
} from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getHotelSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hotel = await getHotelBySlug(slug);
  if (!hotel) return {};
  const site = await getSiteConfig();

  return {
    title: `${hotel.name} | Khách sạn`,
    description: hotel.description,
    openGraph: {
      title: `${hotel.name} | ${site.name}`,
      description: hotel.description,
      images: hotel.images.map((img) => ({ url: img.src, alt: img.alt })),
    },
  };
}

export default async function HotelDetailPage({ params }: Props) {
  const { slug } = await params;
  const hotel = await getHotelBySlug(slug);
  if (!hotel) notFound();

  const site = await getSiteConfig();
  const relatedHotels = (await getHotelsByProvince(hotel.provinceSlug))
    .filter((h) => h.slug !== hotel.slug)
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Hotel",
          name: hotel.name,
          description: hotel.description,
          url: `${site.url}/khach-san/${hotel.slug}`,
          image: hotel.images.map((img) => img.src),
          starRating: { "@type": "Rating", ratingValue: hotel.stars },
          address: {
            "@type": "PostalAddress",
            streetAddress: hotel.address,
          },
          ...(hotel.coordinates && {
            geo: {
              "@type": "GeoCoordinates",
              latitude: hotel.coordinates.lat,
              longitude: hotel.coordinates.lng,
            },
          }),
          priceRange: `${hotel.priceRange.min.toLocaleString("vi-VN")}₫ - ${hotel.priceRange.max.toLocaleString("vi-VN")}₫`,
        }}
      />
      <HotelHero hotel={hotel} siteUrl={site.url} />
      <HotelInfo hotel={hotel} />
      <Container>
        <div className="py-8">
          <RoomList hotel={hotel} />
        </div>
        <div className="py-8 border-t border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Đặt phòng
          </h2>
          <HotelBookingForm hotel={hotel} />
        </div>
      </Container>
      <Container>
        <div className="py-8 border-t border-gray-100 dark:border-gray-800">
          <ReviewSection
            targetType="hotel"
            targetSlug={hotel.slug}
            averageRating={hotel.averageRating}
            reviewCount={hotel.reviewCount}
          />
        </div>
      </Container>
      {relatedHotels.length > 0 && <RelatedHotels hotels={relatedHotels} />}
    </>
  );
}
