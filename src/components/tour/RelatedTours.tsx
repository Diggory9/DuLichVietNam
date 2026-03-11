import TourCard from "@/components/tour/TourCard";
import type { Tour } from "@/types";

interface RelatedToursProps {
  tours: Tour[];
}

export default function RelatedTours({ tours }: RelatedToursProps) {
  if (tours.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Tour liên quan
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </section>
  );
}
