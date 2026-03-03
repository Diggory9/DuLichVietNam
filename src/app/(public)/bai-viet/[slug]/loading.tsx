import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";

export default function BlogDetailLoading() {
  return (
    <Container className="py-10 max-w-3xl mx-auto">
      {/* Back link */}
      <Skeleton className="h-4 w-48 mb-6" />

      {/* Cover image */}
      <Skeleton className="h-64 sm:h-80 lg:h-96 rounded-2xl mb-8" />

      {/* Meta */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Title */}
      <Skeleton className="h-10 w-full mb-2" />
      <Skeleton className="h-10 w-2/3 mb-4" />

      {/* Author */}
      <Skeleton className="h-4 w-32 mb-8" />

      {/* Content lines */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-9/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-8/12" />
      </div>
    </Container>
  );
}
