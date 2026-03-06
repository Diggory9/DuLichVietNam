"use client";

import { useEffect } from "react";
import { useViewHistory } from "@/hooks/useViewHistory";

interface ViewTrackerProps {
  destination: {
    slug: string;
    category: string;
    provinceSlug: string;
  };
}

export default function ViewTracker({ destination }: ViewTrackerProps) {
  const { addToHistory } = useViewHistory();

  useEffect(() => {
    addToHistory(destination);
  }, [destination.slug]);

  return null;
}
