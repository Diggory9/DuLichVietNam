"use client";

import ProvinceForm from "@/components/admin/ProvinceForm";
import { createProvince } from "@/lib/admin-api";

export default function NewProvincePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Thêm tỉnh mới</h1>
      <ProvinceForm onSubmit={createProvince} />
    </div>
  );
}
