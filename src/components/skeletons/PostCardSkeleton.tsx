import Skeleton from "@/components/ui/Skeleton";

export default function PostCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <Skeleton className="h-48 rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
