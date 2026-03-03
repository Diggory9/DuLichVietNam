import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";
import DestinationCardSkeleton from "@/components/skeletons/DestinationCardSkeleton";

export default function SearchLoading() {
  return (
    <Container className="py-10">
      {/* Header */}
      <Skeleton className="h-10 w-64 mb-2" />
      <Skeleton className="h-5 w-96 mb-8" />

      {/* Filters skeleton */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <DestinationCardSkeleton key={i} />
        ))}
      </div>
    </Container>
  );
}
