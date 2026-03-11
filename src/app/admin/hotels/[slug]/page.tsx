"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HotelForm from "@/components/admin/HotelForm";
import { fetchHotel, updateHotel } from "@/lib/admin-api";
import Skeleton from "@/components/ui/Skeleton";

export default function EditHotelPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetchHotel(slug)
      .then((d) => setData(d as Record<string, unknown>))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl space-y-4">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-red-600">Không tìm thấy khách sạn</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sửa khách sạn</h1>
      <HotelForm
        initialData={data}
        onSubmit={(formData) => updateHotel(slug, formData)}
        isEdit
      />
    </div>
  );
}
