"use client";

import DestinationForm from "@/components/admin/DestinationForm";
import { createDestination } from "@/lib/admin-api";

export default function NewDestinationPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Thêm địa danh mới</h1>
      <DestinationForm onSubmit={createDestination} />
    </div>
  );
}
