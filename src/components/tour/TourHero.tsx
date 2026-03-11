"use client";

import { useState } from "react";
import Link from "next/link";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import ImageLightbox from "@/components/shared/ImageLightbox";
import ShareButtons from "@/components/shared/ShareButtons";
import Badge from "@/components/ui/Badge";
import type { Tour } from "@/types";
import { TOUR_CATEGORY_LABELS } from "@/types";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

interface TourHeroProps {
  tour: Tour;
}

export default function TourHero({ tour }: TourHeroProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const displayImages = tour.images.slice(0, 5);
  const hasExtraImages = tour.images.length > 5;

  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        {/* Breadcrumb */}
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-16 pt-6 pb-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link
              href="/"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Trang chủ
            </Link>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <Link
              href="/tour"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Tour
            </Link>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-gray-900 dark:text-gray-100 font-medium truncate max-w-xs">
              {tour.name}
            </span>
          </nav>
        </div>

        {/* Image gallery */}
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-16 pb-6">
          {displayImages.length === 1 ? (
            /* Single image - full width */
            <div
              className="relative rounded-2xl overflow-hidden h-[300px] md:h-[420px] cursor-pointer group"
              onClick={() => setLightboxIndex(0)}
            >
              <ImageWithFallback
                src={displayImages[0]?.src || ""}
                alt={displayImages[0]?.alt || tour.name}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
          ) : displayImages.length <= 3 ? (
            /* 2-3 images - main + side column */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 rounded-2xl overflow-hidden h-[300px] md:h-[420px]">
              <div
                className="relative md:col-span-2 cursor-pointer group"
                onClick={() => setLightboxIndex(0)}
              >
                <ImageWithFallback
                  src={displayImages[0]?.src || ""}
                  alt={displayImages[0]?.alt || tour.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="hidden md:flex flex-col gap-2">
                {displayImages.slice(1, 3).map((img, i) => (
                  <div
                    key={i}
                    className="relative flex-1 cursor-pointer group"
                    onClick={() => setLightboxIndex(i + 1)}
                  >
                    <ImageWithFallback
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* 4-5 images - main + grid */
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden h-[300px] md:h-[420px]">
              {/* Main image */}
              <div
                className="relative md:col-span-2 md:row-span-2 cursor-pointer group"
                onClick={() => setLightboxIndex(0)}
              >
                <ImageWithFallback
                  src={displayImages[0]?.src || ""}
                  alt={displayImages[0]?.alt || tour.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>

              {/* Secondary images */}
              {displayImages.slice(1, 5).map((img, i) => (
                <div
                  key={i}
                  className="relative hidden md:block cursor-pointer group"
                  onClick={() => setLightboxIndex(i + 1)}
                >
                  <ImageWithFallback
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                  {/* Show more overlay on last image */}
                  {i === 3 && hasExtraImages && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        +{tour.images.length - 5} ảnh
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tour info header */}
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-16 pb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              {/* Category badge */}
              <Badge variant="accent" className="mb-3">
                {TOUR_CATEGORY_LABELS[tour.category]}
              </Badge>

              {/* Tour name */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {tour.name}
              </h1>

              {/* Duration */}
              <div className="mt-3 flex items-center gap-4 text-gray-600 dark:text-gray-400">
                <span className="inline-flex items-center gap-1.5 text-sm">
                  <svg
                    className="w-4 h-4"
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

            {/* Price and share */}
            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="flex items-baseline gap-2">
                {tour.discountPrice ? (
                  <>
                    <span className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatPrice(tour.discountPrice)}
                    </span>
                    <span className="text-lg text-gray-400 dark:text-gray-500 line-through">
                      {formatPrice(tour.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatPrice(tour.price)}
                  </span>
                )}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  / người
                </span>
              </div>

              <ShareButtons
                url={typeof window !== "undefined" ? window.location.href : ""}
                title={tour.name}
                description={tour.description}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <ImageLightbox
          images={tour.images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
