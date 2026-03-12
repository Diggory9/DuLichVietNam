"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import ComparisonTable from "@/components/compare/ComparisonTable";
import type { Destination } from "@/types";
import { API_URL } from "@/lib/api-config";

export default function ComparePageContent() {
  const searchParams = useSearchParams();
  const slugsParam = searchParams.get("slugs");
  const slugs = slugsParam ? slugsParam.split(",").slice(0, 4) : [];

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slugs.length < 2) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/destinations/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slugs }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setDestinations(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slugsParam]);

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          So sánh địa danh
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          So sánh các thông tin chi tiết cạnh nhau để chọn điểm đến phù hợp nhất.
        </p>

        {loading ? (
          <div className="mt-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          </div>
        ) : destinations.length < 2 ? (
          <div className="mt-12 text-center py-16">
            <p className="text-5xl mb-4">⚖️</p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Chưa có đủ địa danh để so sánh
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Hãy chọn ít nhất 2 địa danh từ trang{" "}
              <a href="/kham-pha" className="text-primary-600 hover:underline">
                Khám phá
              </a>{" "}
              để bắt đầu so sánh.
            </p>
          </div>
        ) : (
          <div className="mt-8">
            <ComparisonTable destinations={destinations} />
          </div>
        )}
      </Container>
    </section>
  );
}
