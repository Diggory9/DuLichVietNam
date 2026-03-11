import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/shared/JsonLd";
import TourHero from "@/components/tour/TourHero";
import TourInfo from "@/components/tour/TourInfo";
import TourSchedule from "@/components/tour/TourSchedule";
import TourBookingForm from "@/components/tour/TourBookingForm";
import RelatedTours from "@/components/tour/RelatedTours";
import ReviewSection from "@/components/review/ReviewSection";
import {
  getTourBySlug,
  getTourSlugs,
  getToursByProvince,
  getSiteConfig,
} from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getTourSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) return {};
  const site = await getSiteConfig();

  return {
    title: `${tour.name} | Tour`,
    description: tour.description,
    openGraph: {
      title: `${tour.name} | ${site.name}`,
      description: tour.description,
      images: tour.images.map((img) => ({ url: img.src, alt: img.alt })),
    },
  };
}

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);
  if (!tour) notFound();

  const site = await getSiteConfig();
  const relatedTours = (await getToursByProvince(tour.provinceSlug))
    .filter((t) => t.slug !== tour.slug)
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          name: tour.name,
          description: tour.description,
          url: `${site.url}/tour/${tour.slug}`,
          image: tour.images.map((img) => img.src),
          touristType: tour.category,
          itinerary: {
            "@type": "ItemList",
            itemListElement: tour.schedule.map((day) => ({
              "@type": "ListItem",
              position: day.dayNumber,
              name: day.title,
              description: day.description,
            })),
          },
        }}
      />
      <TourHero tour={tour} />
      <Container>
        <div className="py-8">
          <TourInfo tour={tour} />
        </div>
      </Container>
      {tour.schedule.length > 0 && (
        <Container>
          <div className="py-8">
            <TourSchedule schedule={tour.schedule} />
          </div>
        </Container>
      )}
      <Container>
        <div className="py-8 border-t border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Đặt tour
          </h2>
          <TourBookingForm tour={tour} />
        </div>
      </Container>
      <Container>
        <div className="py-8 border-t border-gray-100 dark:border-gray-800">
          <ReviewSection
            targetType="tour"
            targetSlug={tour.slug}
            averageRating={tour.averageRating}
            reviewCount={tour.reviewCount}
          />
        </div>
      </Container>
      {relatedTours.length > 0 && <RelatedTours tours={relatedTours} />}
    </>
  );
}
