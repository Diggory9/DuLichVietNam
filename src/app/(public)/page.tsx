import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import ProvinceGrid from "@/components/home/ProvinceGrid";
import FeaturedDestinations from "@/components/home/FeaturedDestinations";
import LatestPosts from "@/components/home/LatestPosts";
import JsonLd from "@/components/shared/JsonLd";
import { getSiteConfig } from "@/lib/data";

export default async function HomePage() {
  const site = await getSiteConfig();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          description: site.description,
          url: site.url,
        }}
      />
      <HeroSection />
      <StatsSection />
      <ProvinceGrid />
      <FeaturedDestinations />
      <LatestPosts />
    </>
  );
}
