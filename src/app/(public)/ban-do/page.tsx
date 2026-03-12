import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Breadcrumb from "@/components/layout/Breadcrumb";
import MapViewLazy from "@/components/shared/MapViewLazy";
import type { MapDestination } from "@/components/shared/MapView";
import { API_URL } from "@/lib/api-config";

export const metadata: Metadata = {
  title: "Bản đồ du lịch Việt Nam",
  description: "Khám phá các điểm đến du lịch Việt Nam trên bản đồ tương tác",
};

async function getMapDestinations(): Promise<MapDestination[]> {
  try {
    const res = await fetch(`${API_URL}/api/destinations/map`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data;
  } catch {
    return [];
  }
}

export default async function MapPage() {
  const destinations = await getMapDestinations();

  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Breadcrumb items={[{ label: "Bản đồ" }]} />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          Bản đồ du lịch
        </h1>
        <p className="text-gray-500 mb-6">
          Khám phá {destinations.length} điểm đến trên bản đồ Việt Nam
        </p>
        <MapViewLazy destinations={destinations} />
      </Container>
    </section>
  );
}
