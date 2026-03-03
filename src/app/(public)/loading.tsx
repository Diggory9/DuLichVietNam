import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";
import DestinationCardSkeleton from "@/components/skeletons/DestinationCardSkeleton";

export default function HomeLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Skeleton className="absolute inset-0 rounded-none" />
      </div>

      {/* Stats skeleton */}
      <div className="py-14 sm:py-16">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center p-4 space-y-3">
                <Skeleton className="h-8 w-8 mx-auto rounded-full" />
                <Skeleton className="h-10 w-20 mx-auto" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Destinations skeleton */}
      <Container className="py-12">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <DestinationCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    </>
  );
}
