import type { MetadataRoute } from "next";
import { getProvinceSlugs, getDestinationSlugs, getSiteConfig } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteConfig();
  const baseUrl = site.url;

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/ve-chung-toi`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/lien-he`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const provincePages: MetadataRoute.Sitemap = getProvinceSlugs().map((slug) => ({
    url: `${baseUrl}/tinh/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const destinationPages: MetadataRoute.Sitemap = getDestinationSlugs().map((slug) => ({
    url: `${baseUrl}/dia-danh/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...provincePages, ...destinationPages];
}
