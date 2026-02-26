import type { Metadata } from "next";
import { getSiteConfig } from "./data";

const site = getSiteConfig();

export function createMetadata({
  title,
  description,
  image,
  path = "",
}: {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}): Metadata {
  const fullTitle = title ? `${title} | ${site.name}` : site.name;
  const fullDescription = description || site.description;
  const fullUrl = `${site.url}${path}`;
  const ogImage = image || site.ogImage;

  return {
    title: fullTitle,
    description: fullDescription,
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: site.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}
