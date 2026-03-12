"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ItineraryDayEditor from "@/components/itinerary/ItineraryDayEditor";
import ItineraryMapPreview from "@/components/itinerary/ItineraryMapPreview";
import CostSummary from "@/components/itinerary/CostSummary";
import { useAuth } from "@/components/auth/AuthProvider";
import type { ItineraryDay, Destination } from "@/types";
import { API_URL } from "@/lib/api-config";

export default function CreateItineraryPage() {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalBudget, setTotalBudget] = useState<number | undefined>();
  const [days, setDays] = useState<ItineraryDay[]>([
    { dayNumber: 1, destinationSlugs: [] },
  ]);
  const [destinations, setDestinations] = useState<Record<string, Destination>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dang-nhap");
    }
  }, [isAuthenticated, router]);

  // Fetch destination details for all slugs in days
  const fetchDestinationDetails = useCallback(async (slugs: string[]) => {
    const newSlugs = slugs.filter((s) => !destinations[s]);
    if (newSlugs.length === 0) return;

    const results: Record<string, Destination> = {};
    await Promise.all(
      newSlugs.map(async (slug) => {
        try {
          const res = await fetch(`${API_URL}/api/destinations/${slug}`);
          const json = await res.json();
          if (json.data) results[slug] = json.data;
        } catch {}
      })
    );
    setDestinations((prev) => ({ ...prev, ...results }));
  }, [destinations]);

  useEffect(() => {
    const allSlugs = days.flatMap((d) => d.destinationSlugs);
    if (allSlugs.length > 0) {
      fetchDestinationDetails(allSlugs);
    }
  }, [days, fetchDestinationDetails]);

  function addDay() {
    setDays((prev) => [
      ...prev,
      { dayNumber: prev.length + 1, destinationSlugs: [] },
    ]);
  }

  function removeDay(index: number) {
    setDays((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((d, i) => ({ ...d, dayNumber: i + 1 }))
    );
  }

  function updateDay(index: number, day: ItineraryDay) {
    setDays((prev) => prev.map((d, i) => (i === index ? day : d)));
  }

  async function handleSave() {
    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề lộ trình");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/itineraries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, days, totalBudget }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Lỗi tạo lộ trình");
      router.push(`/lo-trinh/${json.data.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setSaving(false);
    }
  }

  if (!isAuthenticated) return null;

  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Breadcrumb
          items={[
            { label: "Lộ trình", href: "/lo-trinh" },
            { label: "Tạo mới" },
          ]}
        />

        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-6">
          Tạo lộ trình mới
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Khám phá miền Trung 5 ngày"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả ngắn về lộ trình..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngân sách dự kiến (VND)
              </label>
              <input
                type="text"
                value={totalBudget ? totalBudget.toLocaleString("vi-VN") : ""}
                onChange={(e) => {
                  const num = parseInt(e.target.value.replace(/\D/g, ""), 10);
                  setTotalBudget(isNaN(num) ? undefined : num);
                }}
                placeholder="Ví dụ: 5,000,000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Lịch trình ({days.length} ngày)
                </h2>
                <button
                  onClick={addDay}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  + Thêm ngày
                </button>
              </div>

              {days.map((day, idx) => (
                <ItineraryDayEditor
                  key={idx}
                  day={day}
                  destinations={destinations}
                  onChange={(updated) => updateDay(idx, updated)}
                  onRemove={() => removeDay(idx)}
                />
              ))}
            </div>

            {/* Cost Summary */}
            <CostSummary
              days={days}
              destinations={destinations}
              totalBudget={totalBudget}
            />

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : "Lưu lộ trình"}
            </button>
          </div>

          {/* Right: Map Preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Xem trước bản đồ
            </h2>
            <ItineraryMapPreview
              days={days}
              destinations={destinations}
              className="h-[400px] lg:h-[500px] w-full"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
