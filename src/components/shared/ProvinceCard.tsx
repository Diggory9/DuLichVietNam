import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ImageWithFallback from "./ImageWithFallback";
import type { Province } from "@/types";
import { REGION_LABELS } from "@/types";

interface ProvinceCardProps {
  province: Province;
}

export default function ProvinceCard({ province }: ProvinceCardProps) {
  return (
    <Link href={`/tinh/${province.slug}`} className="group block">
      <Card>
        <div className="relative h-56 sm:h-64">
          <ImageWithFallback
            src={province.thumbnail}
            alt={province.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge variant="primary">{REGION_LABELS[province.region]}</Badge>
            <h3 className="mt-2 text-xl font-bold text-white tracking-tight">{province.name}</h3>
          </div>
        </div>
        <div className="p-5">
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
            {province.description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {province.destinationSlugs.length} địa danh
            </span>
            <span className="text-sm font-semibold text-primary-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Khám phá <span>&rarr;</span>
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
