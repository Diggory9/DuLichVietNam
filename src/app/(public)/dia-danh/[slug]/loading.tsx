import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";

export default function DestinationDetailLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="relative h-[50vh] min-h-[350px]">
        <Skeleton className="absolute inset-0 rounded-none" />
      </div>

      <Container className="py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex gap-3">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        </div>
      </Container>
    </>
  );
}
