import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProvinceHero from "@/components/province/ProvinceHero";
import ProvinceOverview from "@/components/province/ProvinceOverview";
import DestinationList from "@/components/province/DestinationList";
import JsonLd from "@/components/shared/JsonLd";
import {
  getProvinceBySlug,
  getProvinceSlugs,
  getDestinationsByProvince,
  getSiteConfig,
} from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getProvinceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const province = await getProvinceBySlug(slug);
  if (!province) return {};
  const site = await getSiteConfig();

  return {
    title: province.name,
    description: province.description,
    openGraph: {
      title: `${province.name} | ${site.name}`,
      description: province.description,
      images: [{ url: province.heroImage }],
    },
  };
}

export default async function ProvincePage({ params }: Props) {
  const { slug } = await params;
  const province = await getProvinceBySlug(slug);
  if (!province) notFound();

  const destinations = await getDestinationsByProvince(slug);
  const site = await getSiteConfig();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Place",
          name: province.name,
          description: province.description,
          url: `${site.url}/tinh/${province.slug}`,
          image: province.heroImage,
          ...(destinations.some((d) => d.coordinates) && {
            geo: {
              "@type": "GeoCoordinates",
              latitude: destinations.filter((d) => d.coordinates).reduce((sum, d) => sum + d.coordinates!.lat, 0) / destinations.filter((d) => d.coordinates).length || 0,
              longitude: destinations.filter((d) => d.coordinates).reduce((sum, d) => sum + d.coordinates!.lng, 0) / destinations.filter((d) => d.coordinates).length || 0,
            },
          }),
          containsPlace: destinations.map((d) => ({
            "@type": "TouristAttraction",
            name: d.name,
            url: `${site.url}/dia-danh/${d.slug}`,
          })),
          numberOfItems: destinations.length,
        }}
      />
      <ProvinceHero province={province} />
      <ProvinceOverview province={province} />
      <DestinationList destinations={destinations} provinceName={province.name} />
    </>
  );
}
