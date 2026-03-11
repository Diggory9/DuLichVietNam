"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import ImageLightbox from "@/components/shared/ImageLightbox";
import ShareButtons from "@/components/shared/ShareButtons";
import type { Hotel } from "@/types";

interface HotelHeroProps {
  hotel: Hotel;
  siteUrl: string;
}

function renderStars(count: number) {
  return Array.from({ length: count }, (_, i) => (
    <span key={i} className="text-amber-400 text-lg">
      ★
    </span>
  ));
}

export default function HotelHero({ hotel, siteUrl }: HotelHeroProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const galleryImages = hotel.images.slice(0, 4);
  const mainImage = galleryImages[0];
  const sideImages = galleryImages.slice(1, 4);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section>
      <Container className="pt-4">
        <Breadcrumb
          items={[
            { label: "Khách sạn", href: "/khach-san" },
            { label: hotel.name },
          ]}
        />
      </Container>

      <Container className="mt-4">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 rounded-2xl overflow-hidden">
          {/* Main large image */}
          <div
            className="relative lg:col-span-2 h-72 sm:h-80 lg:h-[420px] cursor-zoom-in group"
            onClick={() => openLightbox(0)}
          >
            <ImageWithFallback
              src={mainImage?.src || ""}
              alt={mainImage?.alt || hotel.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white opacity-0 group-hover:opacity-80 transition-opacity drop-shadow-lg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </div>
          </div>

          {/* Side images */}
          {sideImages.length > 0 && (
            <div className="hidden lg:grid grid-rows-2 gap-3">
              {sideImages.map((img, i) => (
                <div
                  key={i}
                  className="relative cursor-zoom-in group overflow-hidden"
                  onClick={() => openLightbox(i + 1)}
                >
                  <ImageWithFallback
                    src={img.src}
                    alt={img.alt || hotel.name}
                    fill
                    sizes="33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                  {/* Show remaining count on last side image */}
                  {i === sideImages.length - 1 && hotel.images.length > 4 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">
                        +{hotel.images.length - 4} ảnh
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {/* Fill empty slots if less than 2 side images */}
              {sideImages.length === 1 && (
                <div className="bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-400 dark:text-gray-500 text-sm">
                    {hotel.images.length} ảnh
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hotel name, stars, address, share */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {hotel.name}
              </h1>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex items-center gap-0.5">
                {renderStars(hotel.stars)}
              </span>
              {hotel.reviewCount > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {hotel.averageRating.toFixed(1)} ({hotel.reviewCount} đánh giá)
                </span>
              )}
            </div>
            {hotel.address && (
              <p className="mt-2 text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 flex-shrink-0"
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
          </div>

          <div className="flex-shrink-0">
            <ShareButtons
              url={`${siteUrl}/khach-san/${hotel.slug}`}
              title={hotel.name}
              description={hotel.description}
            />
          </div>
        </div>
      </Container>

      {lightboxOpen && (
        <ImageLightbox
          images={hotel.images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
}
