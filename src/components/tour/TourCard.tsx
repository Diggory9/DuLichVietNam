import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import StarRating from "@/components/shared/StarRating";
import type { Tour } from "@/types";
import { TOUR_CATEGORY_LABELS } from "@/types";

const DIFFICULTY_LABELS: Record<string, string> = {
  de: "Dễ",
  "trung-binh": "Trung bình",
  kho: "Khó",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  de: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  "trung-binh": "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  kho: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  return (
    <Link href={`/tour/${tour.slug}`} className="group block">
      <Card>
        <div className="relative h-48 sm:h-56">
          <ImageWithFallback
            src={tour.images[0]?.src || ""}
            alt={tour.images[0]?.alt || tour.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="accent">
              {TOUR_CATEGORY_LABELS[tour.category]}
            </Badge>
          </div>

          {/* Difficulty badge */}
          {tour.difficulty && (
            <div className="absolute top-3 right-3">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${DIFFICULTY_COLORS[tour.difficulty]}`}
              >
                {DIFFICULTY_LABELS[tour.difficulty]}
              </span>
            </div>
          )}

          {/* Duration badge */}
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {tour.duration.days} ngày {tour.duration.nights} đêm
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {tour.name}
          </h3>

          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
            {tour.description}
          </p>

          <div className="mt-3 flex items-center justify-between">
            {/* Price */}
            <div className="flex items-baseline gap-2">
              {tour.discountPrice ? (
                <>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPrice(tour.discountPrice)}
                  </span>
                  <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                    {formatPrice(tour.price)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {formatPrice(tour.price)}
                </span>
              )}
            </div>

            {/* Rating */}
            {tour.reviewCount > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <StarRating rating={tour.averageRating} size="sm" />
                <span>({tour.reviewCount})</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
