import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";

export default function MapLoading() {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Skeleton className="h-5 w-32 mb-4" />
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-80 mb-6" />
        <Skeleton className="h-[70vh] w-full rounded-2xl" />
      </Container>
    </section>
  );
}
