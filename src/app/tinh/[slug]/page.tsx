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
  return getProvinceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const province = getProvinceBySlug(slug);
  if (!province) return {};
  const site = getSiteConfig();

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
  const province = getProvinceBySlug(slug);
  if (!province) notFound();

  const destinations = getDestinationsByProvince(slug);
  const site = getSiteConfig();

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
        }}
      />
      <ProvinceHero province={province} />
      <ProvinceOverview province={province} />
      <DestinationList destinations={destinations} provinceName={province.name} />
    </>
  );
}
