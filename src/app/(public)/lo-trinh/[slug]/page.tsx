"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Container from "@/components/ui/Container";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { useAuth } from "@/components/auth/AuthProvider";
import ItineraryDetailClient from "./ItineraryDetailClient";
import type { Itinerary, Destination } from "@/types";
import Skeleton from "@/components/ui/Skeleton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ItineraryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { token, isAuthenticated } = useAuth();

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [destinations, setDestinations] = useState<Record<string, Destination>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch itinerary (with token if logged in)
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const headers: Record<string, string> = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/api/itineraries/${slug}`, { headers });
        const json = await res.json();

        if (!res.ok) {
          if (res.status === 403) {
            setError("Bạn không có quyền xem lộ trình này");
          } else if (res.status === 404) {
            setError("Không tìm thấy lộ trình");
          } else {
            setError(json.message || "Lỗi tải lộ trình");
          }
          return;
        }

        setItinerary(json.data);
      } catch {
        setError("Không thể kết nối server");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, token]);

  // Fetch destination details when itinerary is loaded
  const fetchDestinations = useCallback(async (slugs: string[]) => {
    const results: Record<string, Destination> = {};
    await Promise.all(
      slugs.map(async (s) => {
        try {
          const res = await fetch(`${API_URL}/api/destinations/${s}`);
          const json = await res.json();
          if (json.data) results[s] = json.data;
        } catch {}
      })
    );
    setDestinations(results);
  }, []);

  useEffect(() => {
    if (!itinerary) return;
    const allSlugs = [...new Set(itinerary.days.flatMap((d) => d.destinationSlugs))];
    if (allSlugs.length > 0) fetchDestinations(allSlugs);
  }, [itinerary, fetchDestinations]);

  if (loading) {
    return (
      <section className="py-8 sm:py-12">
        <Container>
          <Skeleton className="h-5 w-40 mb-4" />
          <Skeleton className="h-10 w-80 mb-3" />
          <Skeleton className="h-5 w-60 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 sm:py-12">
        <Container>
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">{error}</p>
            {error.includes("quyền") && !isAuthenticated && (
              <p className="mt-2 text-sm text-gray-400">
                Lộ trình này ở chế độ riêng tư.{" "}
                <a href="/dang-nhap" className="text-primary-600 hover:underline">
                  Đăng nhập
                </a>{" "}
                nếu bạn là chủ lộ trình.
              </p>
            )}
          </div>
        </Container>
      </section>
    );
  }

  if (!itinerary) return null;

  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Breadcrumb
          items={[
            { label: "Lộ trình", href: "/lo-trinh" },
            { label: itinerary.title },
          ]}
        />
        <ItineraryDetailClient itinerary={itinerary} destinations={destinations} />
      </Container>
    </section>
  );
}
