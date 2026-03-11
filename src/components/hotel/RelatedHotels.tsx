import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import HotelCard from "./HotelCard";
import type { Hotel } from "@/types";

interface RelatedHotelsProps {
  hotels: Hotel[];
}

export default function RelatedHotels({ hotels }: RelatedHotelsProps) {
  if (hotels.length === 0) return null;

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          title="Khách sạn liên quan"
          subtitle="Những khách sạn khác mà bạn có thể quan tâm"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {hotels.slice(0, 3).map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </Container>
    </section>
  );
}
