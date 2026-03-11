import Skeleton from "@/components/ui/Skeleton";

export default function TourCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Image area */}
      <Skeleton className="h-48 sm:h-56 w-full rounded-none" />

      {/* Content area */}
      <div className="p-5">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />

        {/* Description */}
        <div className="mt-2 space-y-1.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Price and rating */}
        <div className="mt-3 flex items-center justify-between">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}
