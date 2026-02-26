export interface Province {
  id: string;
  slug: string;
  name: string;
  nameVi: string;
  region: "mien-bac" | "mien-trung" | "mien-nam";
  description: string;
  longDescription: string;
  heroImage: string;
  thumbnail: string;
  population?: string;
  area?: string;
  bestTimeToVisit?: string;
  highlights: string[];
  destinationSlugs: string[];
  featured: boolean;
  order: number;
}

export interface DestinationImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  nameVi: string;
  provinceSlug: string;
  category:
    | "thien-nhien"
    | "lich-su"
    | "van-hoa"
    | "am-thuc"
    | "giai-tri"
    | "tam-linh";
  description: string;
  longDescription: string;
  images: DestinationImage[];
  tips: string[];
  address?: string;
  coordinates?: { lat: number; lng: number };
  openingHours?: string;
  entryFee?: string;
  bestTimeToVisit?: string;
  tags: string[];
  featured: boolean;
  order: number;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    github?: string;
  };
}

export type Region = Province["region"];
export type Category = Destination["category"];

export const REGION_LABELS: Record<Region, string> = {
  "mien-bac": "Miền Bắc",
  "mien-trung": "Miền Trung",
  "mien-nam": "Miền Nam",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  "thien-nhien": "Thiên nhiên",
  "lich-su": "Lịch sử",
  "van-hoa": "Văn hoá",
  "am-thuc": "Ẩm thực",
  "giai-tri": "Giải trí",
  "tam-linh": "Tâm linh",
};
