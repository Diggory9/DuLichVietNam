"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import ImageLightbox from "@/components/shared/ImageLightbox";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import ShareButtons from "@/components/shared/ShareButtons";
import type { Destination, Province } from "@/types";
import { CATEGORY_LABELS } from "@/types";

interface DestinationHeroProps {
  destination: Destination;
  province: Province;
  siteUrl: string;
}

export default function DestinationHero({ destination, province, siteUrl }: DestinationHeroProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <section>
      <Container className="pt-4">
        <Breadcrumb
          items={[
            { label: province.name, href: `/tinh/${province.slug}` },
            { label: destination.name },
          ]}
        />
      </Container>

      <div className="mt-4">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main image */}
            <div
              className="relative h-72 sm:h-96 lg:h-[500px] rounded-2xl overflow-hidden cursor-zoom-in group"
              onClick={() => setLightboxOpen(true)}
            >
              <ImageWithFallback
                src={destination.images[activeImage]?.src || ""}
                alt={destination.images[activeImage]?.alt || destination.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Zoom overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-80 transition-opacity drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
              {destination.images[activeImage]?.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <p className="text-sm text-white/90">
                    {destination.images[activeImage].caption}
                  </p>
                </div>
              )}
            </div>

            {/* Info panel */}
            <div className="flex flex-col justify-between">
              <div>
                <Badge variant="accent">
                  {CATEGORY_LABELS[destination.category]}
                </Badge>
                <div className="mt-4 flex items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                    {destination.nameVi}
                  </h1>
                  <FavoriteButton slug={destination.slug} size="md" />
                  <ShareButtons url={`${siteUrl}/dia-danh/${destination.slug}`} title={destination.nameVi} />
                </div>
                <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
                  {destination.description}
                </p>
              </div>

              {/* Thumbnail gallery */}
              {destination.images.length > 1 && (
                <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
                  {destination.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                        i === activeImage
                          ? "ring-2 ring-primary-500 ring-offset-2"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      <ImageWithFallback
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={destination.images}
          initialIndex={activeImage}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
}
