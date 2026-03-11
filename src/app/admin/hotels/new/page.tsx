"use client";

import HotelForm from "@/components/admin/HotelForm";
import { createHotel } from "@/lib/admin-api";

export default function NewHotelPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Thêm khách sạn mới</h1>
      <HotelForm onSubmit={createHotel} />
    </div>
  );
}
