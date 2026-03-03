import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/shared/AnimatedSection";
import MapViewLazy from "@/components/shared/MapViewLazy";

interface LocationMapProps {
  coordinates: { lat: number; lng: number };
  name: string;
}

export default function LocationMap({ coordinates, name }: LocationMapProps) {
  const singleDestination = [{
    slug: "",
    name,
    nameVi: name,
    coordinates,
    category: "",
    image: null,
  }];

  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <AnimatedSection>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-6">
            Vị trí trên bản đồ
          </h2>
          <MapViewLazy
            destinations={singleDestination}
            center={[coordinates.lat, coordinates.lng]}
            zoom={15}
            className="h-80 sm:h-96 w-full"
          />
          <p className="mt-3 text-sm text-gray-500">
            Toạ độ: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
          </p>
        </AnimatedSection>
      </Container>
    </section>
  );
}
