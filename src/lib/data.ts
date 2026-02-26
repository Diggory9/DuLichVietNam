import type { Province, Destination, SiteConfig } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const REVALIDATE = 60;

// JSON fallback for build time when API is not running
import provincesJson from "@/data/provinces.json";
import destinationsJson from "@/data/destinations.json";
import siteJson from "@/data/site.json";

const fallbackProvinces = provincesJson as Province[];
const fallbackDestinations = destinationsJson as Destination[];
const fallbackSiteConfig = siteJson as SiteConfig;

async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as T;
  } catch {
    return null;
  }
}

// --- Site Config ---

export async function getSiteConfig(): Promise<SiteConfig> {
  const data = await apiFetch<SiteConfig>("/api/site-config");
  return data || fallbackSiteConfig;
}

// --- Provinces ---

export async function getAllProvinces(): Promise<Province[]> {
  const data = await apiFetch<Province[]>("/api/provinces");
  return data || fallbackProvinces.sort((a, b) => a.order - b.order);
}

export async function getFeaturedProvinces(): Promise<Province[]> {
  const data = await apiFetch<Province[]>("/api/provinces/featured");
  return (
    data ||
    fallbackProvinces
      .filter((p) => p.featured)
      .sort((a, b) => a.order - b.order)
  );
}

export async function getProvinceBySlug(
  slug: string
): Promise<Province | undefined> {
  const data = await apiFetch<Province>(`/api/provinces/${slug}`);
  return data || fallbackProvinces.find((p) => p.slug === slug);
}

export async function getProvinceSlugs(): Promise<string[]> {
  const provinces = await getAllProvinces();
  return provinces.map((p) => p.slug);
}

// --- Destinations ---

export async function getAllDestinations(): Promise<Destination[]> {
  const data = await apiFetch<Destination[]>("/api/destinations");
  return data || fallbackDestinations.sort((a, b) => a.order - b.order);
}

export async function getFeaturedDestinations(): Promise<Destination[]> {
  const data = await apiFetch<Destination[]>("/api/destinations/featured");
  return (
    data ||
    fallbackDestinations
      .filter((d) => d.featured)
      .sort((a, b) => a.order - b.order)
  );
}

export async function getDestinationBySlug(
  slug: string
): Promise<Destination | undefined> {
  const data = await apiFetch<Destination>(`/api/destinations/${slug}`);
  return data || fallbackDestinations.find((d) => d.slug === slug);
}

export async function getDestinationSlugs(): Promise<string[]> {
  const destinations = await getAllDestinations();
  return destinations.map((d) => d.slug);
}

export async function getDestinationsByProvince(
  provinceSlug: string
): Promise<Destination[]> {
  const data = await apiFetch<Destination[]>(
    `/api/destinations/by-province/${provinceSlug}`
  );
  return (
    data ||
    fallbackDestinations
      .filter((d) => d.provinceSlug === provinceSlug)
      .sort((a, b) => a.order - b.order)
  );
}

export async function getRelatedDestinations(
  currentSlug: string,
  limit: number = 3
): Promise<Destination[]> {
  const data = await apiFetch<Destination[]>(
    `/api/destinations/${currentSlug}/related`
  );
  if (data) return data;

  const current = fallbackDestinations.find((d) => d.slug === currentSlug);
  if (!current) return [];
  return fallbackDestinations
    .filter(
      (d) =>
        d.slug !== currentSlug &&
        (d.provinceSlug === current.provinceSlug ||
          d.category === current.category)
    )
    .sort((a, b) => a.order - b.order)
    .slice(0, limit);
}

// --- Stats ---

export async function getStats(): Promise<{
  provinces: number;
  destinations: number;
  categories: number;
  regions: number;
}> {
  const data = await apiFetch<{
    provinces: number;
    destinations: number;
    categories: number;
    regions: number;
  }>("/api/stats");
  if (data) return data;

  return {
    provinces: fallbackProvinces.length,
    destinations: fallbackDestinations.length,
    categories: [...new Set(fallbackDestinations.map((d) => d.category))]
      .length,
    regions: [...new Set(fallbackProvinces.map((p) => p.region))].length,
  };
}
