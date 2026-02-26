import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/shared/AnimatedSection";

interface LocationMapProps {
  coordinates: { lat: number; lng: number };
  name: string;
}

export default function LocationMap({ coordinates, name }: LocationMapProps) {
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.01}%2C${coordinates.lat - 0.01}%2C${coordinates.lng + 0.01}%2C${coordinates.lat + 0.01}&layer=mapnik&marker=${coordinates.lat}%2C${coordinates.lng}`;

  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <AnimatedSection>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-6">
            Vị trí trên bản đồ
          </h2>
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200">
            <iframe
              title={`Bản đồ ${name}`}
              src={mapUrl}
              className="w-full h-80 sm:h-96"
              loading="lazy"
            />
          </div>
          <p className="mt-3 text-sm text-gray-500">
            Toạ độ: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
          </p>
        </AnimatedSection>
      </Container>
    </section>
  );
}
