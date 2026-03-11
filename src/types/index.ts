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
  averageRating?: number;
  reviewCount?: number;
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

// --- Search ---

export interface SearchParams {
  q?: string;
  category?: string;
  region?: string;
  province?: string;
  sort?: string;
  page?: string;
  limit?: string;
  minRating?: string;
  priceRange?: string;
  nearLat?: string;
  nearLng?: string;
  maxDistance?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SearchResult {
  data: Destination[];
  pagination: PaginationInfo;
}

export interface QuickSearchResult {
  destinations: Pick<Destination, "name" | "slug" | "images" | "category">[];
  provinces: Pick<Province, "name" | "slug" | "thumbnail">[];
}

// --- Blog / Posts ---

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export type PostCategory =
  | "du-lich"
  | "am-thuc"
  | "van-hoa"
  | "meo-vat"
  | "trai-nghiem"
  | "tin-tuc";

export const POST_CATEGORY_LABELS: Record<PostCategory, string> = {
  "du-lich": "Du lịch",
  "am-thuc": "Ẩm thực",
  "van-hoa": "Văn hoá",
  "meo-vat": "Mẹo vặt",
  "trai-nghiem": "Trải nghiệm",
  "tin-tuc": "Tin tức",
};

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// --- Contact ---

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Comment ---

export interface Comment {
  id: string;
  postSlug: string;
  name: string;
  content: string;
  createdAt: string;
}

// --- Review ---

export type ReviewTargetType = "destination" | "hotel" | "tour";

export interface Review {
  id: string;
  destinationSlug?: string;
  targetType: ReviewTargetType;
  targetSlug: string;
  userId?: string;
  name: string;
  rating: number;
  content?: string;
  createdAt: string;
}

// --- Itinerary ---

export interface ItineraryDay {
  dayNumber: number;
  destinationSlugs: string[];
  notes?: string;
  accommodationCost?: number;
  transportCost?: number;
  mealCost?: number;
  otherCost?: number;
}

export interface Itinerary {
  id: string;
  userId: string;
  title: string;
  slug: string;
  description?: string;
  days: ItineraryDay[];
  isPublic: boolean;
  totalBudget?: number;
  createdAt: string;
  updatedAt: string;
}

// --- Story (User-Generated Content) ---

export interface StoryPhoto {
  src: string;
  caption?: string;
}

export interface Story {
  id: string;
  userId: string;
  authorName: string;
  destinationSlug?: string;
  title: string;
  slug: string;
  content: string;
  photos: StoryPhoto[];
  visitDate?: string;
  rating?: number;
  status: "pending" | "approved" | "rejected";
  likes: string[];
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryPhoto {
  src: string;
  caption?: string;
  storyTitle: string;
  storySlug: string;
  authorName: string;
}

// --- Hotel ---

export interface HotelRoom {
  name: string;
  type: "standard" | "deluxe" | "suite" | "family";
  price: number;
  maxGuests: number;
  amenities: string[];
  images: string[];
  available: boolean;
}

export interface Hotel {
  id: string;
  slug: string;
  name: string;
  nameVi: string;
  destinationSlug?: string;
  provinceSlug: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  stars: number;
  description: string;
  longDescription: string;
  images: DestinationImage[];
  priceRange: { min: number; max: number };
  amenities: string[];
  rooms: HotelRoom[];
  contact: { phone?: string; email?: string; website?: string };
  checkInTime?: string;
  checkOutTime?: string;
  policies?: string;
  featured: boolean;
  order: number;
  averageRating: number;
  reviewCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type HotelStars = 1 | 2 | 3 | 4 | 5;

export interface HotelSearchParams {
  q?: string;
  province?: string;
  minStars?: string;
  minPrice?: string;
  maxPrice?: string;
  amenities?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

// --- Tour ---

export interface TourScheduleDay {
  dayNumber: number;
  title: string;
  description: string;
  destinationSlugs: string[];
}

export type TourCategory = "van-hoa" | "thien-nhien" | "phieu-luu" | "am-thuc" | "lich-su" | "ket-hop";

export const TOUR_CATEGORY_LABELS: Record<TourCategory, string> = {
  "van-hoa": "Văn hoá",
  "thien-nhien": "Thiên nhiên",
  "phieu-luu": "Phiêu lưu",
  "am-thuc": "Ẩm thực",
  "lich-su": "Lịch sử",
  "ket-hop": "Kết hợp",
};

export interface Tour {
  id: string;
  slug: string;
  name: string;
  nameVi: string;
  destinationSlugs: string[];
  provinceSlug: string;
  category: TourCategory;
  description: string;
  longDescription: string;
  images: DestinationImage[];
  duration: { days: number; nights: number };
  price: number;
  discountPrice?: number;
  maxGroupSize: number;
  schedule: TourScheduleDay[];
  includes: string[];
  excludes: string[];
  highlights: string[];
  departureLocation?: string;
  difficulty?: "de" | "trung-binh" | "kho";
  featured: boolean;
  order: number;
  averageRating: number;
  reviewCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TourSearchParams {
  q?: string;
  province?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  minDays?: string;
  maxDays?: string;
  difficulty?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

// --- Booking ---

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type PaymentStatus = "unpaid" | "pending" | "paid" | "refunded";

export interface Booking {
  id: string;
  bookingCode: string;
  userId: string;
  type: "hotel" | "tour";
  hotelSlug?: string;
  roomName?: string;
  tourSlug?: string;
  checkIn?: string;
  checkOut?: string;
  tourDate?: string;
  guests: number;
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  notes?: string;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: "vnpay" | "bank_transfer" | "cash";
  paymentTransactionId?: string;
  paymentDate?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Notification ---

export type NotificationType = "new_post" | "comment_reply" | "review_reply" | "system";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}
