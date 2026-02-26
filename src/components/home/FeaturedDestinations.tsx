import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import AnimatedSection from "@/components/shared/AnimatedSection";
import DestinationCard from "@/components/shared/DestinationCard";
import { getFeaturedDestinations } from "@/lib/data";

export default function FeaturedDestinations() {
  const destinations = getFeaturedDestinations();

  return (
    <section className="py-20 sm:py-24 bg-gray-50">
      <Container>
        <SectionHeading
          title="Địa danh nổi bật"
          subtitle="Những điểm đến được yêu thích nhất bởi du khách trong và ngoài nước"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
