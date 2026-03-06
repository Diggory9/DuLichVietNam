import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DestinationHero from "@/components/destination/DestinationHero";
import DestinationInfo from "@/components/destination/DestinationInfo";
import LocationMap from "@/components/destination/LocationMap";
import RelatedDestinations from "@/components/destination/RelatedDestinations";
import ReviewSection from "@/components/destination/ReviewSection";
import ViewTracker from "@/components/destination/ViewTracker";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/shared/JsonLd";
import {
  getDestinationBySlug,
  getDestinationSlugs,
  getProvinceBySlug,
  getRelatedDestinations,
  getSiteConfig,
  getReviewsByDestination,
} from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getDestinationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) return {};
  const site = await getSiteConfig();

  return {
    title: destination.name,
    description: destination.description,
    openGraph: {
      title: `${destination.name} | ${site.name}`,
      description: destination.description,
      images: destination.images.map((img) => ({ url: img.src, alt: img.alt })),
    },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  const province = await getProvinceBySlug(destination.provinceSlug);
  if (!province) notFound();

  const related = await getRelatedDestinations(slug);
  const site = await getSiteConfig();
  const reviews = await getReviewsByDestination(slug);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TouristAttraction",
          name: destination.name,
          description: destination.description,
          url: `${site.url}/dia-danh/${destination.slug}`,
          image: destination.images.map((img) => img.src),
          address: destination.address
            ? {
                "@type": "PostalAddress",
                streetAddress: destination.address,
              }
            : undefined,
          geo: destination.coordinates
            ? {
                "@type": "GeoCoordinates",
                latitude: destination.coordinates.lat,
                longitude: destination.coordinates.lng,
              }
            : undefined,
        }}
      />
      <ViewTracker
        destination={{
          slug: destination.slug,
          category: destination.category,
          provinceSlug: destination.provinceSlug,
        }}
      />
      <DestinationHero destination={destination} province={province} siteUrl={site.url} />
      <DestinationInfo destination={destination} />
      <Container>
        <ReviewSection destinationSlug={slug} initialReviews={reviews} />
      </Container>
      {destination.coordinates && (
        <LocationMap
          coordinates={destination.coordinates}
          name={destination.name}
        />
      )}
      <RelatedDestinations destinations={related} />
    </>
  );
}
