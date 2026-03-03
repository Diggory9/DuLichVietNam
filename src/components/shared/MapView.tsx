"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CATEGORY_LABELS, type Category } from "@/types";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface MapDestination {
  slug: string;
  name: string;
  nameVi: string;
  coordinates: { lat: number; lng: number };
  category: string;
  image: string | null;
}

interface MapViewProps {
  destinations: MapDestination[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

function FitBounds({ destinations }: { destinations: MapDestination[] }) {
  const map = useMap();
  useEffect(() => {
    if (destinations.length > 0) {
      const bounds = L.latLngBounds(
        destinations.map((d) => [d.coordinates.lat, d.coordinates.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, destinations]);
  return null;
}

const CATEGORY_COLORS: Record<string, string> = {
  nature: "#22c55e",
  cultural: "#f59e0b",
  beach: "#3b82f6",
  mountain: "#8b5cf6",
  urban: "#ef4444",
  historical: "#d97706",
  religious: "#ec4899",
  adventure: "#14b8a6",
};

function createCategoryIcon(category: string) {
  const color = CATEGORY_COLORS[category] || "#6b7280";
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

export default function MapView({
  destinations,
  center = [16.0, 106.0],
  zoom = 6,
  className = "h-[70vh] w-full",
}: MapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={`rounded-2xl ${className}`}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {destinations.length > 1 && <FitBounds destinations={destinations} />}
      {destinations.map((dest) => (
        <Marker
          key={dest.slug}
          position={[dest.coordinates.lat, dest.coordinates.lng]}
          icon={createCategoryIcon(dest.category)}
        >
          <Popup>
            <div className="w-48">
              {dest.image && (
                <img
                  src={dest.image}
                  alt={dest.nameVi}
                  className="w-full h-28 object-cover rounded-lg mb-2"
                />
              )}
              <h3 className="font-bold text-sm mb-1">{dest.nameVi}</h3>
              <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 mb-2">
                {CATEGORY_LABELS[dest.category as Category] || dest.category}
              </span>
              <br />
              <Link
                href={`/dia-danh/${dest.slug}`}
                className="text-xs text-primary-600 hover:underline font-medium"
              >
                Xem chi tiết →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
