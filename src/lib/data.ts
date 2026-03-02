import type { Province, Destination, SiteConfig, SearchParams, SearchResult, QuickSearchResult, Post, PaginatedResponse } from "@/types";

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
  posts: number;
  categories: number;
  regions: number;
}> {
  const data = await apiFetch<{
    provinces: number;
    destinations: number;
    posts: number;
    categories: number;
    regions: number;
  }>("/api/stats");
  if (data) return data;

  return {
    provinces: fallbackProvinces.length,
    destinations: fallbackDestinations.length,
    posts: 0,
    categories: [...new Set(fallbackDestinations.map((d) => d.category))]
      .length,
    regions: [...new Set(fallbackProvinces.map((p) => p.region))].length,
  };
}

// --- Search ---

export async function searchDestinations(
  params: SearchParams
): Promise<SearchResult> {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v) query.set(k, v);
    });
    const res = await fetch(`${API_URL}/api/destinations/search?${query}`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return { data: json.data, pagination: json.pagination };
  } catch {
    // Fallback: filter local data
    let filtered = [...fallbackDestinations];
    if (params.q) {
      const q = params.q.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.nameVi.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q)
      );
    }
    if (params.category) {
      filtered = filtered.filter((d) => d.category === params.category);
    }
    if (params.province) {
      filtered = filtered.filter((d) => d.provinceSlug === params.province);
    }
    const page = parseInt(params.page || "1");
    const limit = parseInt(params.limit || "12");
    const start = (page - 1) * limit;
    return {
      data: filtered.slice(start, start + limit),
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
    };
  }
}

export async function quickSearch(q: string): Promise<QuickSearchResult> {
  try {
    const res = await fetch(
      `${API_URL}/api/destinations/quick-search?q=${encodeURIComponent(q)}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error();
    const json = await res.json();
    return json.data;
  } catch {
    return { destinations: [], provinces: [] };
  }
}

// --- Blog / Posts ---

export async function getLatestPosts(): Promise<Post[]> {
  const data = await apiFetch<Post[]>("/api/posts/latest");
  return data || [];
}

export async function getAllPosts(
  page: number = 1,
  category?: string
): Promise<PaginatedResponse<Post>> {
  try {
    const query = new URLSearchParams({ page: String(page), limit: "12" });
    if (category) query.set("category", category);
    const res = await fetch(`${API_URL}/api/posts?${query}`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return { data: json.data, pagination: json.pagination };
  } catch {
    return {
      data: [],
      pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
    };
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const data = await apiFetch<Post>(`/api/posts/${slug}`);
  return data || undefined;
}

export async function getPostSlugs(): Promise<string[]> {
  const result = await getAllPosts(1);
  return result.data.map((p) => p.slug);
}

export async function getRelatedPosts(slug: string): Promise<Post[]> {
  const data = await apiFetch<Post[]>(`/api/posts/${slug}/related`);
  return data || [];
}
