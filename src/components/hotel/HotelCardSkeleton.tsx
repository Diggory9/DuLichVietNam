import Skeleton from "@/components/ui/Skeleton";

export default function HotelCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Image placeholder */}
      <Skeleton className="h-48 sm:h-56 w-full rounded-none" />

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />

        {/* Address */}
        <Skeleton className="h-4 w-full" />

        {/* Description */}
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-2/3" />
        </div>

        {/* Amenity badges */}
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}
