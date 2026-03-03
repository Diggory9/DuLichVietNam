"use client";

import dynamic from "next/dynamic";
import type { MapDestination } from "./MapView";

const MapView = dynamic(() => import("./MapView"), { ssr: false });

interface MapViewLazyProps {
  destinations: MapDestination[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function MapViewLazy(props: MapViewLazyProps) {
  return <MapView {...props} />;
}
