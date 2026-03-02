"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import type { Destination } from "@/types";
import { CATEGORY_LABELS } from "@/types";

interface DestinationCardClientProps {
  destination: Destination;
}

export default function DestinationCardClient({
  destination,
}: DestinationCardClientProps) {
  return (
    <Link href={`/dia-danh/${destination.slug}`} className="group block">
      <Card>
        <div className="relative h-48 sm:h-56">
          <ImageWithFallback
            src={destination.images[0]?.src || ""}
            alt={destination.images[0]?.alt || destination.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute top-3 left-3">
            <Badge variant="accent">
              {CATEGORY_LABELS[destination.category]}
            </Badge>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-base font-bold text-gray-900 tracking-tight group-hover:text-primary-600 transition-colors">
            {destination.name}
          </h3>
          <p className="mt-2 text-gray-500 text-sm leading-relaxed line-clamp-2">
            {destination.description}
          </p>
          {destination.entryFee && (
            <p className="mt-3 text-sm text-emerald-600 font-semibold">
              {destination.entryFee}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
