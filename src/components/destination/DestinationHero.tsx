"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import type { Destination, Province } from "@/types";
import { CATEGORY_LABELS } from "@/types";

interface DestinationHeroProps {
  destination: Destination;
  province: Province;
}

export default function DestinationHero({ destination, province }: DestinationHeroProps) {
  const [activeImage, setActiveImage] = useState(0);

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
            <div className="relative h-72 sm:h-96 lg:h-[500px] rounded-2xl overflow-hidden">
              <ImageWithFallback
                src={destination.images[activeImage]?.src || ""}
                alt={destination.images[activeImage]?.alt || destination.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
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
                <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                  {destination.nameVi}
                </h1>
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
    </section>
  );
}
