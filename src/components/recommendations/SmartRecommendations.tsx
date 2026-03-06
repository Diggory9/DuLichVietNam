"use client";

import { useEffect, useState } from "react";
import { useViewHistory } from "@/hooks/useViewHistory";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import DestinationCardClient from "@/components/search/DestinationCardClient";
import Container from "@/components/ui/Container";
import AnimatedSection from "@/components/shared/AnimatedSection";
import type { Destination } from "@/types";
import { CATEGORY_LABELS } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SmartRecommendations() {
  const { getTopCategories, getTopProvinces, getViewedSlugs } = useViewHistory();
  const { favorites } = useFavorites();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [topCats, setTopCats] = useState<string[]>([]);

  useEffect(() => {
    const categories = getTopCategories(3);
    const provinces = getTopProvinces(3);
    const viewedSlugs = getViewedSlugs();
    const excludeSlugs = [...new Set([...viewedSlugs, ...favorites])];

    setTopCats(categories);

    if (categories.length === 0 && provinces.length === 0) {
      setLoading(false);
      return;
    }

    const params = new URLSearchParams();
    if (categories.length > 0) params.set("categories", categories.join(","));
    if (provinces.length > 0) params.set("provinces", provinces.join(","));
    if (excludeSlugs.length > 0) params.set("excludeSlugs", excludeSlugs.join(","));
    params.set("limit", "6");

    fetch(`${API_URL}/api/destinations/recommendations?${params}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setDestinations(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [favorites, getTopCategories, getTopProvinces, getViewedSlugs]);

  if (!loading && destinations.length === 0 && topCats.length === 0) {
    return null;
  }

  if (!loading && destinations.length === 0 && topCats.length > 0) {
    return (
      <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
        <Container>
          <AnimatedSection>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Gợi ý cho bạn
            </h2>
            <div className="mt-8 text-center py-12">
              <p className="text-4xl mb-3">🧭</p>
              <p className="text-gray-500 dark:text-gray-400">
                Hãy khám phá thêm để nhận gợi ý cá nhân hoá!
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    );
  }

  const getReasonTag = (d: Destination): string | null => {
    const catLabel = CATEGORY_LABELS[d.category];
    if (topCats.includes(d.category) && catLabel) {
      return `Vì bạn thích ${catLabel}`;
    }
    return null;
  };

  return (
    <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
      <Container>
        <AnimatedSection>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Gợi ý cho bạn
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Dựa trên sở thích và lịch sử khám phá của bạn
          </p>
        </AnimatedSection>

        {loading ? (
          <div className="mt-8 flex justify-center">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d) => {
              const reason = getReasonTag(d);
              return (
                <div key={d.slug} className="relative">
                  <DestinationCardClient destination={d} />
                  {reason && (
                    <span className="absolute bottom-3 left-3 bg-primary-600 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-md z-10">
                      {reason}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
