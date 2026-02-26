import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import AnimatedSection from "@/components/shared/AnimatedSection";
import DestinationCard from "@/components/shared/DestinationCard";
import type { Destination } from "@/types";

interface RelatedDestinationsProps {
  destinations: Destination[];
}

export default function RelatedDestinations({ destinations }: RelatedDestinationsProps) {
  if (destinations.length === 0) return null;

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          title="Địa danh liên quan"
          subtitle="Những điểm đến khác mà bạn có thể quan tâm"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {destinations.map((destination, i) => (
            <AnimatedSection key={destination.id} delay={i * 0.1}>
              <DestinationCard destination={destination} showProvince />
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
