"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

interface ProvinceFormProps {
  initialData?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<unknown>;
  isEdit?: boolean;
}

export default function ProvinceForm({ initialData, onSubmit, isEdit }: ProvinceFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: (initialData?.name as string) || "",
    nameVi: (initialData?.nameVi as string) || "",
    slug: (initialData?.slug as string) || "",
    region: (initialData?.region as string) || "mien-bac",
    description: (initialData?.description as string) || "",
    longDescription: (initialData?.longDescription as string) || "",
    heroImage: (initialData?.heroImage as string) || "",
    thumbnail: (initialData?.thumbnail as string) || "",
    population: (initialData?.population as string) || "",
    area: (initialData?.area as string) || "",
    bestTimeToVisit: (initialData?.bestTimeToVisit as string) || "",
    highlights: ((initialData?.highlights as string[]) || []).join("\n"),
    destinationSlugs: ((initialData?.destinationSlugs as string[]) || []).join("\n"),
    featured: (initialData?.featured as boolean) || false,
    order: (initialData?.order as number) || 0,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const target = e.target;
    const value = target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const data = {
        ...form,
        order: Number(form.order),
        highlights: form.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
        destinationSlugs: form.destinationSlugs.split("\n").map((s) => s.trim()).filter(Boolean),
      };
      await onSubmit(data);
      router.push("/admin/provinces");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi lưu dữ liệu");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-semibold border-b pb-3">Thông tin cơ bản</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên tỉnh</label>
            <input
              name="name"
              value={form.name}
              onChange={(e) => {
                handleChange(e);
                if (!isEdit) setForm((prev) => ({ ...prev, name: e.target.value, slug: generateSlug(e.target.value) }));
              }}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên tiếng Việt</label>
            <input name="nameVi" value={form.nameVi} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none" required readOnly={isEdit} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vùng miền</label>
            <select name="region" value={form.region} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none">
              <option value="mien-bac">Miền Bắc</option>
              <option value="mien-trung">Miền Trung</option>
              <option value="mien-nam">Miền Nam</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
          <textarea name="longDescription" value={form.longDescription} onChange={handleChange} rows={5} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" required />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-semibold border-b pb-3">Hình ảnh</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh hero</label>
          <ImageUploader value={form.heroImage} onChange={(url) => setForm((prev) => ({ ...prev, heroImage: url }))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh thumbnail</label>
          <ImageUploader value={form.thumbnail} onChange={(url) => setForm((prev) => ({ ...prev, thumbnail: url }))} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-semibold border-b pb-3">Thông tin thêm</h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dân số</label>
            <input name="population" value={form.population} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diện tích</label>
            <input name="area" value={form.area} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian tốt nhất</label>
            <input name="bestTimeToVisit" value={form.bestTimeToVisit} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Điểm nổi bật (mỗi dòng 1 mục)</label>
          <textarea name="highlights" value={form.highlights} onChange={handleChange} rows={4} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug địa danh (mỗi dòng 1 slug)</label>
          <textarea name="destinationSlugs" value={form.destinationSlugs} onChange={handleChange} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự hiển thị</label>
            <input name="order" type="number" value={form.order} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          <div className="flex items-center pt-6">
            <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} className="h-4 w-4 text-primary-600 rounded" />
            <label className="ml-2 text-sm text-gray-700">Tỉnh nổi bật</label>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
          {saving ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo mới"}
        </button>
        <button type="button" onClick={() => router.push("/admin/provinces")} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">
          Huỷ
        </button>
      </div>
    </form>
  );
}
