import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import AnimatedSection from "@/components/shared/AnimatedSection";
import DestinationCard from "@/components/shared/DestinationCard";
import type { Destination } from "@/types";

interface DestinationListProps {
  destinations: Destination[];
  provinceName: string;
}

export default function DestinationList({
  destinations,
  provinceName,
}: DestinationListProps) {
  if (destinations.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <SectionHeading
          title={`Địa danh tại ${provinceName}`}
          subtitle={`Khám phá ${destinations.length} địa danh nổi bật tại ${provinceName}`}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {destinations.map((destination, i) => (
            <AnimatedSection key={destination.id} delay={i * 0.1}>
              <DestinationCard destination={destination} />
            </AnimatedSection>
          ))}
        </div>
      </Container>
    </section>
  );
}
