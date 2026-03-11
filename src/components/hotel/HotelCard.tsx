import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import type { Hotel } from "@/types";

interface HotelCardProps {
  hotel: Hotel;
}

const ROOM_TYPE_LABELS: Record<string, string> = {
  standard: "Tiêu chuẩn",
  deluxe: "Cao cấp",
  suite: "Suite",
  family: "Gia đình",
};

function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function renderStars(count: number) {
  return Array.from({ length: count }, (_, i) => (
    <span key={i} className="text-amber-400">
      ★
    </span>
  ));
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const displayAmenities = hotel.amenities.slice(0, 4);
  const remainingCount = hotel.amenities.length - displayAmenities.length;

  return (
    <Link href={`/khach-san/${hotel.slug}`} className="group block">
      <Card>
        {/* Image */}
        <div className="relative h-48 sm:h-56">
          <ImageWithFallback
            src={hotel.images[0]?.src || ""}
            alt={hotel.images[0]?.alt || hotel.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Stars badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="accent">
              <span className="flex items-center gap-0.5">
                {renderStars(hotel.stars)}
              </span>
            </Badge>
          </div>

          {/* Price range */}
          <div className="absolute bottom-3 right-3">
            <span className="inline-flex items-center rounded-lg bg-white/90 dark:bg-gray-900/90 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 backdrop-blur-sm">
              {formatVND(hotel.priceRange.min)} - {formatVND(hotel.priceRange.max)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {hotel.name}
          </h3>

          {/* Address */}
          {hotel.address && (
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-1 flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {hotel.address}
            </p>
          )}

          {/* Description */}
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
            {hotel.description}
          </p>

          {/* Amenities badges */}
          {displayAmenities.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {displayAmenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300"
                >
                  {amenity}
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-400 dark:text-gray-500">
                  +{remainingCount}
                </span>
              )}
            </div>
          )}

          {/* Rating */}
          {hotel.reviewCount > 0 && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                <svg
                  className="w-4 h-4 fill-amber-400"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {hotel.averageRating.toFixed(1)}
              </span>
              <span className="text-gray-400 dark:text-gray-500">
                ({hotel.reviewCount} đánh giá)
              </span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
