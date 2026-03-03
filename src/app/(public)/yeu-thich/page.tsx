"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import DestinationCardClient from "@/components/search/DestinationCardClient";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import type { Destination } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length === 0) {
      setDestinations([]);
      setLoading(false);
      return;
    }

    Promise.all(
      favorites.map(async (slug) => {
        try {
          const res = await fetch(`${API_URL}/api/destinations/${slug}`);
          if (!res.ok) return null;
          const json = await res.json();
          return json.data as Destination;
        } catch {
          return null;
        }
      })
    ).then((results) => {
      setDestinations(results.filter(Boolean) as Destination[]);
      setLoading(false);
    });
  }, [favorites]);

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Địa danh yêu thích
        </h1>
        <p className="mt-2 text-gray-500">
          Những địa danh bạn đã lưu để khám phá sau
        </p>

        {loading ? (
          <div className="mt-8 text-gray-500">Đang tải...</div>
        ) : destinations.length === 0 ? (
          <div className="mt-12 text-center py-16">
            <span className="text-5xl">💝</span>
            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Bạn chưa lưu địa danh nào
            </h2>
            <p className="mt-2 text-gray-500">
              Nhấn vào biểu tượng trái tim trên các địa danh để lưu lại
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d) => (
              <DestinationCardClient key={d.slug} destination={d} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
