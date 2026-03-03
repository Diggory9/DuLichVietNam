import type { MetadataRoute } from "next";
import { getProvinceSlugs, getDestinationSlugs, getPostSlugs, getSiteConfig } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSiteConfig();
  const baseUrl = site.url;

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/kham-pha`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/bai-viet`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/ban-do`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/yeu-thich`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/ve-chung-toi`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/lien-he`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const provinceSlugs = await getProvinceSlugs();
  const provincePages: MetadataRoute.Sitemap = provinceSlugs.map((slug) => ({
    url: `${baseUrl}/tinh/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const destinationSlugs = await getDestinationSlugs();
  const destinationPages: MetadataRoute.Sitemap = destinationSlugs.map((slug) => ({
    url: `${baseUrl}/dia-danh/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const postSlugs = await getPostSlugs();
  const postPages: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
    url: `${baseUrl}/bai-viet/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...provincePages, ...destinationPages, ...postPages];
}
