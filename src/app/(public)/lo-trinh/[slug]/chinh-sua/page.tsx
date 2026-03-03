"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Container from "@/components/ui/Container";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ItineraryDayEditor from "@/components/itinerary/ItineraryDayEditor";
import ItineraryMapPreview from "@/components/itinerary/ItineraryMapPreview";
import { useAuth } from "@/components/auth/AuthProvider";
import type { ItineraryDay, Itinerary, Destination } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function EditItineraryPage() {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [days, setDays] = useState<ItineraryDay[]>([]);
  const [destinations, setDestinations] = useState<Record<string, Destination>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/dang-nhap");
      return;
    }

    fetch(`${API_URL}/api/itineraries/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.data) {
          setItinerary(json.data);
          setTitle(json.data.title);
          setDescription(json.data.description || "");
          setDays(json.data.days || []);
        } else {
          router.push("/lo-trinh");
        }
      })
      .catch(() => router.push("/lo-trinh"))
      .finally(() => setLoading(false));
  }, [isAuthenticated, token, slug, router]);

  const fetchDestinationDetails = useCallback(async (slugs: string[]) => {
    const newSlugs = slugs.filter((s) => !destinations[s]);
    if (newSlugs.length === 0) return;

    const results: Record<string, Destination> = {};
    await Promise.all(
      newSlugs.map(async (s) => {
        try {
          const res = await fetch(`${API_URL}/api/destinations/${s}`);
          const json = await res.json();
          if (json.data) results[s] = json.data;
        } catch {}
      })
    );
    setDestinations((prev) => ({ ...prev, ...results }));
  }, [destinations]);

  useEffect(() => {
    const allSlugs = days.flatMap((d) => d.destinationSlugs);
    if (allSlugs.length > 0) fetchDestinationDetails(allSlugs);
  }, [days, fetchDestinationDetails]);

  function addDay() {
    setDays((prev) => [...prev, { dayNumber: prev.length + 1, destinationSlugs: [] }]);
  }

  function removeDay(index: number) {
    setDays((prev) =>
      prev.filter((_, i) => i !== index).map((d, i) => ({ ...d, dayNumber: i + 1 }))
    );
  }

  function updateDay(index: number, day: ItineraryDay) {
    setDays((prev) => prev.map((d, i) => (i === index ? day : d)));
  }

  async function handleSave() {
    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/itineraries/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, days }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      router.push(`/lo-trinh/${json.data.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublic() {
    try {
      const res = await fetch(`${API_URL}/api/itineraries/${slug}/toggle-public`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.data) setItinerary(json.data);
    } catch {}
  }

  async function handleDelete() {
    if (!confirm("Xoá lộ trình này? Hành động không thể hoàn tác.")) return;
    try {
      await fetch(`${API_URL}/api/itineraries/${slug}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/lo-trinh");
    } catch {}
  }

  if (!isAuthenticated || loading) {
    return (
      <section className="py-8 sm:py-12">
        <Container>
          <div className="text-center py-16 text-gray-400">Đang tải...</div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Breadcrumb
          items={[
            { label: "Lộ trình", href: "/lo-trinh" },
            { label: itinerary?.title || "Chỉnh sửa" },
          ]}
        />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Chỉnh sửa lộ trình
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePublic}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                itinerary?.isPublic
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {itinerary?.isPublic ? "Công khai" : "Riêng tư"}
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Xoá
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Lịch trình ({days.length} ngày)
                </h2>
                <button onClick={addDay} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
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

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : "Cập nhật lộ trình"}
            </button>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Xem trước bản đồ</h2>
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
