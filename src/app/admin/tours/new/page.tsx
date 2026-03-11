"use client";

import TourForm from "@/components/admin/TourForm";
import { createTour } from "@/lib/admin-api";

export default function NewTourPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Thêm tour mới</h1>
      <TourForm onSubmit={createTour} />
    </div>
  );
}
