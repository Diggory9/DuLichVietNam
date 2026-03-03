import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";
import PostCardSkeleton from "@/components/skeletons/PostCardSkeleton";

export default function BlogLoading() {
  return (
    <Container className="py-10">
      <Skeleton className="h-10 w-48 mb-2" />
      <Skeleton className="h-5 w-72 mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </Container>
  );
}
