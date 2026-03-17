"use client";

import dynamic from "next/dynamic";

const SmartRecommendations = dynamic(
  () => import("@/components/recommendations/SmartRecommendations"),
  { ssr: false }
);

export default function SmartRecommendationsWrapper() {
  return <SmartRecommendations />;
}
