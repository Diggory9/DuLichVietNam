import provincesData from "@/data/provinces.json";
import destinationsData from "@/data/destinations.json";
import siteData from "@/data/site.json";
import type { Province, Destination, SiteConfig } from "@/types";

const provinces: Province[] = provincesData as Province[];
const destinations: Destination[] = destinationsData as Destination[];

export function getSiteConfig(): SiteConfig {
  return siteData as SiteConfig;
}

export function getAllProvinces(): Province[] {
  return provinces.sort((a, b) => a.order - b.order);
}

export function getFeaturedProvinces(): Province[] {
  return provinces.filter((p) => p.featured).sort((a, b) => a.order - b.order);
}

export function getProvinceBySlug(slug: string): Province | undefined {
  return provinces.find((p) => p.slug === slug);
}

export function getProvinceSlugs(): string[] {
  return provinces.map((p) => p.slug);
}

export function getAllDestinations(): Destination[] {
  return destinations.sort((a, b) => a.order - b.order);
}

export function getFeaturedDestinations(): Destination[] {
  return destinations
    .filter((d) => d.featured)
    .sort((a, b) => a.order - b.order);
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

export function getDestinationSlugs(): string[] {
  return destinations.map((d) => d.slug);
}

export function getDestinationsByProvince(provinceSlug: string): Destination[] {
  return destinations
    .filter((d) => d.provinceSlug === provinceSlug)
    .sort((a, b) => a.order - b.order);
}

export function getRelatedDestinations(
  currentSlug: string,
  limit: number = 3
): Destination[] {
  const current = getDestinationBySlug(currentSlug);
  if (!current) return [];

  return destinations
    .filter(
      (d) =>
        d.slug !== currentSlug &&
        (d.provinceSlug === current.provinceSlug ||
          d.category === current.category)
    )
    .sort((a, b) => a.order - b.order)
    .slice(0, limit);
}

export function getStats() {
  return {
    provinces: provinces.length,
    destinations: destinations.length,
    categories: [...new Set(destinations.map((d) => d.category))].length,
    regions: [...new Set(provinces.map((p) => p.region))].length,
  };
}
